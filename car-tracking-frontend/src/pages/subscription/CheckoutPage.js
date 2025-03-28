import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Alert from "../../components/common/Alert";

const API_URL = "http://localhost:8000/api";

const CheckoutPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    cardHolderName: "",
  });
  const [useExistingPaymentMethod, setUseExistingPaymentMethod] =
    useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const [planResponse, userSubscriptionResponse, paymentMethodResponse] =
          await Promise.all([
            axios.get(`${API_URL}/subscription-plans/${planId}`),
            axios.get(`${API_URL}/user/subscription`),
            axios.get(`${API_URL}/user/payment-method`),
          ]);

        setPlan(planResponse.data.plan);
        setCurrentPlan(userSubscriptionResponse.data.subscription);
        setPaymentMethod(paymentMethodResponse.data.payment_method);
        setUseExistingPaymentMethod(
          !!paymentMethodResponse.data.payment_method
        );

        setError(null);
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        setError("Failed to load checkout information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [planId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentMethod({
      ...newPaymentMethod,
      [name]: value,
    });
  };

  const handlePaymentMethodToggle = (useExisting) => {
    setUseExistingPaymentMethod(useExisting);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/subscription/checkout`, {
        plan_id: planId,
        use_existing_payment_method: useExistingPaymentMethod,
        payment_method: !useExistingPaymentMethod ? newPaymentMethod : null,
      });

      setSuccess("Your subscription has been processed successfully!");

      // Redirect to subscription details after a brief delay
      setTimeout(() => {
        navigate("/subscription/plans");
      }, 2000);
    } catch (err) {
      console.error("Error processing subscription:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to process your subscription. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Subscription Plan Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The subscription plan you're looking for doesn't exist or is no
            longer available.
          </p>
          <Link
            to="/subscription/plans"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          to="/subscription/plans"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Plans
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Checkout</h1>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && <Alert type="success" message={success} />}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Checkout form */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Payment Information
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {/* Payment Method Selection */}
              {paymentMethod && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </h3>
                  <div className="flex flex-col space-y-3">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="existing-payment"
                          name="payment-method"
                          type="radio"
                          checked={useExistingPaymentMethod}
                          onChange={() => handlePaymentMethodToggle(true)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="existing-payment"
                          className="font-medium text-gray-700"
                        >
                          Use existing card
                        </label>
                        <p className="text-gray-500">
                          {paymentMethod.brand} ending in {paymentMethod.last4}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-payment"
                          name="payment-method"
                          type="radio"
                          checked={!useExistingPaymentMethod}
                          onChange={() => handlePaymentMethodToggle(false)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="new-payment"
                          className="font-medium text-gray-700"
                        >
                          Use a new payment method
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* New Payment Method Form */}
              {(!paymentMethod || !useExistingPaymentMethod) && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="cardHolderName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardHolderName"
                      name="cardHolderName"
                      value={newPaymentMethod.cardHolderName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={newPaymentMethod.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="expMonth"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expiry Month
                      </label>
                      <input
                        type="text"
                        id="expMonth"
                        name="expMonth"
                        value={newPaymentMethod.expMonth}
                        onChange={handleInputChange}
                        placeholder="MM"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="expYear"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expiry Year
                      </label>
                      <input
                        type="text"
                        id="expYear"
                        name="expYear"
                        value={newPaymentMethod.expYear}
                        onChange={handleInputChange}
                        placeholder="YY"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        value={newPaymentMethod.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>{currentPlan ? "Change Subscription" : "Subscribe Now"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column - Order summary */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Order Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">
                      {plan.name}
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      ${plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Billed {plan.billing_cycle}
                  </p>
                </div>

                {currentPlan && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        Current Plan:
                      </span>
                      <span className="text-gray-700">{currentPlan.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your subscription will be updated immediately upon
                      confirmation.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      ${plan.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Plan Features
                </h3>
                <ul className="space-y-2">
                  {plan.features &&
                    plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
