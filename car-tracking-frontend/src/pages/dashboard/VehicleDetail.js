import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  BoltIcon,
  SparklesIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const API_URL = "http://localhost:8000/api";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [locations, setLocations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicleData = async () => {
    try {
      setRefreshing(true);

      // Fetch vehicle data
      const vehicleResponse = await axios.get(`${API_URL}/vehicles/${id}`);
      setVehicle(vehicleResponse.data.vehicle);

      // Fetch recent locations
      const locationsResponse = await axios.get(
        `${API_URL}/vehicles/${id}/locations?limit=10`
      );
      setLocations(locationsResponse.data.locations || []);

      // Fetch recent alerts
      const alertsResponse = await axios.get(
        `${API_URL}/vehicles/${id}/alerts?limit=5`
      );
      setAlerts(alertsResponse.data.alerts || []);

      setError(null);
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError("Failed to load vehicle data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, [id]);

  const handleToggleActive = async () => {
    try {
      await axios.put(`${API_URL}/vehicles/${id}/toggle-active`);
      fetchVehicleData();
    } catch (err) {
      console.error("Error toggling vehicle active status:", err);
      setError("Failed to update vehicle status");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      await axios.delete(`${API_URL}/vehicles/${id}`);
      navigate("/vehicles");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Failed to delete vehicle");
      setDeleteConfirm(false);
    }
  };

  const handleRefresh = () => {
    fetchVehicleData();
  };

  if (loading && !refreshing) {
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
          <p className="mt-2 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <Link
                  to="/vehicles"
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Vehicles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to="/vehicles"
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </h1>
          <span
            className={`ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              vehicle.is_active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {vehicle.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className={`flex items-center px-3 py-2 text-sm rounded bg-gray-50 text-gray-600 hover:bg-gray-100 ${
              refreshing ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={refreshing}
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            to={`/vehicles/${id}/edit`}
            className="flex items-center px-3 py-2 text-sm rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className={`flex items-center px-3 py-2 text-sm rounded ${
              deleteConfirm
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            {deleteConfirm ? "Confirm Delete" : "Delete"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-lg">Vehicle Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <img
                  src={
                    vehicle.image_url ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover rounded"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-medium">{vehicle.license_plate}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Make / Model / Year</p>
                  <p className="font-medium">
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">VIN</p>
                  <p className="font-medium">
                    {vehicle.vin || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">
                    {vehicle.color || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <button
                    onClick={handleToggleActive}
                    className={`mt-1 px-3 py-1 text-sm rounded ${
                      vehicle.is_active
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {vehicle.is_active ? "Active" : "Inactive"} (Click to
                    toggle)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-lg">Tracking Device</h2>
            </div>
            <div className="p-6">
              {vehicle.tracking_device ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Device ID</p>
                    <p className="font-medium">
                      {vehicle.tracking_device.device_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">
                      {vehicle.tracking_device.model || "Standard"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.tracking_device.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.tracking_device.is_active
                        ? "Connected"
                        : "Disconnected"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Last Connection</p>
                    <p className="font-medium">
                      {vehicle.tracking_device.last_connection_at
                        ? new Date(
                            vehicle.tracking_device.last_connection_at
                          ).toLocaleString()
                        : "Never connected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Battery</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              vehicle.tracking_device.battery_level || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {vehicle.tracking_device.battery_level || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <SparklesIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-2">
                    No tracking device registered
                  </p>
                  <Link
                    to={`/vehicles/${id}/add-device`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
                  >
                    Add Device
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Locations and Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="font-semibold text-lg">Current Location</h2>
              <Link
                to={`/vehicle-map/${id}`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Full Map
              </Link>
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              {vehicle.latestLocation ? (
                <div className="p-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <MapPinIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Last Known Location
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Latitude: {vehicle.latestLocation.latitude},
                          Longitude: {vehicle.latestLocation.longitude}
                        </p>
                        <div className="mt-2 text-xs text-blue-600 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(
                              vehicle.latestLocation.created_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase">Speed</p>
                      <p className="font-medium">
                        {vehicle.latestLocation.speed || 0} km/h
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase">
                        Direction
                      </p>
                      <p className="font-medium">
                        {vehicle.latestLocation.heading_direction || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500 uppercase">
                        Engine Status
                      </p>
                      <p className="font-medium">
                        {vehicle.latestLocation.engine_on ? "Running" : "Off"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <a
                      href={`https://www.google.com/maps?q=${vehicle.latestLocation.latitude},${vehicle.latestLocation.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-gray-900">
                      No location data available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This vehicle has not reported its location yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Locations */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="font-semibold text-lg">Location History</h2>
              <Link
                to={`/vehicles/${id}/history`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Full History
              </Link>
            </div>
            <div className="overflow-x-auto">
              {locations.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date/Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Speed
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {locations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(location.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <a
                              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {location.latitude.toFixed(6)},{" "}
                              {location.longitude.toFixed(6)}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {location.speed || 0} km/h
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              location.engine_on
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {location.engine_on ? "Engine On" : "Engine Off"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <ClockIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No location history available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between">
              <h2 className="font-semibold text-lg">Recent Alerts</h2>
              <Link
                to={`/vehicles/${id}/alerts`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All Alerts
              </Link>
            </div>
            <div className="p-6">
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start border-l-4 border-red-400 bg-red-50 p-4 rounded"
                    >
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {alert.title}
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          {alert.description}
                        </p>
                        <div className="mt-2 text-xs text-red-600">
                          <span>
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <BoltIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No alerts for this vehicle</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
