"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// -----------------------------------------------------------------------------
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./styles.css";


export default function Carousel(props) {
  const { photos, width, height, navigation=false } = props;

  return (
    <Swiper className="carousel" modules={[Navigation, Pagination]} navigation={navigation} pagination={{ clickable: false }} speed={200}>
      {photos?.length
        ? photos.map((photo) => (
            <SwiperSlide key={photo.src} className="carousel__slide">
              <img className="carousel__image" src={photo.src} width={width} height={height} alt={photo.alt}/>
            </SwiperSlide>
          ))
        : <SwiperSlide>
            <img className="carousel__image" src="/images/no-photo.svg" width={width} height={height} alt=""/>
          </SwiperSlide>
      }
    </Swiper>
  )
}