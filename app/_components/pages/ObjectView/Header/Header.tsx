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
  const { state, session } = useContext(ObjectViewContext);

  return (
    <header className={className} style={style}>
      <Card>
        <div style={{display: "flex"}}>
          <Breadcrumbs items={[
            {label: "Каталог", href: "/"},
            {label: `${state.city?.name ?? ""}`, href: `/?city=${state.city?.city_id}`},
            {label: `${state.sections?.filter((section) => section.section_type === sectionTypeEnum.section)[0]?.name_public_plural ?? ""}`, href: `/?city=${state.city?.city_id}&section=${state.sections?.filter((section) => section.section_type === sectionTypeEnum.section)[0]?.section_id}`}
          ]} style={{fontSize: "0.85em"}}/>
          {state.sections.filter((section) => section.section_type === sectionTypeEnum.section).length > 1 && <Dropdown items={state.sections?.slice(1).filter((section) => section.section_type === sectionTypeEnum.section).map((section) => ({id: section.section_id, label: section.name_public_plural, href: `/?city=${state.city_id}&section=${section.section_id}`}))} style={{fontSize: "0.85em", marginInlineStart: "1em"}}/>}
          {session ? (
            <div style={{marginInlineStart: "auto", display: "flex", gap: "10px"}}>
              {state.type === objectTypeEnum.org ? <Link href={`/object/add/place?parent=${state.object_id}`}>Место</Link> : null}
              {state.type === objectTypeEnum.org ? <Link href={`/object/add/class?parent=${state.object_id}`}>Секция</Link> : null}
              <Link href={`/object/${state.object_id}/edit`}>Ред</Link>
              <DelBtn id={state.object_id ? state.object_id : -1} delFunc={deleteObjectById} redirectPath="/">X</DelBtn>
            </div>
          ) : null}
        </div>
        <h1>{state.name_type} {state.type === objectTypeEnum.org ? `«${state.name_title}»` : ""} {state.name_where}</h1>
        {state.parent_id ? <Link href={`/object/${state.parent_id}`}>&lt; {state.parent?.name_type} {state.parent?.name_title ? `«${state.parent?.name_title}»` : ""} {state.parent?.name_where}</Link> : null}
      </Card>
    </header>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
}