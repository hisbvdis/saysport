"use client";
import { use, useEffect } from "react";
// -----------------------------------------------------------------------------
import { MapContext } from "./MapComponent";


export default function MapControl(props:Props) {
  const mapContext = use(MapContext);
  const { L, map } = mapContext;

  useEffect(() => {
		if (!L || !map) return;
		const control = new L.Control({position: "topright"});
		control.onAdd = () => {
			const button = L.DomUtil.create("div");
			if (props.html) button.innerHTML = props.html;
			if (props.onClick) button.onclick = props.onClick;
			return button;
		}
		control.addTo(map);
		return () => {
			control.remove();
		}
	}, [L, map, props.html]);

  return (
    null
  )
}

interface Props {
  html?: string;
	onClick?: ()=>void;
}