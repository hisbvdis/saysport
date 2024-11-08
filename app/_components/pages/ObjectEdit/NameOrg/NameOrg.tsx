import { use } from "react";
// -----------------------------------------------------------------------------
import { Status } from "../";
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Input } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
import { InputAddon } from "@/app/_components/ui/InputAddon";
// -----------------------------------------------------------------------------


export default function NameOrg() {
  const { state, handleStateChange } = use(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Название и статус</Card.Heading>
      <Card.Section>
        <div style={{display: "flex", gap: "10px"}}>
        <Control style={{flex: "1"}}>
            <Control.Label>Тип организации</Control.Label>
            <Input
              name="name_type"
              value={state?.name_type}
              onChange={(e) => handleStateChange.value({name:e.target.name, value:e.target.value})}
              placeholder="Фитнес-клуб"
              required
            />
          </Control>
          <Control style={{flex: "1"}}>
            <Control.Label>Название организации</Control.Label>
            <Control.Section style={{display: "flex"}}>
              <InputAddon>«</InputAddon>
              <Input
                name="name_title"
                value={state?.name_title}
                onChange={(e) => handleStateChange.value({name:e.target.name, value:e.target.value})}
                placeholder="Super Fitness"
              />
              <InputAddon>»</InputAddon>
            </Control.Section>
          </Control>
          <Control style={{flex: "1"}}>
            <Control.Label>Филиал</Control.Label>
            <Input
              name="name_where"
              value={state?.name_where}
              onChange={(e) => handleStateChange.value({name:e.target.name, value:e.target.value})}
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
              onChange={(e) => handleStateChange.value({name:e.target.name, value:e.target.value})}
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