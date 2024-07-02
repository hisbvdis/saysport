import { create } from "mutative";
import { ChangeEvent, useContext } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit"


export default function Photos() {
  const { state, setState } = useContext(ObjectEditContext);

  const handlePhotos = {
    add: (e:ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const statePhotos = state?.photos ?? [];
      const existingIndexes = statePhotos.map((photo) => photo.name?.match(/\d(?=\.webp)/g)?.[0]).map((index) => Number(index));
      const newIndexes = Array(10).fill(null).map((_, i) => i).filter((i) => !existingIndexes.includes(i)).toSorted((a, b) => a - b);
      const selectedPhotos = Array.from(e.target.files).slice(0, 10 - statePhotos.length)
        .map((file, i) => ({name: `object_${state.object_id ?? "ID"}_${newIndexes.shift()}.webp`, uiID: crypto.randomUUID(), blob: URL.createObjectURL(file), file, photo_id: -1, object_id: -1, uploaded: new Date(), order: i}));
      const allPhotos = statePhotos.concat(selectedPhotos).map((photo, i) => ({...photo, order: i}));
      setState((prevState) => create(prevState, (draft) => {draft.photos = allPhotos}))
    },
    delete: (uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.photos = draft.photos?.filter((photo) => photo.uiID !== uiID).map((photo, i) => ({...photo, order: i}))
      }))
    },
    deleteAll: () => {
      setState((prevState) => create(prevState, (draft) => {draft.photos = []}))
    }
  }
  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <span>Фото</span>
        <Button onClick={handlePhotos.deleteAll}>Удалить все</Button>
      </Card.Heading>
      <Card.Section>
        <input type="file" onChange={handlePhotos.add} multiple/>
        <ul style={{display: "grid", gap: "15px", gridTemplateColumns: "repeat(5, 1fr)", listStyle: "none", paddingInlineStart: 0}}>
          {state.photos?.map((photo, i) => (
            <li key={photo.uiID}  style={{border: "1px solid black"}}>
              <Button onClick={() => handlePhotos.delete(photo.uiID)} style={{position: "absolute"}}>X</Button>
              <img src={photo.blob ?? `/photos/${photo.name}`} style={{width: "100%", aspectRatio: "1/1", objectFit: "contain"}}/>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
  )
}