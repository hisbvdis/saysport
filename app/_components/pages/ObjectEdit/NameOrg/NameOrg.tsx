import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Status } from "../";
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { handleQuotes } from "@/app/_utils/handleQuotes";


export default function NameOrg() {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Название и статус</Card.Heading>
      <Card.Section>
        <Control>
          <Control.Label>Название организации</Control.Label>
          <Input
            name="name"
            value={state?.name}
            onChange={(e) => handleStateChange?.value(handleQuotes(e))}
            placeholder="Фитнес-клуб «Super Fitness» Центральный"
            required
          />
        </Control>
        <Control className="mt15">
          <Control.Label>Локативная форма</Control.Label>
          <Input
            name="name_locative"
            value={state?.name_locative}
            onChange={(e) => handleStateChange?.value(handleQuotes(e))}
            placeholder="в клубе «Super Fitness» Центральный"
            required
          />
        </Control>
        <Status className="mt15"/>
      </Card.Section>
    </Card>
  )
}