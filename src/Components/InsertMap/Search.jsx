import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { Map, useMap } from "react-leaflet";
import React, { useEffect } from "react";
import "leaflet-geosearch/dist/geosearch.css";

const Search = (props) => {
  const map = useMap(); // access to leaflet map
  const { provider } = props;

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      marker: {
        draggable: true,
      },
      style: "bar",
    });

    map.addControl(searchControl);

    let marker; // Define a marker variable

    const waitForMarker = () => {
      marker = searchControl._marker; // Access the marker object

      if (!marker) {
        setTimeout(waitForMarker, 100); // Retry in 100 milliseconds
      } else {
        // Add a dragend event listener to the marker
        marker.on("dragend", () => {
          const markerLatLng = marker.getLatLng(); // Get the marker's coordinates
          console.log("Marker Coordinates:", markerLatLng);
        });
      }
    };

    waitForMarker();

    return () => {
      // Remove the control and event listener when the component unmounts
      map.removeControl(searchControl);
      if (marker) {
        marker.off("dragend"); // Remove the dragend event listener
      }
    };
  }, [props]);

  return null; // don't want anything to show up from this comp
};

export default Search;