<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DemandLead;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class DemandController extends Controller
{
    public function index()
    {
        $demands = DemandLead::with('matchedVehicle')->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $demands,
        ]);
    }

    public function show($id)
    {
        $demand = DemandLead::with('matchedVehicle')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $demand,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer' => 'required|string',
            'phone' => 'required|string',
            'city' => 'nullable|string',
            'make' => 'required|string',
            'model' => 'required|string',
            'variant' => 'nullable|string',
            'min_year' => 'nullable|integer',
            'max_year' => 'nullable|integer',
            'budget' => 'nullable|numeric',
            'color' => 'nullable|string',
            'transmission' => 'nullable|string',
            'fuel_type' => 'nullable|string',
            'max_mileage_km' => 'nullable|integer',
            'notes' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $count = DemandLead::count();
        $validated['demand_no'] = 'DMD-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
        $validated['date'] = $validated['date'] ?? date('Y-m-d');
        $validated['status'] = 'Active';

        $demand = DemandLead::create($validated);

        // Run auto-matcher
        $matches = $this->calculateMatches($demand);
        if (count($matches) > 0) {
            $best = $matches[0];
            $demand->update([
                'status' => 'Matched',
                'matched_vehicle_id' => $best['vehicle']->id,
                'matched_vehicle_summary' => "{$best['vehicle']->make} {$best['vehicle']->model} ({$best['vehicle']->model_year}) • {$best['vehicle']->registration_no}",
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Customer demand captured and matched against active inventory.',
            'data' => $demand->fresh('matchedVehicle'),
            'matches' => $matches,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $demand = DemandLead::findOrFail($id);
        $demand->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Demand lead updated.',
            'data' => $demand,
        ]);
    }

    public function destroy($id)
    {
        $demand = DemandLead::findOrFail($id);
        $demand->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Demand lead deleted.',
        ]);
    }

    public function getMatches($id)
    {
        $demand = DemandLead::findOrFail($id);
        $matches = $this->calculateMatches($demand);

        return response()->json([
            'status' => 'success',
            'data' => $matches,
        ]);
    }

    private function calculateMatches(DemandLead $demand)
    {
        $floorCars = Vehicle::whereIn('status', ['Available', 'Reserved'])->get();
        $results = [];

        foreach ($floorCars as $car) {
            $score = 0;
            $reasons = [];

            if (strtolower($car->make) === strtolower($demand->make)) {
                $score += 30;
                $reasons[] = 'Make Matched';
            }

            if (stripos($car->model, $demand->model) !== false || stripos($demand->model, $car->model) !== false) {
                $score += 30;
                $reasons[] = 'Model Matched';
            }

            $vYear = (int) $car->model_year;
            if ($vYear >= (int) $demand->min_year && $vYear <= (int) $demand->max_year) {
                $score += 15;
                $reasons[] = "Year in range ({$vYear})";
            }

            $carPrice = (float) ($car->demand_price ?: $car->cost_price);
            $demandBudget = (float) $demand->budget;
            if ($demandBudget > 0 && $carPrice <= $demandBudget) {
                $score += 15;
                $reasons[] = 'Within budget';
            } elseif ($demandBudget > 0 && $carPrice <= $demandBudget * 1.10) {
                $score += 10;
                $reasons[] = 'Negotiable price (+10% budget)';
            }

            if ($demand->transmission === 'Any' || strtolower($car->transmission) === strtolower($demand->transmission)) {
                $score += 5;
                $reasons[] = 'Transmission Matched';
            }

            if ($score >= 45) {
                $results[] = [
                    'vehicle' => $car,
                    'score' => $score,
                    'reasons' => $reasons,
                ];
            }
        }

        usort($results, fn($a, $b) => $b['score'] <=> $a['score']);
        return $results;
    }
}
