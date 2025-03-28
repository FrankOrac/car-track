<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     * (Admin only)
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $payments = Payment::with(['user', 'subscriptionPlan'])
                           ->orderBy('created_at', 'desc')
                           ->paginate(20);
        
        return response()->json([
            'payments' => $payments
        ]);
    }

    /**
     * Get payments for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function userPayments(Request $request)
    {
        $payments = $request->user()->payments()
                                    ->with(['subscriptionPlan'])
                                    ->orderBy('created_at', 'desc')
                                    ->paginate(10);
        
        return response()->json([
            'payments' => $payments
        ]);
    }

    /**
     * Process a subscription payment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subscription_plan_id' => 'required|exists:subscription_plans,id',
            'payment_method' => 'required|string',
            // Additional fields for payment processing would be validated here
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan = SubscriptionPlan::findOrFail($request->subscription_plan_id);
        
        // Check if plan is active
        if (!$plan->is_active) {
            return response()->json([
                'message' => 'This subscription plan is not currently available'
            ], 422);
        }
        
        // Here you would normally process the payment with a payment gateway
        // For this example, we'll simulate a successful payment
        
        $user = $request->user();
        $paymentDate = now();
        $expiryDate = Carbon::now()->addDays($plan->duration_in_days);
        
        // Create a payment record
        $payment = new Payment();
        $payment->user_id = $user->id;
        $payment->subscription_plan_id = $plan->id;
        $payment->payment_method = $request->payment_method;
        $payment->amount = $plan->price;
        $payment->currency = 'USD'; // Default or configurable
        $payment->status = 'completed'; // In a real implementation, this might start as 'pending'
        $payment->payment_date = $paymentDate;
        $payment->expiry_date = $expiryDate;
        $payment->payment_id = 'sim_' . uniqid(); // In real implementation, this would come from payment gateway
        $payment->save();
        
        // Update user's subscription
        $user->subscription_plan_id = $plan->id;
        $user->subscription_ends_at = $expiryDate;
        $user->save();
        
        return response()->json([
            'message' => 'Subscription processed successfully',
            'payment' => $payment,
            'subscription' => [
                'plan' => $plan,
                'ends_at' => $expiryDate
            ]
        ]);
    }

    /**
     * Cancel a subscription.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function cancelSubscription(Request $request)
    {
        $user = $request->user();
        
        if (!$user->subscription_plan_id) {
            return response()->json([
                'message' => 'You do not have an active subscription to cancel'
            ], 422);
        }
        
        // In a real implementation, you might communicate with the payment provider
        // to cancel recurring payments
        
        // Record end of subscription (won't renew, but allow current period to continue)
        $user->subscription_ends_at = null;
        $user->save();
        
        return response()->json([
            'message' => 'Subscription has been canceled'
        ]);
    }
} 