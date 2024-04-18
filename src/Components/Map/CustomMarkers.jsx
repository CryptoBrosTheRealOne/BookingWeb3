import React from "react";
import { Tooltip, Marker, Popup } from "react-leaflet";

const CustomMarkers = ({ coords, icon, name, clickHandler }) => {
  return (
    <Marker position={coords} icon={icon} eventHandlers={{
      click: clickHandler,
    }}>
      <Popup>Popup for Marker</Popup>
      <Tooltip>{name}</Tooltip>
    </Marker>
  );
};

export default CustomMarkers;