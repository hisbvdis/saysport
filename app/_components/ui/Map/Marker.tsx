"use client";
import * as Leaflet from "leaflet";
import { useContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { MapContext } from "./Map";


export default function Marker(props:Props) {
  const { draggable, onDragEnd=(e=>e) } = props;
  const coord = (props.coord?.[0] && props.coord?.[1] ? props.coord : [0, 0]) as [number, number];
  const mapContext = useContext(MapContext);
  const { L, map } = mapContext;
  const [ marker, setMarker ] = useState<Leaflet.Marker>();

  useEffect(() => {
    if (!L || !map) return;
    const marker = L.marker(coord, { draggable }).addTo(map);
    marker.on("dragend", onDragEnd);
    setMarker(marker);
    return () => {marker.remove()};
  }, [L, map, draggable])

  useEffect(() => {
    if (!marker) return;
    marker.setLatLng(coord);
  }, [coord])

  return null;
}

interface Props {
  draggable?: boolean;
  onDragEnd?: (e:Leaflet.DragEndEvent) => void;
  coord?: [number|undefined|null, number|undefined|null]
}