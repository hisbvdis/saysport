"use client";
import { use, useEffect } from "react";
// -----------------------------------------------------------------------------
import { MapContext } from "./MapComponent";
// -----------------------------------------------------------------------------
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { MapMarkerProps } from "./MapMarker";


export default function MapCluster(props:{markersData:MapMarkerProps[]}) {
  const mapContext = use(MapContext);
  const { L, map } = mapContext;

  useEffect(() => {
    if (!L || !map || !Number(props.markersData?.[0]?.coord?.[0]) || !Number(props.markersData?.[0]?.coord?.[1])) return;
    const markerClusterGroup = L.markerClusterGroup({animate: false});
    props.markersData?.forEach((markerData) => {
      const markerIcon = L.icon({iconUrl: markerData.iconUrl ? markerData.iconUrl : "/map/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 40], popupAnchor: [0, -40], shadowUrl: "/map/marker-shadow.png", shadowSize: [41, 41], shadowAnchor: [13, 40], });
      const marker = L.marker(markerData.coord, { draggable: markerData.draggable, icon: markerIcon, zIndexOffset: markerData.zIndexOffset });
      if (markerData.onDragEnd) marker.on("dragend", markerData.onDragEnd);
      if (markerData.onClick) marker.on("click", markerData.onClick);
      if (markerData.popup) marker.bindPopup(markerData.popup);
      markerClusterGroup.addLayer(marker);
    })
    map.addLayer(markerClusterGroup);
    return () => {
      map.removeLayer(markerClusterGroup);
    }
  }, [L, map, props.markersData])

  return (
    null
  )
}