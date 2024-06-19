import { useContext } from "react";
import { ObjectViewContext } from "../ObjectView";
import { Swiper } from "@/app/_components/ui/Swiper";
import { Card } from "@/app/_components/ui/Card";

export default function Gallery() {
  const { state } = useContext(ObjectViewContext);

  return (
    <Card>
      <Swiper photos={state.photos?.map((photo) => photo.name) ?? ["no-photo.svg"]} width={565} height={350} navigation="true" speed="250" loop="true"/>
    </Card>
  )
}