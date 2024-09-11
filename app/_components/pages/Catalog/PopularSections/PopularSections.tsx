import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
// -----------------------------------------------------------------------------
import { useManageSearchParams } from "@/app/_utils/useManageSearchParams";


export default function PopularSections() {
  const manageSearchParams = useManageSearchParams();

  return (
    <Card>
      <Card.Heading>Популярные разделы</Card.Heading>
      <Card.Section>
        <ul style={{display: "flex", gap: "15px", flexWrap: "wrap"}}>
          <li>
            <Link href={manageSearchParams.set("section", "1")} style={{display: "inline-block"}}>
              <img src="/popular-sections/fitness-club.webp" alt="Фитнес-клубы"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Фитнес-клубы</p>
            </Link>
          </li>
          <li>
            <Link href={manageSearchParams.set("section", "3")} style={{display: "inline-block"}}>
              <img src="/popular-sections/gym.webp" alt="Тренажерный зал"/>
              <p style={{marginBlockStart: "10px", textAlign: "center"}}>Тренажерный зал</p>
            </Link>
          </li>
        </ul>
      </Card.Section>
    </Card>
  )
}