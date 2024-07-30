"use client";
import { useContext, useEffect } from "react";
// -----------------------------------------------------------------------------
import { MapContext } from "./MapComponent";


export default function MapButton(props:Props) {
  const mapContext = useContext(MapContext);
  const { L, map } = mapContext;

  useEffect(() => {
			if (!L || !map) return;
      const control = new L.Control({position: "topright"});
      control.onAdd = () => {
        const button = L.DomUtil.create("button");
        if (props.html) button.innerHTML = props.html;
        return button;
      }
      control.addTo(map);
			// const customControl = new L.Control({ position: "topright" });
			// customControl.onAdd = () => {
			// 	const container = L.DomUtil.create("div", "custom-control-container"); // Создаем контейнер для кнопки
			// 	const button = L.DomUtil.create(
			// 		"button",
			// 		"custom-control-button",
			// 		container,
			// 	); // Создаем кнопку внутри контейнера
			// 	button.innerHTML = "Нажми меня!";

			// 	// Обработчик клика по кнопке
			// 	L.DomEvent.on(button, "click", (e) => {
			// 		L.DomEvent.stopPropagation(e); // Останавливаем всплытие события
			// 		alert("Кнопка нажата!"); // Здесь можно добавить любую логику
			// 	});

			// 	return container;
			// };
			// customControl.addTo(map);
		}, [L, map]);

  return (
    null
  )
}

interface Props {
  html?:string;
}