import { useContext } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../"
import Link from "next/link";
import { deleteObjectById } from "@/app/_db/object";
import { DelBtn } from "@/app/_components/ui/DelBtn";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
import { Dropdown } from "@/app/_components/ui/Dropdown";


export default function Header(props:Props) {
  const { className, style } = props;
  const { state } = useContext(ObjectViewContext);

  return (
    <header className={className} style={style}>
      <Card>
        <div style={{display: "flex"}}>
          <Breadcrumbs items={[
            {label: "Каталог", href: "/catalog"},
            {label: `${state.city?.name ?? ""}`, href: `/catalog?city=${state.city?.city_id}`},
            {label: `${state.sections?.filter((section) => section.section_type === sectionTypeEnum.section)[0]?.name_public_plural ?? ""}`, href: `/catalog?city=${state.city?.city_id}&section=${state.sections?.filter((section) => section.section_type === sectionTypeEnum.section)[0]?.section_id}`}
          ]} style={{fontSize: "0.85em"}}/>
          {state.sections.filter((section) => section.section_type === sectionTypeEnum.section).length > 1 && <Dropdown items={state.sections?.slice(1).filter((section) => section.section_type === sectionTypeEnum.section).map((section) => ({id: section.section_id, label: section.name_public_plural, href: `/catalog?city=${state.city_id}&section=${section.section_id}`}))} style={{fontSize: "0.85em", marginInlineStart: "1em"}}/>}
          <Link href={`/object/${state.object_id}/edit`} style={{marginInlineStart: "auto"}}>Ред</Link>
          <DelBtn id={state.object_id ? state.object_id : -1} delFunc={deleteObjectById} redirectPath="/">X</DelBtn>
        </div>
        <h1>{state.name_type} {state.type === objectTypeEnum.org ? state.name_title : ""} {state.name_where}</h1>
        {state.parent_id ? <Link href={`/object/${state.parent_id}`}>&lt; {state.parent?.name_type} {state.parent?.name_title} {state.parent?.name_where}</Link> : null}
      </Card>
    </header>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
}