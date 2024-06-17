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
      <Card.Heading>Name and Status</Card.Heading>
      <Card.Section>
        <Control>
          <Control.Label>Organisation name</Control.Label>
          <Input
            name="name"
            value={state?.name}
            onChange={(e) => handleStateChange?.value(handleQuotes(e))}
            placeholder="Fitness club «FitnessOK» Central"
            required
          />
        </Control>
        <Control className="mt15">
          <Control.Label>Name locative form</Control.Label>
          <Input
            name="name_locative"
            value={state?.name_locative}
            onChange={(e) => handleStateChange?.value(handleQuotes(e))}
            placeholder="at the «FitnessOK» club Central"
            required
          />
        </Control>
        <Status className="mt15"/>
      </Card.Section>
    </Card>
  )
}