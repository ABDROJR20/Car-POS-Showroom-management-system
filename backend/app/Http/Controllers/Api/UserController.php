<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json(['status' => 'success', 'data' => $users]);
    }

    public function getRoles()
    {
        $roles = Role::withCount('users')->get();
        return response()->json(['status' => 'success', 'data' => $roles]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'phone' => 'nullable|string',
        ]);

        $role = Role::findOrFail($validated['role_id']);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id,
            'role_name' => $role->name,
            'phone' => $validated['phone'] ?? null,
            'status' => 'Active',
        ]);

        return response()->json(['status' => 'success', 'message' => 'Staff user created.', 'data' => $user->load('role')], 201);
    }
}
