import { useEffect, useState } from "react";
import axios from "axios";

function Subscription() {
const [subscription, setSubscription] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadSubscription();
}, []);

const loadSubscription = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://localhost:5001/api/subscription/current",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSubscription(res.data);
  } catch (err) {
    console.error(err);

    setSubscription({
      planName: "Trial",
      isActive: true,
      daysRemaining: 3,
    });
  } finally {
    setLoading(false);
  }
};

  const plans = [
    {
      name: "Basic",
      price: "₹499 / month",
      features: [
        "Patient Management",
        "Visits",
        "Payments",
      ],
    },
    {
      name: "Standard",
      price: "₹999 / month",
      features: [
        "Everything in Basic",
        "Reports",
        "Dashboard Analytics",
      ],
    },
    {
      name: "Premium",
      price: "₹1499 / month",
      features: [
        "Everything in Standard",
        "Priority Support",
        "Advanced Analytics",
      ],
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading subscription...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Subscription
        </h1>
        <p className="text-gray-500">
          Manage your clinic subscription plan
        </p>
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <h2 className="text-lg font-semibold mb-4">
          Current Plan
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <div>
            <p className="text-sm text-gray-500">
              Plan
            </p>
            <p className="font-semibold">
              {subscription?.planName || "Trial"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                subscription?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {subscription?.isActive
                ? "Active"
                : "Expired"}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Expires On
            </p>
            <p className="font-medium">
              {subscription?.expiryDate
                ? new Date(
                    subscription.expiryDate
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Days Remaining
            </p>
            <p className="font-semibold text-blue-600">
              {subscription?.daysRemaining || 0}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
          >
            Renew
          </button>

          <button
            className="border px-5 py-2 rounded-xl hover:bg-gray-50"
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* Plans */}
      <div>

        <h2 className="text-lg font-semibold mb-4">
          Available Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold">
                {plan.name}
              </h3>

              <p className="text-blue-600 font-semibold mt-2">
                {plan.price}
              </p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm text-gray-600"
                  >
                    ✓ {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Subscription;