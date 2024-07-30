import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Status } from "../";
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { handleQuotes } from "@/app/_utils/handleQuotes";


export default function NamePlace() {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Название и Статус</Card.Heading>
      <Card.Section>
        <div style={{display: "flex", gap: "10px"}}>
          <Control style={{flexBasis: "50%"}}>
            <Control.Label>Тип места</Control.Label>
            <Control.Section>
              <Input
                name="name_type"
                value={state?.name_type}
                onChange={(e) => handleStateChange?.value(handleQuotes(e))}
                placeholder="Футбольное поле"
                required
              />
            </Control.Section>
          </Control>
          <Control style={{flexBasis: "50%"}}>
            <Control.Label>Расположение</Control.Label>
            <Control.Section>
              <Input
                name="name_where"
                value={state?.name_where}
                onChange={(e) => handleStateChange?.value(handleQuotes(e))}
                disabled={Boolean(state?.parent_id)}
                placeholder="у Школы №38"
                required
              />
            </Control.Section>
          </Control>
        </div>
        <Status className="mt15"/>
      </Card.Section>
    </Card>
  )
}