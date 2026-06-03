import React from "react";

export default function ErrorMsg({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-900 bg-opacity-20 border border-red-800 flex items-center justify-center">
        <i className="ti ti-alert-circle text-2xl text-red-400" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm">Something went wrong</p>
        <p className="text-gray-600 text-xs mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[#A855F7] text-xs hover:underline flex items-center gap-1"
        >
          <i className="ti ti-refresh text-xs" /> Try again
        </button>
      )}
    </div>
  );
}
