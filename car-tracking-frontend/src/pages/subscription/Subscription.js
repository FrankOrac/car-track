import React, { useState, useEffect } from "react";
import axios from "axios";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const [plansResponse, currentPlanResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/subscription-plans"),
          axios.get("http://localhost:8000/api/subscription/current"),
        ]);
        setPlans(plansResponse.data);
        setCurrentPlan(currentPlanResponse.data);
      } catch (err) {
        setError("Failed to fetch subscription data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/subscription/subscribe",
        {
          plan_id: planId,
        }
      );
      // Handle successful subscription
      console.log("Subscription successful:", response.data);
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Subscription Plans
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <p className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                        <span className="text-base font-medium text-gray-500">
                          /{plan.duration_in_days} days
                        </span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Max vehicles: {plan.max_vehicles}
                      </p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={currentPlan?.id === plan.id}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          currentPlan?.id === plan.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {currentPlan?.id === plan.id
                          ? "Current Plan"
                          : "Subscribe"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
