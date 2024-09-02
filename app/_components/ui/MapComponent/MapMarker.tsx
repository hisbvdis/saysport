"use client";
import type * as Leaflet from "leaflet";
import { useContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { MapContext } from "./MapComponent";


export default function MapMarker(props:MapMarkerProps) {
  const { draggable, onDragEnd=(e=>e), onClick=(e=>e), popup, iconUrl, zIndexOffset=0 } = props;
  const coord = (props.coord?.[0] && props.coord?.[1] ? props.coord : [0, 0]) as [number, number];
  const mapContext = useContext(MapContext);
  const { L, map } = mapContext;
  const [ marker, setMarker ] = useState<Leaflet.Marker>();

  useEffect(() => {
    if (!L || !map) return;
    const markerIcon = L.icon({iconUrl: iconUrl ? iconUrl : "/map/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 40], shadowUrl: "/map/marker-shadow.png", shadowSize: [41, 41], shadowAnchor: [13, 40]});
    const marker = L.marker(coord, { draggable, icon: markerIcon, zIndexOffset }).addTo(map);
    if (popup) marker.bindPopup(popup);
    marker.on("dragend", onDragEnd);
    marker.on("click", onClick);
    setMarker(marker);
    return () => {
      marker.remove()
    };
  }, [L, map, draggable])

  useEffect(() => {
    if (!marker) return;
    marker.setLatLng(coord);
  }, [coord])

  return null;
}

export interface MapMarkerProps {
  draggable?: boolean;
  coord: Leaflet.LatLngTuple;
  onDragEnd?: (e:Leaflet.DragEndEvent) => void;
  onClick?: (e:Leaflet.LeafletMouseEvent) => void;
  popup?: string;
  iconUrl?: string;
  zIndexOffset?:number;
}