import Link from "next/link";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { DelBtn } from "@/app/_components/ui/DelBtn";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
import { deleteSectionById, getAllSections } from "@/app/_db/section";


export default async function SectionListPage() {
  const sections = await getAllSections();

  return (
    <main className="container page">
      <Breadcrumbs items={[{label: "Админка", href: "/admin"}, {label: "Разделы"}]}/>
      <Card style={{display: "flex", flexWrap: "wrap", marginBlockStart: "10px"}}>
        <Card.Section style={{flex: "100%"}}>
          <Link href="/admin/sections/add">Создать</Link>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <h3>Организации</h3>
          <ul>
            {sections.filter(({object_type, section_type}) => section_type === sectionTypeEnum.section && object_type === objectTypeEnum.org).map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <h3>Места</h3>
          <ul>
            {sections.filter(({object_type, section_type}) => section_type === sectionTypeEnum.section && object_type === objectTypeEnum.place).map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
        <Card.Section style={{flex: "33%"}}>
          <h3>Секции</h3>
          <ul>
            {sections.filter((section) => section.section_type === sectionTypeEnum.section && section.object_type === objectTypeEnum.class).map((section) => (
              <li key={section.section_id} style={{display: "flex", gap: "10px"}}>
                <DelBtn id={section.section_id} delFunc={deleteSectionById}/>
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_service}</Link>
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
                <Link href={`/admin/sections/${section.section_id}`}>{section.name_service}</Link>
              </li>
            ))}
          </ul>
        </Card.Section>
      </Card>
    </main>
  )
}