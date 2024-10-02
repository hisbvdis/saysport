import { useContext } from "react"
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit"
import { Card } from "@/app/_components/ui/Card";
import { Textarea } from "@/app/_components/ui/Input";
// -----------------------------------------------------------------------------


export default function Description() {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Описание</Card.Heading>
      <Card.Section>
        <Textarea name="description" value={state.description} onChange={(e) => handleStateChange.value({name:e.target.name, value:e.target.value})} maxLength="2000" />
      </Card.Section>
    </Card>
  )
}