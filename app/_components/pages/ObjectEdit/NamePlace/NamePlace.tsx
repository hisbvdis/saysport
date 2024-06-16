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
      <Card.Heading>Name and Status</Card.Heading>
      <Card.Section>
        <div style={{display: "grid", gap: "10px", gridTemplateColumns:"repeat(4, 10px)"}}>
          <Control>
            <Control.Label>Place type</Control.Label>
            <Control.Section>
              <Input
                name="name"
                value={state?.name}
                onChange={(e) => handleStateChange?.value(handleQuotes(e))}
                placeholder="Soccer field"
                required
              />
            </Control.Section>
          </Control>
          <Control>
            <Control.Label>Location</Control.Label>
            <Control.Section>
              <Input
                name="name_where"
                value={state?.name_where}
                onChange={(e) => handleStateChange?.value(handleQuotes(e))}
                disabled={Boolean(state?.parent_id)}
                placeholder="near School #38"
                required
              />
            </Control.Section>
          </Control>
        </div>
        <Status style={{marginBlockStart: "5px"}}/>
      </Card.Section>
    </Card>
  )
}