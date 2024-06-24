import { useContext } from "react"
import { ObjectViewContext } from "../ObjectView"
import { Card } from "@/app/_components/ui/Card";
import { Map, Marker } from "@/app/_components/ui/Map";

export default function Contacts() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Section>
        <p>{state.city?.name}, {state.city?.country}</p>
        <p>{state.address}</p>
        <p style={{color: "var(--fontColor-light)", marginBlockStart: "2px", fontSize: "0.8em"}}>{state.address_2}</p>
      </Card.Section>

      {state.phones?.length ?
        <Card.Section>{state.phones[0].value}</Card.Section>
      : null}

      {state.links?.length ?
        <Card.Section>{state.links.map((link) => link.value.match(/^(https?:\/\/)?(www.)?(.*?(?=\/))/)?.[3])}</Card.Section>
      : null}

      <Card.Section style={{blockSize: "300px"}}>
        <Map center={[state.coord_lat, state.coord_lon]} zoom={17} zoomControl={false}>
          <Marker coord={[state.coord_lat, state.coord_lon]}/>
        </Map>
      </Card.Section>
    </Card>
  )
}