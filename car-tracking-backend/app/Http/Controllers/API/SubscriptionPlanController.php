<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\Validator;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $plans = SubscriptionPlan::where('is_active', true)->get();
        
        return response()->json([
            'subscription_plans' => $plans
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * (Admin only)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_in_days' => 'required|integer|min:1',
            'max_vehicles' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan = SubscriptionPlan::create($request->all());

        return response()->json([
            'message' => 'Subscription plan created successfully',
            'subscription_plan' => $plan
        ], 201);
    }

    /**
     * Display the specified resource.
     * (Admin only)
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        
        return response()->json([
            'subscription_plan' => $plan
        ]);
    }

    /**
     * Update the specified resource in storage.
     * (Admin only)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration_in_days' => 'sometimes|required|integer|min:1',
            'max_vehicles' => 'sometimes|required|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan->update($request->all());

        return response()->json([
            'message' => 'Subscription plan updated successfully',
            'subscription_plan' => $plan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * (Admin only)
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        
        // Check if there are users with this plan
        if ($plan->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete subscription plan that is in use by users'
            ], 422);
        }
        
        $plan->delete();

        return response()->json([
            'message' => 'Subscription plan deleted successfully'
        ]);
    }
} 