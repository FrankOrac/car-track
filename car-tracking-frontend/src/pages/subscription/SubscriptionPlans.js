import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

const API_URL = "http://localhost:8000/api";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all available subscription plans
        const plansResponse = await axios.get(`${API_URL}/subscription-plans`);
        setPlans(plansResponse.data.subscription_plans || []);

        // Fetch current user's subscription info
        const subscriptionResponse = await axios.get(
          `${API_URL}/user/subscription`
        );
        setCurrentSubscription(subscriptionResponse.data.subscription);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setError("Failed to load subscription data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubscribe = async (planId) => {
    if (processingPayment) return;

    setSelectedPlan(planId);
    setProcessingPayment(true);

    try {
      // In a real app, this would typically redirect to a payment page
      // For this demo, we'll simulate a direct payment
      const response = await axios.post(`${API_URL}/subscribe`, {
        subscription_plan_id: planId,
        payment_method: "credit_card", // Simplified for demo
      });

      // Update the current subscription after successful payment
      setCurrentSubscription(response.data.subscription);

      // Show success message or redirect
      // For demo, we'll just redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error processing subscription:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Failed to process subscription. Please try again.");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const isCurrentPlan = (planId) => {
    return (
      currentSubscription &&
      currentSubscription.plan &&
      currentSubscription.plan.id === planId
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Choose Your Subscription Plan
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Get real-time tracking, alerts, and comprehensive reporting for your
          vehicles.
        </p>

        {currentSubscription && currentSubscription.is_active && (
          <div className="mt-4 inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>
              You're currently subscribed to the{" "}
              <strong>{currentSubscription.plan.name}</strong> plan
              {currentSubscription.ends_at && (
                <>
                  {" "}
                  until{" "}
                  {new Date(currentSubscription.ends_at).toLocaleDateString()}
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-700 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all ${
              isCurrentPlan(plan.id)
                ? "border-blue-500 transform scale-105"
                : "border-transparent hover:shadow-xl"
            }`}
          >
            <div className="p-6 pb-2">
              <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-gray-900">
                <span className="text-3xl font-bold tracking-tight">
                  ${plan.price}
                </span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-500 h-12">
                {plan.description}
              </p>
            </div>

            <div className="px-6 pb-6">
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    Up to {plan.max_vehicles} vehicles
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    Real-time tracking
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    Alerts & notifications
                  </p>
                </li>
                {plan.price >= 29.99 && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Custom geofencing
                    </p>
                  </li>
                )}
                {plan.price >= 99.99 && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      Priority support
                    </p>
                  </li>
                )}
              </ul>

              <div className="mt-8">
                {isCurrentPlan(plan.id) ? (
                  <button
                    className="w-full bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium"
                    disabled
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processingPayment}
                    className={`w-full px-4 py-2 rounded-md font-medium ${
                      processingPayment && selectedPlan === plan.id
                        ? "bg-blue-400 text-white cursor-wait"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {processingPayment && selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                        Processing...
                      </span>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>All plans include a 30-day money-back guarantee.</p>
        <p className="mt-1">
          Need help choosing the right plan?{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Contact our sales team
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
