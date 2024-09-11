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
      <Swiper photos={state.photos?.length ? state.photos?.map((photo, i) => ({src: `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${photo.name}`, alt: state.name_type.concat(state.name_title ? ` «${state.name_title}»` : "").concat(state.name_where ? ` ${state.name_where}` : "").concat(i > 0 ? `— ${i}` : "")})) : [{src: "/images/no-photo.svg"}]} width={565} height={350} navigation="true" speed="250" loop="true"/>
    </Card>
  )
}