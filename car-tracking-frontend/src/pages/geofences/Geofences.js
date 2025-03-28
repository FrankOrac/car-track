import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";

const Geofences = () => {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/geofences");
        setGeofences(response.data);
      } catch (err) {
        setError("Failed to fetch geofences");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeofences();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Geofences
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {geofences.map((geofence) => (
              <li key={geofence.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {geofence.name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {geofence.type}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {geofence.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Radius: {geofence.radius} meters</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Geofence Map
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="h-96">
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {geofences.map((geofence) => (
                <Circle
                  key={geofence.id}
                  center={[geofence.latitude, geofence.longitude]}
                  radius={geofence.radius}
                  pathOptions={{
                    color: "red",
                    fillColor: "red",
                    fillOpacity: 0.2,
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-medium">{geofence.name}</h3>
                      <p className="text-sm text-gray-500">
                        {geofence.description}
                      </p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Geofences;
