"use client";

import { SelectedCityDetailsProps } from "../utilities/propsTypes";

export default function CityDetail({
  city,
  onClose,
}: SelectedCityDetailsProps) {
  return (
    <div className="relative mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 ml-5 w-96">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close city details"
        className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition cursor-pointer"
      >
        ✕
      </button>

      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        City Details
      </h3>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{city.name}</p>
        </div>

        <div>
          <p className="text-gray-500">State</p>
          <p className="font-medium text-gray-900">{city.state}</p>
        </div>

        <div>
          <p className="text-gray-500">Country</p>
          <p className="font-medium text-gray-900">{city.country}</p>
        </div>

        <div>
          <p className="text-gray-500">Display Name</p>
          <p className="font-medium text-gray-900">{city.displayName}</p>
        </div>

        <div>
          <p className="text-gray-500">Type</p>
          <p className="font-medium capitalize text-gray-900">{city.type}</p>
        </div>
      </div>
    </div>
  );
}
