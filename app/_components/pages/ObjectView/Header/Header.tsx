import Link from "next/link";
import { useContext } from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../"
import { Card } from "@/app/_components/ui/Card";
import { DelBtn } from "@/app/_components/ui/DelBtn";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/_components/ui/Dropdown/Dropdown";
// -----------------------------------------------------------------------------
import { deleteObjectById } from "@/app/_db/object";
import { objectTypeEnum, sectionTypeEnum } from "@/drizzle/schema";
// -----------------------------------------------------------------------------
import styles from "./styles.module.css";


export default function Header(props:Props) {
  const { className, style } = props;
  const { state, session } = useContext(ObjectViewContext);

  return (
    <header className={className} style={style}>
      <Card>
        <div style={{display: "grid", alignItems: "center", gridTemplateColumns: "auto auto", justifyContent: "start", marginBlockEnd: "5px"}}>
          <Breadcrumbs items={[
            {label: "Каталог", href: "/"},
            {label: `${state.city?.name ?? ""}`, href: `/?city=${state.city?.city_id}`},
            {label: `${state.sections?.filter((section) => section.section_type === sectionTypeEnum.section)[0]?.name_public_plural ?? ""}`, href: `/catalog/?city=${state.city?.city_id}&section=${state.sections?.filter((section) => section.section_type === sectionTypeEnum.section)[0]?.section_id}`}
          ]} style={{fontSize: "0.85em"}}/>
          {state.sections.filter((section) => section.section_type === sectionTypeEnum.section).length > 1
            ? <DropdownMenu>
                <DropdownMenuTrigger style={{display: "flex", alignItems: "center", fontSize: "0.85em", marginInlineStart: "20px"}}>ещё<ChevronDownIcon/></DropdownMenuTrigger>
                <DropdownMenuContent style={{padding: 0}}>
                {state.sections.slice(1).map((section) => (
                  <DropdownMenuItem key={section.section_id} style={{padding: 0}}>
                    <Link href={`/?city=${state.city_id}&section=${section.section_id}`} style={{padding: "5px"}}>{section.name_public_plural}</Link>
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
              </DropdownMenu>
            : null
          }
          {session ? (
            <div style={{marginInlineStart: "auto", display: "flex", gap: "10px"}}>
              {state.type === objectTypeEnum.org ? <Link href={`/object/add/place?parent=${state.object_id}`}>М</Link> : null}
              {state.type === objectTypeEnum.org ? <Link href={`/object/add/class?parent=${state.object_id}`}>С</Link> : null}
              <Link href={`/object/${state.object_id}/edit`}>Ред</Link>
              <DelBtn id={state.object_id ? state.object_id : -1} delFunc={deleteObjectById} redirectPath="/">X</DelBtn>
            </div>
          ) : null}
        </div>
        {<h1 style={{fontSize: "19px", fontWeight: "bold"}}>{state.name_type.concat(state.name_title ? ` «${state.name_title}»` : "").concat(state.name_where ? ` ${state.name_where}` : "")}</h1>}
        {state.parent_id ? <Link className={styles["header__backLink"]} href={`/object/${state.parent_id}`}>&lt; {state.parent?.name_type.concat(state.parent?.name_title ? ` «${state.parent?.name_title}»` : "").concat(state.parent?.name_where ? ` ${state.parent?.name_where}` : "")}</Link> : null}
      </Card>
    </header>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
}