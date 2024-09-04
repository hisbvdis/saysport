"use client";
import { useEffect } from "react";
import { register } from "swiper/element/bundle";
// -----------------------------------------------------------------------------


export default function Swiper(props) {
  const { photos, width, height, navigation, speed, loop } = props;

  useEffect(() => {
    register();
  },[])

  return (
    <swiper-container navigation={navigation} speed={speed} loop={loop} pagination="true" pagination-type="bullets">
      {photos.map((photo) => (
        <swiper-slide key={photo.src}>
          <img src={photo.src} width={width} height={height} alt={photo.alt} style={{maxInlineSize: "100%",  inlineSize: "100%", blockSize: "auto", aspectRatio: `${width}/${height}`, objectFit: "cover"}}/>
        </swiper-slide>
      ))}
    </swiper-container>
  )
}