"use client";
import Link from "next/link";
import { create } from "mutative";
import type * as Leaflet from "leaflet";
import { useContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox } from "@/app/_components/ui/Choice";
import { MapComponent, MapMarker } from "@/app/_components/ui/MapComponent";
// -----------------------------------------------------------------------------
import { objectTypeEnum } from "@/drizzle/schema";
import { getCitiesByFilters } from "@/app/_db/city";
import { setInheritedData } from "./setInheritedData";
import { handleQuotes } from "@/app/_utils/handleQuotes";
import { getObjectsWIthPayloadByFilters } from "@/app/_db/object";
import { objectReadProcessing } from "@/app/_db/object.processing";
import { queryAddressForCoord, queryCoodFromAddress } from "@/app/_utils/nominatim";
import MapButton from "@/app/_components/ui/MapComponent/MapButton";


export default function Address() {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);
  const [ mapInstance, setMapInstance ] = useState<Leaflet.Map>();
  const [ liveMap, setLiveMap ] = useState<{lat: number, lon: number, zoom: number}>({lat: state.coord_lat, lon: state.coord_lon, zoom: 17});

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
                label={state.city?.city_id ? `${state.city?.name}, ${state.city?.country}` : ""}
                onChange={handleStateChange.valueAsNumber}
                onChangeData={(data) => setState((prevState) => create(prevState, (draft) => {draft.city = data}))}
                isAutocomplete
                disabled={Boolean(state.parent_id)}
                placeholder="Введите название"
                required
                requestItemsOnInputChange={async (inputValue) => (
                  await getCitiesByFilters({name: inputValue})).map((city) => ({
                    id: city.city_id, label: `${city.name}, ${city.country}`, data: city
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
                label={state.parent?.name_type?.concat(state.parent.name_title ?? "").concat(state.parent.name_where ?? "")}
                onChange={handleStateChange?.valueAsNumber}
                onChangeData={(parent) => setInheritedData(parent.id ? objectReadProcessing(parent) : null, setState)}
                isAutocomplete
                placeholder="Введите название"
                disabled={!state.city_id}
                requestItemsOnInputChange={async (value) => (
                  await getObjectsWIthPayloadByFilters({city: String(state.city_id), type: objectTypeEnum.org, query: value}))
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
                onChange={(e) => handleStateChange.value(handleQuotes(e))}
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
            onMapDrag={(e) => setLiveMap({lat: e.target.getCenter().lat, lon: e.target.getCenter().lng, zoom: e.target.getZoom()})}
          >
            <MapMarker
              coord={[state.coord_lat, state.coord_lon]}
              draggable={Boolean(!state.coord_inherit)}
              onDragEnd={handleMap.markerDragEnd}
            />
            <MapButton html={`<a href='https://www.google.com/maps/@${liveMap.lat},${liveMap.lon},${liveMap.zoom}z' target='blank'>Google<a/>`}/>
            <MapButton html={`<a href='https://yandex.ru/maps/?ll=${liveMap.lon}%2C${liveMap.lat}&z=${liveMap.zoom}' target='blank'>Яндекс<a/>`}/>
            <MapButton html={`<a href='https://2gis.ru/?m=${liveMap.lon}%2C${liveMap.lat}%2F${liveMap.zoom}' target='blank'>2Гис<a/>`}/>
          </MapComponent>
        </div>
      </Card.Section>
    </Card>
  )
}