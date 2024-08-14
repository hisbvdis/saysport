import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Status } from "../";
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
 import { InputAddon } from "@/app/_components/ui/InputAddon";


export default function NameOrg() {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Название и статус</Card.Heading>
      <Card.Section>
        <div style={{display: "flex", gap: "10px"}}>
          <Control>
            <Control.Label>Тип организации</Control.Label>
            <Input
              name="name_type"
              value={state?.name_type}
              onChange={(e) => handleStateChange?.value(e)}
              placeholder="Фитнес-клуб"
              required
            />
          </Control>
          <Control>
            <Control.Label>Название организации</Control.Label>
            <Control.Section style={{display: "flex"}}>
              <InputAddon>«</InputAddon>
              <Input
                name="name_title"
                value={state?.name_title}
                onChange={(e) => handleStateChange?.value(e)}
                placeholder="Super Fitness"
              />
              <InputAddon>»</InputAddon>
            </Control.Section>
          </Control>
          <Control>
            <Control.Label>Филиал</Control.Label>
            <Input
              name="name_where"
              value={state?.name_where}
              onChange={(e) => handleStateChange?.value(e)}
              placeholder="Центральный"
            />
          </Control>
        </div>
        <Control className="mt15">
          <Control.Label>Локативная форма</Control.Label>
          <Control.Section style={{display: "flex"}}>
            <Input
              name="name_locative"
              value={state?.name_locative}
              onChange={(e) => handleStateChange?.value(e)}
              placeholder="в клубе"
              required
              style={{flex: "1"}}
            />
            <InputAddon style={{flex: "4"}}>«{state.name_title}» {state.name_where}</InputAddon>
          </Control.Section>
        </Control>
        <Status className="mt15"/>
      </Card.Section>
    </Card>
  )
}