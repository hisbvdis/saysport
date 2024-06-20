"use client";
import { create } from "mutative";
import { useContext, useEffect, useState } from "react";
import * as Leaflet from "leaflet";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Select } from "@/app/_components/ui/Select";
import { Map, Marker } from "@/app/_components/ui/Map";
import { Control } from "@/app/_components/ui/Control";
import { Checkbox } from "@/app/_components/ui/Choice";
// -----------------------------------------------------------------------------
import { getCitiesByFilters } from "@/app/_db/city";
import { setInheritedData } from "./setInheritedData";
import { getObjectsByFilters } from "@/app/_db/object";
import { handleQuotes } from "@/app/_utils/handleQuotes";
import { queryAddressForCoord, queryCoodFromAddress } from "@/app/_utils/nominatim";
import { objectReadProcessing } from "@/app/_db/object.processing";


export default function Address() {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);
  const [ mapInstance, setMapInstance ] = useState<Leaflet.Map>();

  const handleMap = {
    getCoordFromAddress: async () => {
      if (!state.city) return;
      const result = await queryCoodFromAddress({
        country: state.city.country_code,
        city: state.city.name_ru!,
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
                label={state.city?.id ? `${state.city?.name_ru}, ${state.city?.country_code}` : ""}
                onChange={handleStateChange.valueAsNumber}
                onChangeData={(data) => setState((prevState) => create(prevState, (draft) => {draft.city = data}))}
                isAutocomplete
                disabled={Boolean(state.parent_id)}
                placeholder="Введите название"
                requestItemsOnInputChange={async (inputValue) => (
                  await getCitiesByFilters({name: inputValue})).map((city) => ({
                    id: city.id, label: `${city.name_ru}, ${city.country_code}`, data: city
                }))}
              />
            </Control.Section>
          </Control>
          <Control className="mt15">
            <Control.Label>На базе организации</Control.Label>
            <Control.Section>
              <Select
                name="parent_id"
                value={state.parent_id}
                label={state.parent?.name}
                onChange={handleStateChange?.valueAsNumber}
                onChangeData={(parent) => setInheritedData(parent.id ? objectReadProcessing(parent) : null, setState)}
                isAutocomplete
                placeholder="Введите название"
                disabled={!state.city_id}
                requestItemsOnInputChange={async (value) => (
                  await getObjectsByFilters({cityId: String(state.city_id), type: "org", query: value}))
                    .filter((org) => org.id !== state.id)
                    .map((org) => ({id: org.id, label: org.name, data: org})
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
          <Checkbox
            name="coord_inherit"
            checked={Boolean(state.coord_inherit)}
            onChange={handleStateChange.checked}
            disabled={!state.parent_id}
          >
            Наследовать координату
          </Checkbox>
          <Map
            center={[state.coord_lat, state.coord_lon]}
            zoom={17}
            liftMapInstance={setMapInstance}
            onMapRightClick={handleMap.rightClick}
          >
            <Marker
              coord={[state.coord_lat, state.coord_lon]}
              draggable={Boolean(!state.coord_inherit)}
              onDragEnd={handleMap.markerDragEnd}
            />
          </Map>
        </div>
      </Card.Section>
    </Card>
  )
}