import React from "react";

const SubscriptionPlans = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
        <p className="text-gray-600">
          Choose the plan that best fits your vehicle tracking needs
        </p>
      </div>

      <div className="py-10 px-6 text-center bg-white rounded-lg shadow">
        <p className="text-gray-500">Loading subscription plans...</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
