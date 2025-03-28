import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ChevronLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon for active vehicle
const activeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom marker icon for inactive vehicle
const inactiveIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const API_URL = "http://localhost:8000/api";

const VehicleMap = () => {
  const { vehicleId } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London
  const [mapZoom, setMapZoom] = useState(vehicleId ? 13 : 10);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicleData = async () => {
    try {
      setRefreshing(true);
      const endpoint = vehicleId
        ? `${API_URL}/vehicles/${vehicleId}`
        : `${API_URL}/vehicles`;

      const response = await axios.get(endpoint);

      if (vehicleId) {
        // Single vehicle view
        const vehicle = response.data.vehicle;
        if (vehicle.latestLocation) {
          setMapCenter([
            vehicle.latestLocation.latitude,
            vehicle.latestLocation.longitude,
          ]);
          setVehicles([vehicle]);
        } else {
          setVehicles([vehicle]);
          setError("No location data available for this vehicle.");
        }
      } else {
        // All vehicles view
        const vehicles = response.data.vehicles;
        setVehicles(vehicles);

        // If we have vehicles with location data, center the map on the first one
        const vehiclesWithLocation = vehicles.filter((v) => v.latestLocation);
        if (vehiclesWithLocation.length > 0) {
          setMapCenter([
            vehiclesWithLocation[0].latestLocation.latitude,
            vehiclesWithLocation[0].latestLocation.longitude,
          ]);
          setMapZoom(10); // Zoom out a bit to see multiple vehicles
        }
      }
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
      setError("Failed to load vehicle data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();

    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchVehicleData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [vehicleId]);

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
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            {vehicleId && (
              <Link
                to="/vehicle-map"
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Link>
            )}
            <h2 className="text-lg font-semibold">
              {vehicleId
                ? `${vehicles[0]?.make} ${vehicles[0]?.model} (${vehicles[0]?.license_plate})`
                : "All Vehicles Map"}
            </h2>
          </div>
          <button
            onClick={handleRefresh}
            className={`flex items-center px-3 py-2 text-sm rounded bg-blue-50 text-blue-600 hover:bg-blue-100 ${
              refreshing ? "opacity-50 cursor-wait" : ""
            }`}
            disabled={refreshing}
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="bg-gray-100 rounded-b-lg" style={{ height: "70vh" }}>
          {error && !vehicles.some((v) => v.latestLocation) ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-6 max-w-md">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No location data available
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {vehicleId
                    ? "This vehicle doesn't have any location data yet."
                    : "None of your vehicles have location data yet."}
                </p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {vehicles.map((vehicle) => {
                if (!vehicle.latestLocation) return null;

                return (
                  <Marker
                    key={vehicle.id}
                    position={[
                      vehicle.latestLocation.latitude,
                      vehicle.latestLocation.longitude,
                    ]}
                    icon={vehicle.is_active ? activeIcon : inactiveIcon}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-semibold">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          License: {vehicle.license_plate}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last updated:{" "}
                          {new Date(
                            vehicle.latestLocation.created_at
                          ).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Speed: {vehicle.latestLocation.speed || 0} km/h
                        </p>
                        <div className="mt-2">
                          <Link
                            to={`/vehicles/${vehicle.id}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {vehicles.length > 0 && !error && (
          <div className="p-4 border-t">
            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Vehicle Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-3 rounded-md border ${
                    vehicle.is_active
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        {vehicle.license_plate}
                      </p>
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vehicle.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {vehicle.latestLocation ? (
                    <div className="mt-1 text-xs text-gray-500">
                      Last seen:{" "}
                      {new Date(
                        vehicle.latestLocation.created_at
                      ).toLocaleString()}
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-gray-500">
                      No location data available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleMap;
