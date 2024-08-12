import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Status } from "..";
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { handleQuotes } from "@/app/_utils/handleQuotes";


export default function NameClass() {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Название и статус</Card.Heading>
      <Card.Section>
        <div style={{display: "flex", gap: "10px"}}>
          <Control style={{flexBasis: "50%"}}>
            <Control.Label>Название секции</Control.Label>
            <Control.Section>
              <Input
                name="name_type"
                value={state?.name_type}
                onChange={(e) => handleStateChange?.value(handleQuotes(e))}
                placeholder="Футбол"
                required
              />
            </Control.Section>
          </Control>
          <Control style={{flexBasis: "50%"}}>
            <Control.Label>Место проведения</Control.Label>
            <Control.Section>
              <Input
                name="name_where"
                value={state?.name_where}
                onChange={(e) => handleStateChange?.value(handleQuotes(e))}
                disabled={Boolean(state?.parent_id)}
                placeholder="в Школе №38"
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