"use client";
import { MapContext } from "./Map";
import { useContext, useEffect } from "react";
// -----------------------------------------------------------------------------


export default function TileLayer(props:Props) {
  const mapContext = useContext(MapContext);
  const { L, map } = mapContext;
  const url = props?.url ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = props.attribution ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  useEffect(() => {
    if (!L || !map) return;
    L.tileLayer(url, { attribution }).addTo(map);
  }, [L, map])

  return null;
}

interface Props {
  url?: string;
  attribution?: string;
}