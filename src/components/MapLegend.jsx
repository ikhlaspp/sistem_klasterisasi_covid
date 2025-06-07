import React from "react";

const MapLegend = ({ clusterInfo }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-xl border border-gray-200 z-[1000]">
      <h4 className="font-bold text-sm mb-2 text-gray-800">Legenda Klaster</h4>
      <ul>
        {clusterInfo.map((info) => (
          <li key={info.id} className="flex items-center mb-1">
            <span
              className="w-4 h-4 inline-block mr-2 rounded border border-gray-400"
              style={{ backgroundColor: info.color }}
            ></span>
            <span className="text-xs text-gray-700">{info.label}</span>
          </li>
        ))}
        <li className="flex items-center mt-2">
          <span className="w-4 h-4 inline-block mr-2 rounded border border-gray-400 bg-gray-300"></span>
          <span className="text-xs text-gray-700">Data Tidak Tersedia</span>
        </li>
      </ul>
    </div>
  );
};

export default MapLegend;
