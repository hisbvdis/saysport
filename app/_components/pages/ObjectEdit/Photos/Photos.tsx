import { ChangeEvent, useContext } from "react"
import { ObjectEditContext } from "../ObjectEdit"
import { Card } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { create } from "mutative";

export default function Photos() {
  const { state, setState } = useContext(ObjectEditContext);

  const handlePhotos = {
    add: (e:ChangeEvent) => {

    },
    deleteAll: () => {
      setState(create(state, (draft) => {draft.photos = []}))
    }
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>
        <span>Photos</span>
        <Button onClick={handlePhotos.deleteAll}>Delete all</Button>
      </Card.Heading>
      <Card.Section>
        <input type="file" onChange={handlePhotos.add} multiple/>
      </Card.Section>
    </Card>
  )
}