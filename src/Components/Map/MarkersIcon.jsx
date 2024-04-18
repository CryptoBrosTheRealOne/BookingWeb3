import L from "leaflet";

export const icons = {
    driver: L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=red&icon=local_shipping&iconType=material&apiKey=466cbc651e104fbca9fb573a18990037',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
      }),
    
      venue: L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=blue&icon=store&iconType=material&apiKey=466cbc651e104fbca9fb573a18990037',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
      }),
    
       receiver: L.icon({
        iconUrl: 'https://api.geoapify.com/v1/icon/?type=material&color=purple&icon=warehouse&iconType=material&apiKey=466cbc651e104fbca9fb573a18990037',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
      })
}