"use client";
import Link from "next/link";
import Image from "next/image";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_hooks/useManageSearchParams";


export default function Popular(props:Props) {
  const { className } = props;
  const manageSearchParams = useManageSearchParams();

  return (
    <Card className={className}>
      <Card.Heading>Популярные разделы</Card.Heading>
      <Card.Section>
        <ul style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" , gap: "15px"}}>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "1")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/fitness-club.webp" alt="Фитнес-клубы" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Фитнес-клубы</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "3")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/gym.webp" alt="Тренажерные залы" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Тренажерные залы</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "8")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/boxing.webp" alt="Единоборства" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Единоборства</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "18")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/fitness.webp" alt="Фитнес" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Фитнес</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "26")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/dancing.webp" alt="Танцы" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Танцы</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "9")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/yoga.webp" alt="Йога" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Йога</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "9")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/soccer.webp" alt="Футбольные поля" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Футбольные поля</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "9")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/basketball.webp" alt="Баскетбольные площадки" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Баскетбольные площадки</p>
            </Link>
          </li>
          <li>
            <Link href={`/catalog/${manageSearchParams.set("section", "19")}`} style={{display: "inline-block", inlineSize: "100%"}}>
              <Image src="/images/popular-sections/pool.webp" alt="Бассейны" style={{inlineSize: "100%", blockSize: "130px", objectFit: "cover"}} width="200" height="130"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Бассейны</p>
            </Link>
          </li>
        </ul>
      </Card.Section>
    </Card>
  )
}

interface Props {
  className?: string;
}