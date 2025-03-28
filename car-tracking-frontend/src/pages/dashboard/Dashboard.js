import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  BellIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  MapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_URL = "http://localhost:8000/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicles, setActiveVehicles] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch vehicles with their latest locations
        const vehiclesResponse = await axios.get(`${API_URL}/vehicles`);

        // Extract active vehicles count
        const activeVehicleCount = vehiclesResponse.data.vehicles.filter(
          (vehicle) => vehicle.is_active
        ).length;

        // Fetch recent alerts
        const alertsResponse = await axios.get(
          `${API_URL}/admin/alerts/recent`
        );

        setVehicles(vehiclesResponse.data.vehicles);
        setActiveVehicles(activeVehicleCount);
        setAlerts(alertsResponse.data.alerts || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data
  const vehicleStatusData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [activeVehicles, vehicles.length - activeVehicles],
        backgroundColor: ["#3b82f6", "#e5e7eb"],
        borderColor: ["#2563eb", "#d1d5db"],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for vehicle activity chart
  const activityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Distance (km)",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
      },
    ],
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
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600">
          Here's an overview of your vehicle tracking system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <TruckIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Vehicles</p>
              <p className="text-xl font-bold">{vehicles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <MapIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Tracking</p>
              <p className="text-xl font-bold">{activeVehicles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <BellIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Alerts</p>
              <p className="text-xl font-bold">{alerts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Subscription</p>
              <p className="text-xl font-bold">
                {user?.subscriptionPlan?.name || "None"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Vehicle Status Chart */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1">
          <h2 className="text-lg font-semibold mb-4">Vehicle Status</h2>
          <div className="h-48">
            <Doughnut
              data={vehicleStatusData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
          <div className="h-48">
            <Line
              data={activityData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Vehicles and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Vehicles</h2>
            <Link
              to="/vehicles"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-6">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No vehicles registered yet</p>
              <Link
                to="/vehicles/new"
                className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Vehicle
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vehicle
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      License
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Latest Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.slice(0, 5).map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              to={`/vehicles/${vehicle.id}`}
                              className="hover:text-blue-600"
                            >
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.license_plate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            vehicle.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {vehicle.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vehicle.latestLocation ? (
                          <a
                            href={`https://www.google.com/maps?q=${vehicle.latestLocation.latitude},${vehicle.latestLocation.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View on map
                          </a>
                        ) : (
                          "No data"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
            <Link
              to="/alerts"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No alerts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start border-l-4 border-red-400 bg-red-50 p-4 rounded"
                >
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {alert.title}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {alert.description}
                    </p>
                    <div className="mt-2 text-xs text-red-600">
                      <span>{new Date(alert.created_at).toLocaleString()}</span>
                      <Link
                        to={`/vehicles/${alert.vehicle_id}`}
                        className="ml-2 text-red-800 hover:text-red-900"
                      >
                        View Vehicle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
