"use client";
import { create } from "mutative";
import Compressor from "compressorjs";
import { type ChangeEvent, useContext, useRef } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectEditContext } from "../ObjectEdit";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------


export default function Photos() {
  const { state, setState } = useContext(ObjectEditContext);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handlePhotos = {
    add: async (e:ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const statePhotos = state?.photos ?? [];
      const existingIndexes = statePhotos.map((photo) => photo.name?.match(/\d(?=\.webp)/g)?.[0]).map((index) => Number(index));
      const newIndexes = Array(10).fill(null).map((_, i) => i).filter((i) => !existingIndexes.includes(i)).toSorted((a, b) => a - b);
      const selectedPhotos = Array.from(e.target.files).slice(0, 10 - statePhotos.length)
      const compressedPhotos:File[] = await Promise.all(selectedPhotos.map((file) => new Promise((resolve:(value:File) =>void) => {new Compressor(file, {mimeType: "image/webp", quality: 0.7, maxWidth: 2560, resize: "contain", success: (result) => {resolve(new File([result], file.name, {type: "image/webp"}))}})})));
      const enrichedPhotos = compressedPhotos.map((file, i) => ({name: `object_${state.object_id || "ID"}_${newIndexes.shift()}.webp`, uiID: crypto.randomUUID(), blob: URL.createObjectURL(file), file, photo_id: null, object_id: null, uploaded: new Date(), order: i}));
      const allPhotos = statePhotos.concat(enrichedPhotos).map((photo, i) => ({...photo, order: i}));
      setState((prevState) => create(prevState, (draft) => {draft.photos = allPhotos}))
    },
    delete: (uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.photos = draft.photos?.filter((photo) => photo.uiID !== uiID).map((photo, i) => ({...photo, order: i}))
      }))
    },
    deleteAll: () => {
      setState((prevState) => create(prevState, (draft) => {draft.photos = []}));
      if (!inputFileRef.current) return;
      inputFileRef.current.value = "";
    },
    changeOrder: (e:ChangeEvent<HTMLInputElement>, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const photo = draft.photos?.find((photo) => photo.uiID === uiID);
        if (!photo) return;
        photo.order = Number(e.target.value);
      }))
    }
  }
  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading style={{display: "flex", alignItems: "center"}}>
        <span style={{marginInlineEnd: "auto"}}>Фото</span>
        {state.photos?.length ? <Button onClick={handlePhotos.deleteAll}>Удалить все</Button> : null}
        <Control style={{marginInlineStart: "10px"}}>
          <Control.Label for="inputFile" style={{cursor: "pointer"}}>Choose File</Control.Label>
          <Control.Section className="srOnly">
            <input id="inputFile" type="file" ref={inputFileRef} onChange={handlePhotos.add} multiple/>
          </Control.Section>
        </Control>
      </Card.Heading>
      {state.photos?.length ? (
        <Card.Section>
          <ul style={{display: "grid", gap: "15px", gridTemplateColumns: "repeat(5, 1fr)", listStyle: "none", paddingInlineStart: 0}}>
            {state.photos?.toSorted((a, b) => a.order - b.order).map((photo, i) => (
              <li key={photo.uiID}  style={{position: "relative",  border: "1px solid black"}}>
                <Button onClick={() => handlePhotos.delete(photo.uiID)} style={{position: "absolute"}}>X</Button>
                <Input value={photo.order} onChange={(e) => handlePhotos.changeOrder(e, photo.uiID)} style={{position: "absolute", insetInlineStart: "20px", inlineSize: "30px"}}/>
                <img src={photo.blob ?? `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${photo.name}`} style={{width: "100%", aspectRatio: "1/1", objectFit: "contain"}} alt=""/>
              </li>
            ))}
          </ul>
        </Card.Section>
      ) : null}
    </Card>
  )
}