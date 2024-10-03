"use client";
import cx from "classix";
import type * as Leaflet from "leaflet";
import { type RefObject, createContext, useEffect, useRef, useState } from "react"
// -----------------------------------------------------------------------------
import { TileLayer } from ".";
// -----------------------------------------------------------------------------
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.css"


export default function MapComponent(props:Props) {
  const { zoomControl=true, onMapRightClick=(e=>e), liftMapInstance=(e=>e), onMapDrag=(e=>e), fitBoundsArray } = props;
  const center = (props.center?.[0] && props.center?.[1] ? props.center : [0, 0]) as [number, number];
  const zoom = props.zoom ?? 3;
  const { className, style, children } = props;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Leaflet.Map>();
  const [ L, setL ] = useState<typeof Leaflet>();

  useEffect(() => {(async () => {
    const L = await import("leaflet");
    if (!mapContainerRef.current || mapContainerRef.current.children.length > 0) return;
    const map = L.map(mapContainerRef.current, { center, zoom, zoomControl });
    L.Icon.Default.imagePath = "/map/";
    map.on("contextmenu", onMapRightClick);
    map.on("dragend", onMapDrag);
    setL(L);
    setMap(map);
    liftMapInstance(map);
    return (() => {
      map.off("contextmenu");
      map.off("dragend");
    })
  })()}, [])

  useEffect(() => {
    if (!map || !fitBoundsArray?.length) return;
    map.fitBounds(fitBoundsArray);
  }, [map, fitBoundsArray])

  return (
    <MapContext.Provider value={{ L, map, center, zoom, mapContainerRef }}>
      <TileLayer/>
      <div className={cx(styles.map, className)} ref={mapContainerRef} style={style}/>
      {children}
    </MapContext.Provider>
  )
}

export const MapContext = createContext<MapContextType>({} as MapContextType);

interface MapContextType {
  center?: [number, number];
  zoom?: number;
  L?: typeof Leaflet;
  map?: Leaflet.Map
  mapContainerRef: RefObject<HTMLDivElement>;
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  center?: [number|undefined|null, number|undefined|null]
  zoom?: number;
  zoomControl?: boolean;
  onMapRightClick?: (e: Leaflet.LeafletMouseEvent) => void;
  onMapDrag?: (e: Leaflet.LeafletEvent) => void;
  liftMapInstance?: (mapInstance:Leaflet.Map) => void;
  fitBoundsArray?: Leaflet.LatLngTuple[];
}