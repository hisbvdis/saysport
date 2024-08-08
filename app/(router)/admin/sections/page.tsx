import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { DelBtn } from "@/app/_components/ui/DelBtn";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { deleteSectionById, getAllSections } from "@/app/_db/section";
import { sectionTypeEnum } from "@/drizzle/schema";


export default async function SectionListPage() {
  const sections = await getAllSections();

  return (
    <main className="container page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Разделы"}]}/>
      <Card style={{display: "flex", flexWrap: "wrap", marginBlockStart: "10px"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/sections/add">Создать</Link>
        </Card.Section>
        <Card.Section style={{flex: "50%"}}>
          <h3>Организации</h3>
          <ul>
            {sections.filter(({object_type, section_type}) => section_type === sectionTypeEnum.section && object_type === "org").map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_public_plural}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{flex: "50%"}}>
          <h3>Места</h3>
          <ul>
            {sections.filter(({object_type, section_type}) => section_type === sectionTypeEnum.section && object_type === "place").map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_public_plural}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>

      <Card>
        <Card.Section>
          <h3>Общие разделы</h3>
          <ul>
            {sections.filter(({section_type}) => section_type === sectionTypeEnum.common).map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_public_plural}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section>
          <h3>Использования</h3>
          <ul>
            {sections.filter(({section_type}) => section_type === sectionTypeEnum.usage).map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_public_plural}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </main>
  )
}