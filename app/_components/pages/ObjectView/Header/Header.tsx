import { useContext } from "react"
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Breadcrumbs } from "@/app/_components/ui/Breadcrumbs";
// -----------------------------------------------------------------------------
import { ObjectViewContext } from "../"
import Link from "next/link";
import { deleteObjectById } from "@/app/_db/object";
import { DelBtn } from "@/app/_components/ui/DelBtn";


export default function Header(props:Props) {
  const { className, style } = props;
  const { state } = useContext(ObjectViewContext);

  return (
    <header className={className} style={style}>
      <Card>
        <div style={{display: "flex"}}>
          <Breadcrumbs items={[
            {label: "Каталог", href: "/catalog"},
            {label: `${state.city?.name ?? ""}`, href: `/catalog?city=${state.city?.id}`},
            {label: `${state.sections?.[0]?.name_plural ?? ""}`, href: `/catalog?city=${state.city?.id}&section=${state.sections?.[0]?.id}`}
          ]} style={{fontSize: "0.85em"}}/>
          <Link href={`/object/${state.id}/edit`} style={{marginInlineStart: "auto"}}>Ред</Link>
          <DelBtn id={state.id!} delFunc={deleteObjectById} redirectPath="/">X</DelBtn>
        </div>
        <h1>{state.name} {state.name_where}</h1>
        {state.parent_id ? <Link href={`/object/${state.parent_id}`}>&lt; {state.parent?.name}</Link> : null}
      </Card>
    </header>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
}