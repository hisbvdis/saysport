import clsx from "clsx";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Input } from "@/app/_components/ui/Input";
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { create } from "mutative";
import { getObjectsByFilters } from "@/app/_db/object";
import { objectStatusEnum } from "@/drizzle/schema";
import { Checkbox } from "@/app/_components/ui/Choice";


export default function Status(props:Props) {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);
  const { className, style } = props;

  return (
    <div className={clsx(className)} style={{...style, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px"}}>
      <Control>
        <Control.Label>
          <span>Статус</span>
          {state.parent_id && <Checkbox name="status_inherit" checked={Boolean(state.status_inherit)} onChange={handleStateChange.checked} disabled={!state.parent_id}>Наследовать</Checkbox>}
        </Control.Label>
        <Control.Section>
          <Select
            name="status"
            value={state?.status}
            onChange={handleStateChange?.value}
            disabled={Boolean(state?.status_inherit)}
            items={[
              {id: objectStatusEnum.works, label: "Работает"},
              {id: objectStatusEnum.open_soon, label: "Скоро открытие"},
              {id: objectStatusEnum.might_closed, label: "Возможно, не работает"},
              {id: objectStatusEnum.closed_temp, label: "Временно закрыто"},
              {id: objectStatusEnum.closed_forever, label: "Закрыто навсегда"},
            ]}
          />
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Комментарий</Control.Label>
        <Control.Section>
          <Input
            name="status_comment"
            value={state?.status_comment}
            onChange={handleStateChange?.value}
            disabled={state?.status_inherit || state?.status === objectStatusEnum.works}
          />
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Подтверждение</Control.Label>
        <Control.Section>
          <Input
            name="status_confirm"
            value={state?.status_confirm}
            onChange={handleStateChange?.value}
            disabled={state?.status_inherit || state?.status === objectStatusEnum.works}
          />
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Вместо закрытого</Control.Label>
        <Control.Section>
          <Select
            name="status_instead_id"
            value={state?.status_instead_id}
            label={`${state?.statusInstead?.name_type ?? ""} ${state.statusInstead?.name_title ?? ""} ${state.statusInstead?.name_where ?? ""}`}
            onChange={handleStateChange?.valueAsNumber}
            onChangeData={(data) => setState(create((draft) => {draft.statusInstead = data}))}
            isAutocomplete
            placeholder="Введите название"
            disabled={state?.status_inherit || state?.status !== objectStatusEnum.closed_forever}
            requestItemsOnInputChange={
              async (value) => (await getObjectsByFilters({city: String(state.city_id), type: state?.type, query: value}))
              ?.filter((object) => object.object_id !== state?.object_id)
              ?.map((object) => ({id: object.object_id, label: `${object.name_type ?? ""} ${object.name_title ?? ""} ${object.name_where ?? ""}`, data: object}))
            }
          />
        </Control.Section>
      </Control>
    </div>
  )
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
}