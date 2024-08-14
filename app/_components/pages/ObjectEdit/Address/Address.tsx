"use client";
import Link from "next/link";
import { create } from "mutative";
import type * as Leaflet from "leaflet";
import type { DBObject } from "@/app/_types/types";
import { useContext, useEffect, useState } from "react";
import { type Object_, objectTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox } from "@/app/_components/ui/Choice";
import { MapComponent, MapControl, MapCluster } from "@/app/_components/ui/MapComponent";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { setInheritedData } from "./setInheritedData";
import { objectReadProcessing } from "@/app/_db/object.processing";
import { getObjectsByArea, getObjectsByFilters } from "@/app/_db/object";
import { queryAddressForCoord, queryCoodFromAddress } from "@/app/_utils/nominatim";


export default function Address() {
  const { state, setState, handleStateChange, mapInstance, setMapInstance } = useContext(ObjectEditContext);
  const [ liveMap, setLiveMap ] = useState<{lat: number, lon: number, zoom: number, bounds: Leaflet.LatLngBounds|undefined}>({lat: state.coord_lat, lon: state.coord_lon, zoom: 17, bounds: mapInstance?.getBounds()});
  const [ nearestObjects, setNearestObjects ] = useState<Object_[]>();

  const handleMap = {
    getCoordFromAddress: async () => {
      if (!state.city) return;
      const result = await queryCoodFromAddress({
        country: state.city.country,
        city: state.city.name,
        street: state.address
      });
      if (!result) return;
      setState((prevState) => create(prevState, (draft) => {
        draft.coord_lat = result.lat;
        draft.coord_lon = result.lon;
      }));
      mapInstance?.setView([result.lat, result.lon]);
      mapInstance?.setZoom(17);
      if (!mapInstance) return;
      setNearestObjects(await getObjectsByArea(mapInstance.getBounds().getSouth(), mapInstance.getBounds().getNorth(), mapInstance.getBounds().getWest(), mapInstance.getBounds().getEast(), state.object_id, state.parent_id));
    },
    getAddressFromCoord: async () => {
      if (!state.coord_lat || !state.coord_lon) return;
      const result = await queryAddressForCoord({
        lat: state.coord_lat,
        lon: state.coord_lon
      });
      if (!result) return;
      const road = result.address.road;
      const house = result.address.house_number;
      setState((prevState) => create(prevState, (draft) => {
        draft.address = `${road}${house ? `, ${house}` : ""}`;
      }));
    },
    markerDragEnd: (e:Leaflet.DragEndEvent) => {
      setState((prevState) => create(prevState, (draft) => {
        if (draft.coord_inherit) return;
        const { lat, lng } = e.target._latlng;
        draft.coord_lat = lat;
        draft.coord_lon = lng;
      }))
    },
    rightClick: (e:Leaflet.LeafletMouseEvent) => {
      setState((prevState) => create(prevState, (draft) => {
        if (draft.coord_inherit) return;
        const { lat, lng } = e.latlng;
        draft.coord_lat = lat;
        draft.coord_lon = lng;
      }));
    }
  }

  useEffect(() => {
    if (!state.coord_inherit) return;
    setState((prevState) => create(prevState, (draft) => {
      if (!draft.parent?.coord_lat || !draft.parent?.coord_lon) return;
      draft.coord_lat = draft.parent?.coord_lat;
      draft.coord_lon = draft.parent?.coord_lon;
    }))
  }, [state.coord_inherit])

  useEffect(() => {(async () => {
    setLiveMap((prevState) => create(prevState, (draft) => {
      draft.bounds = mapInstance?.getBounds();
    }))
    if (!mapInstance) return;
    setNearestObjects(await getObjectsByArea(mapInstance.getBounds().getSouth(), mapInstance.getBounds().getNorth(), mapInstance.getBounds().getWest(), mapInstance.getBounds().getEast(), state.object_id, state.parent_id));
  })()}, [mapInstance])

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Адрес</Card.Heading>
      <Card.Section style={{display: "flex", gap: "15px"}}>
        <div style={{flexBasis: "33%"}}>
          <Control>
            <Control.Label>Город</Control.Label>
            <Control.Section>
              <Select
                name="city_id"
                value={state.city_id}
                label={state.city?.name.concat(state.city.admin1 ? `, ${state.city.admin1}` : "").concat(state.city.country ? `, ${state.city.country}` : "") ?? ""}
                onChange={handleStateChange.valueAsNumber}
                onChangeData={(data) => setState((prevState) => create(prevState, (draft) => {draft.city = data}))}
                isAutocomplete
                disabled={Boolean(state.parent_id)}
                placeholder="Введите название"
                required
                requestItemsOnInputChange={async (inputValue) => (
                  await getCitiesByFilters({name: inputValue})).map((city) => ({
                    id: city.city_id, label: `${city.name.concat(city.admin1 ? `, ${city.admin1}` : "").concat(city.country ? `, ${city.country}` : "")}`, data: city
                }))}
              />
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>
              <span>На базе организации</span>
              {state.parent_id && <Link href={`/object/${state.parent?.object_id}`}>(Open)</Link>}
            </Control.Label>
            <Control.Section>
              <Select
                name="parent_id"
                value={state.parent_id}
                label={state.parent?.name_type?.concat(state.parent.name_title ? ` «${state.parent.name_title}»` : "").concat(state.parent.name_where ? ` ${state.parent.name_where}` : "")}
                onChange={handleStateChange?.valueAsNumber}
                onChangeData={(parent:DBObject) => {
                  setInheritedData(parent.object_id ? objectReadProcessing(parent) : null, setState);
                  if (!parent.object_id) return;
                  mapInstance?.setView([parent.coord_lat, parent.coord_lon])
                }}
                isAutocomplete
                placeholder="Введите название"
                disabled={!state.city_id}
                requestItemsOnInputChange={async (value) => (
                  await getObjectsByFilters({city: String(state.city_id), type: objectTypeEnum.org, query: value}))
                    .filter((org) => org.object_id !== state.object_id)
                    .map((org) => ({id: org.object_id, label: `${org.name_type ?? ""} ${org.name_title ?? ""} ${org.name_where ?? ""}`, data: org})
                )}
              />
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>Адрес</Control.Label>
            <Control.Section style={{display: "flex"}}>
              <Input
                name="address"
                value={state.address}
                onChange={handleStateChange.value}
                disabled={Boolean(state.parent_id)}
                placeholder="Центральный проспект, 153A"
                required
              />
              <Button onClick={handleMap.getCoordFromAddress} disabled={Boolean(state.parent_id)}>→</Button>
              <Button onClick={handleMap.getAddressFromCoord} disabled={Boolean(state.parent_id)}>←</Button>
            </Control.Section>
          </Control>
          <Control>
            <Control.Label srOnly>Уточнение местоположения</Control.Label>
            <Control.Section>
              <Input
                name="address_2"
                value={state.address_2}
                onChange={handleStateChange.value}
                placeholder="ТРЦ «Центральный»"
                disabled={Boolean(state.parent_id)}
              />
            </Control.Section>
          </Control>
        </div>
        <div style={{flexBasis: "66%", display: "flex", flexDirection: "column"}}>
          {state.parent_id && <Checkbox
            name="coord_inherit"
            checked={Boolean(state.coord_inherit)}
            onChange={handleStateChange.checked}
            disabled={!state.parent_id}
          >
            Наследовать координату
          </Checkbox>}
          <MapComponent
            center={[state.coord_lat, state.coord_lon]}
            zoom={17}
            liftMapInstance={setMapInstance}
            onMapRightClick={handleMap.rightClick}
            onMapDrag={async (e) => {
              setLiveMap((prevState) => create(prevState, (draft) => {
                draft.lat = e.target.getCenter().lat;
                draft.lon = e.target.getCenter().lng;
                draft.zoom = e.target.getZoom();
              }));
              setNearestObjects(await getObjectsByArea(e.target.getBounds().getSouth(), e.target.getBounds().getNorth(), e.target.getBounds().getWest(), e.target.getBounds().getEast(), state.object_id, state.parent_id));
            }}
          >
            <MapCluster markersData={nearestObjects?.map((object) => ({coord: [object.coord_lat, object.coord_lon] as Leaflet.LatLngTuple, popup: `<a href="object/${object.object_id}">${object.name_type.concat(object.name_title ? ` «${object.name_title}»` : "").concat(object.name_where ? ` ${object.name_where}` : "")}</a>`, iconUrl: "/map/marker-icon-secondary.png", draggable: false, onDragEnd: handleMap.markerDragEnd})).concat({coord: [state.coord_lat, state.coord_lon] as Leaflet.LatLngTuple, popup: "Текущий объект", iconUrl: "", draggable: Boolean(!state.coord_inherit), onDragEnd: handleMap.markerDragEnd}) ?? []}/>
            <MapControl html={`<a href='https://www.google.com/maps/search/${liveMap.lat},${liveMap.lon}/@${liveMap.lat},${liveMap.lon},${liveMap.zoom}z' target='blank'>Google<a/>`}/>
            <MapControl html={`<a href='https://yandex.ru/maps/?ll=${liveMap.lon}%2C${liveMap.lat}&z=${liveMap.zoom}' target='blank'>Яндекс<a/>`}/>
            <MapControl html={`<a href='https://2gis.ru/?m=${liveMap.lon}%2C${liveMap.lat}/${liveMap.zoom}' target='blank'>2Гис<a/>`}/>
          </MapComponent>
        </div>
      </Card.Section>
    </Card>
  )
}