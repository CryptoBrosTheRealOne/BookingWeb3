import React, { useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { Map, useMap, useMapEvent } from "react-leaflet";
import CustomMarkers from "../Map/CustomMarkers";
import { icons } from "../Map/MarkersIcon";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import Search from "./Search";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const InsertMap = ({ changeHandler }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState({
    lat: 10.99835602,
    lng: 77.01502627,
  });
  React.useEffect(() => {
    changeHandler(center);
  }, [center]);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(showPosition);
  }, []);
  function showPosition(position) {
    setIsLoaded(false);
    setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setIsLoaded(true);
  }
  const markerRef = useRef();

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = { ...marker.getLatLng() };
          setCenter(newPos);
        }
      },
    }),
    []
  );

  const handleAddMarker = (map, location) => {
    setCenter({ lng: location.x, lat: location.y });
  };

  const MapComponent = () => {
    const map = useMap();

    // Use useMapEvent to add a custom event handler for "geosearch/showlocation"
    useMapEvent("geosearch/showlocation", (e) => {
      handleAddMarker(map, e.location);
    });

    return null;
  };

  return (
    isLoaded && (
      <MapContainer
        style={{ width: "500px", height: "500px" }}
        center={[center.lat, center.lng]}
        zoom={15}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapComponent />
        <Marker
          position={[center.lat, center.lng]}
          draggable={true}
          eventHandlers={eventHandlers}
          ref={markerRef}
        />
        <Search
          provider={new OpenStreetMapProvider()}
          eventHandlers={eventHandlers}
        />
      </MapContainer>
    )
  );
};

export default InsertMap;