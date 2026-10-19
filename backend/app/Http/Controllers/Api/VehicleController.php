<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleDocument;
use App\Models\VehicleImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::with(['images', 'documents', 'expenses']);

        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        if ($request->has('ownership_type') && $request->ownership_type !== 'ALL') {
            $query->where('ownership_type', $request->ownership_type);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('registration_no', 'like', "%{$search}%")
                  ->orWhere('chassis_no', 'like', "%{$search}%")
                  ->orWhere('stock_code', 'like', "%{$search}%");
            });
        }

        $vehicles = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $vehicles,
        ]);
    }

    public function show($id)
    {
        $vehicle = Vehicle::with(['images', 'documents', 'expenses', 'sales', 'purchases'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $vehicle,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_no' => 'required|string|unique:vehicles,registration_no',
            'chassis_no' => 'required|string|unique:vehicles,chassis_no',
            'engine_no' => 'required|string|unique:vehicles,engine_no',
            'make' => 'required|string',
            'model' => 'required|string',
            'variant' => 'nullable|string',
            'model_year' => 'required|integer',
            'color' => 'required|string',
            'fuel_type' => 'required|string',
            'transmission' => 'required|string',
            'engine_capacity_cc' => 'nullable|integer',
            'mileage_km' => 'nullable|integer',
            'registration_city' => 'nullable|string',
            'assembly' => 'nullable|string',
            'ownership_type' => 'required|in:Showroom,Client,Investor',
            'owner_name' => 'nullable|string',
            'owner_phone' => 'nullable|string',
            'owner_cnic' => 'nullable|string',
            'owner_payable' => 'nullable|numeric',
            'investor_profit_share_pct' => 'nullable|numeric',
            'cost_price' => 'required|numeric|min:0',
            'demand_price' => 'required|numeric|min:0',
            'minimum_price' => 'nullable|numeric',
            'status' => 'nullable|in:Available,Reserved,Sold,In Refurbishment',
            'condition_notes' => 'nullable|string',
            'primary_image' => 'nullable|string',
            'purchase_date' => 'nullable|date',
        ]);

        $count = Vehicle::count();
        $validated['stock_code'] = 'STK-' . date('Y') . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);
        $validated['status'] = $validated['status'] ?? 'Available';

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle registered successfully onto showroom inventory floor.',
            'data' => $vehicle,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'registration_no' => 'sometimes|string|unique:vehicles,registration_no,' . $vehicle->id,
            'chassis_no' => 'sometimes|string|unique:vehicles,chassis_no,' . $vehicle->id,
            'engine_no' => 'sometimes|string|unique:vehicles,engine_no,' . $vehicle->id,
            'make' => 'sometimes|string',
            'model' => 'sometimes|string',
            'variant' => 'nullable|string',
            'model_year' => 'sometimes|integer',
            'color' => 'sometimes|string',
            'fuel_type' => 'sometimes|string',
            'transmission' => 'sometimes|string',
            'engine_capacity_cc' => 'nullable|integer',
            'mileage_km' => 'nullable|integer',
            'registration_city' => 'nullable|string',
            'assembly' => 'nullable|string',
            'ownership_type' => 'sometimes|in:Showroom,Client,Investor',
            'owner_name' => 'nullable|string',
            'owner_phone' => 'nullable|string',
            'owner_cnic' => 'nullable|string',
            'owner_payable' => 'nullable|numeric',
            'investor_profit_share_pct' => 'nullable|numeric',
            'cost_price' => 'sometimes|numeric|min:0',
            'demand_price' => 'sometimes|numeric|min:0',
            'minimum_price' => 'nullable|numeric',
            'status' => 'sometimes|in:Available,Reserved,Sold,In Refurbishment',
            'condition_notes' => 'nullable|string',
            'primary_image' => 'nullable|string',
            'total_expenses' => 'nullable|numeric',
        ]);

        $vehicle->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle record updated successfully.',
            'data' => $vehicle,
        ]);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        if ($vehicle->status === 'Sold') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete vehicle in Sold status with completed financial ledger records.',
            ], 422);
        }

        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle removed from floor inventory.',
        ]);
    }

    public function uploadImage(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_primary' => 'nullable|boolean',
        ]);

        $path = $request->file('image')->store('vehicles', 'public');
        $img = VehicleImage::create([
            'vehicle_id' => $vehicle->id,
            'image_path' => '/storage/' . $path,
            'caption' => $request->caption ?? ($vehicle->make . ' ' . $vehicle->model),
            'is_primary' => $request->boolean('is_primary', false),
        ]);

        if ($request->boolean('is_primary') || !$vehicle->primary_image) {
            $vehicle->update(['primary_image' => '/storage/' . $path]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle image uploaded.',
            'data' => $img,
        ]);
    }

    public function uploadDocument(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpeg,png,jpg|max:10240',
            'document_type' => 'required|string',
            'document_no' => 'nullable|string',
        ]);

        $path = $request->file('document')->store('vehicle_documents', 'public');
        $doc = VehicleDocument::create([
            'vehicle_id' => $vehicle->id,
            'document_type' => $request->document_type,
            'file_path' => '/storage/' . $path,
            'document_no' => $request->document_no,
            'status' => 'Verified',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vehicle document verified and archived.',
            'data' => $doc,
        ]);
    }
}
