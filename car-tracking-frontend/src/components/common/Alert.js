import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;

  const types = {
    success: {
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-400",
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-400",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
    warning: {
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-400",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    info: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-400",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
  };

  const { bgColor, textColor, borderColor, iconBg, iconColor } =
    types[type] || types.info;

  return (
    <div className={`rounded-md ${bgColor} p-4 mb-4 border ${borderColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div
            className={`w-5 h-5 rounded-full ${iconBg} flex items-center justify-center`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${iconColor}`}></div>
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <div className="pl-3 ml-auto">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${iconBg} ${iconColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
