import { useContext } from "react"
import { ObjectEditContext } from "../ObjectEdit"
import { Card } from "@/app/_components/ui/Card";
import { Textarea } from "@/app/_components/ui/Input";

export default function Description() {
  const { state, handleStateChange } = useContext(ObjectEditContext);

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Description</Card.Heading>
      <Card.Section>
        <Textarea name="description" value={state.description} onChange={handleStateChange.value} maxLength="1000" />
      </Card.Section>
    </Card>
  )
}