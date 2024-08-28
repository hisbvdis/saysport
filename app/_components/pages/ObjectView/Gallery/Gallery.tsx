import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { ObjectViewContext } from "../ObjectView";
import { Swiper } from "@/app/_components/ui/Swiper";
// -----------------------------------------------------------------------------


export default function Gallery() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Swiper photos={state.photos?.length ? state.photos?.map((photo) => `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${photo.name}`) : ["/no-photo.svg"]} width={565} height={350} navigation="true" speed="250" loop="true"/>
    </Card>
  )
}