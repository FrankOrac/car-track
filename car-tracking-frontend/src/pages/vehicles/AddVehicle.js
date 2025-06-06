import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const API_URL = "http://localhost:8000/api";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    license_plate: "",
    vin: "",
    color: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      if (errors.image) {
        setErrors({
          ...errors,
          image: null,
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.license_plate)
      newErrors.license_plate = "License plate is required";
    if (!formData.vin) newErrors.vin = "VIN is required";
    if (formData.vin && formData.vin.length !== 17)
      newErrors.vin = "VIN must be 17 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formPayload = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formPayload.append(key, formData[key]);
        }
      });

      // Append image if exists
      if (image) {
        formPayload.append("image", image);
      }

      const response = await axios.post(`${API_URL}/vehicles`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/vehicles/${response.data.vehicle.id}`);
    } catch (error) {
      console.error("Error creating vehicle:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        // Format Laravel validation errors
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Failed to create vehicle. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center">
        <Link to="/vehicles" className="mr-2 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Vehicle</h1>
      </div>

      {errors.general && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Details */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="make"
                  className="block text-sm font-medium text-gray-700"
                >
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.make ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.make && (
                  <p className="mt-1 text-sm text-red-600">{errors.make}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-gray-700"
                >
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.model ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  maxLength="4"
                  className={`mt-1 block w-full border ${
                    errors.year ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700"
                >
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                )}
              </div>
            </div>

            {/* Vehicle Identifiers */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="license_plate"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Plate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="license_plate"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    errors.license_plate ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.license_plate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.license_plate}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vin"
                  className="block text-sm font-medium text-gray-700"
                >
                  VIN (Vehicle Identification Number){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  maxLength="17"
                  className={`mt-1 block w-full border ${
                    errors.vin ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.vin && (
                  <p className="mt-1 text-sm text-red-600">{errors.vin}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  The VIN should be 17 characters and can be found on your
                  vehicle registration or insurance documents.
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Image
                </label>
                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Vehicle preview"
                        className="h-32 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer bg-gray-50 border border-gray-300 rounded-md py-6 px-12 flex flex-col items-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="mt-2 block text-sm font-medium text-gray-700">
                        Upload an image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              to="/vehicles"
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
