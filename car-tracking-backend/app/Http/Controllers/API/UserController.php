<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users (admin only).
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::with('subscriptionPlan')->paginate(20);
        
        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Store a new user (admin only).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'role' => 'required|in:admin,user,company',
            'company_name' => 'nullable|string|max:255',
            'subscription_plan_id' => 'nullable|exists:subscription_plans,id',
            'subscription_ends_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userData = $request->all();
        $userData['password'] = Hash::make($request->password);
        
        $user = User::create($userData);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display a specific user (admin only).
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with(['subscriptionPlan', 'vehicles', 'payments'])->findOrFail($id);
        
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Update a user's information (admin or self).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id = null)
    {
        // If ID is null, user is updating their own profile
        if (is_null($id)) {
            $user = $request->user();
            
            // Regular users can only update certain fields
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'phone_number' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'company_name' => 'nullable|string|max:255',
            ]);
            
            // Users cannot change their role
            $request->request->remove('role');
            $request->request->remove('subscription_plan_id');
            $request->request->remove('subscription_ends_at');
        } else {
            // Admin is updating someone else's profile
            $user = User::findOrFail($id);
            
            // Admins can update all fields
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'nullable|string|min:8',
                'phone_number' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'role' => 'sometimes|required|in:admin,user,company',
                'company_name' => 'nullable|string|max:255',
                'subscription_plan_id' => 'nullable|exists:subscription_plans,id',
                'subscription_ends_at' => 'nullable|date',
            ]);
        }

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userData = $request->except(['password', 'password_confirmation']);
        
        // Update password if provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }
        
        $user->update($userData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove a user (admin only).
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting the last admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json([
                'message' => 'Cannot delete the last admin user'
            ], 422);
        }
        
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get the authenticated user's subscription.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function subscription(Request $request)
    {
        $user = $request->user()->load('subscriptionPlan');
        
        if (!$user->subscription_plan_id) {
            return response()->json([
                'message' => 'No active subscription',
                'subscription' => null
            ]);
        }
        
        return response()->json([
            'subscription' => [
                'plan' => $user->subscriptionPlan,
                'ends_at' => $user->subscription_ends_at,
                'is_active' => $user->hasActiveSubscription()
            ]
        ]);
    }
} 