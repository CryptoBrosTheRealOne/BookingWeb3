import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import CustomMarkers from "./CustomMarkers";
import { icons } from "./MarkersIcon";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const InteractiveMap = ({coords}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [center, setCenter] = useState({
    lat: 10.99835602,
    lng: 77.01502627,
  });
  const [couriers, setCouries] = useState([]);
  const [orders, setOrders] = useState([]);

  React.useEffect(() => {
    if(coords){
      showPosition(coords)
    }
    
  }, [coords]);

  function showPosition(coords) {
    setIsLoaded(false);
    setCenter({
      lat: coords.lat,
      lng: coords.lng,
    });
    setIsLoaded(true);
  }

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
        <Marker position={coords}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>

      </MapContainer>
    )
  );
};

export default InteractiveMap;