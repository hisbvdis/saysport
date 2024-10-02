import { useContext } from "react";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../ObjectView";
import { Carousel } from "@/app/_components/ui/Carousel";
// -----------------------------------------------------------------------------


export default function Gallery() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Carousel
      navigation={true}
      photos={state.photos?.map((photo, i) => ({
        src: `${process.env.NEXT_PUBLIC_PHOTOS_PATH}/${photo.name}`,
        alt: state.name_type.concat(state.name_title ? ` «${state.name_title}»` : "").concat(state.name_where ? ` ${state.name_where}` : "").concat(i > 0 ? `— ${i}` : "")
      }))}
    />
  )
}