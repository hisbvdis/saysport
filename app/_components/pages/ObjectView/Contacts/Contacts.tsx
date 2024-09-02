import { useContext } from "react"
import { ObjectViewContext } from "../ObjectView"
import { Card } from "@/app/_components/ui/Card";
import { MapComponent, MapMarker } from "@/app/_components/ui/MapComponent";

export default function Contacts() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Card.Section>
        <p>{state.city?.name},</p>
        <p>{state.address}</p>
        <p style={{color: "var(--fontColor-light)", marginBlockStart: "2px", fontSize: "0.8em"}}>{state.address_2}</p>
        <p style={{color: "var(--fontColor-light)", marginBlockStart: "5px", fontSize: "0.8em"}}>{state.city?.country.concat(state.city?.admin1 ? `, ${state.city?.admin1}` : "").concat(state.city?.admin2 ? `, ${state.city?.admin2}` : "")}</p>
      </Card.Section>

      {state.phones?.length ? (
        <Card.Section>
          {state.phones?.map((phone) => (
            <p key={phone.uiID}>{phone.value}</p>
          ))}
        </Card.Section>
      ) : null}

      {state.links?.length ? (
        <Card.Section>
          {state.links.map((link) => (
            <p key={link.uiID}>
              <a href={link.value}>{link.value.match(/^(https?:\/\/)?(www.)?(.*?(?=\/))/)?.[3]}</a>
            </p>
          ))}
        </Card.Section>
      ) : null}

      <Card.Section style={{blockSize: "300px"}}>
        <MapComponent center={[state.coord_lat, state.coord_lon]} zoom={17} zoomControl={false}>
          <MapMarker coord={[state.coord_lat, state.coord_lon]}/>
        </MapComponent>
      </Card.Section>
    </Card>
  )
}