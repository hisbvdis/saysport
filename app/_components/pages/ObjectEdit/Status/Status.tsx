import clsx from "clsx";
import { useContext } from "react";
import { $Enums } from "@prisma/client";
// -----------------------------------------------------------------------------
import { Input } from "@/app/_components/ui/Input";
import { Select } from "@/app/_components/ui/Select";
import { Control } from "@/app/_components/ui/Control";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { create } from "mutative";
import { getObjectsByFilters } from "@/app/_db/object";


export default function Status(props:Props) {
  const { state, setState, handleStateChange } = useContext(ObjectEditContext);
  const { className, style } = props;

  return (
    <div className={clsx(className)} style={{...style, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px"}}>
      <Control>
        <Control.Label>Status</Control.Label>
        <Control.Section>
          <Select
            name="status"
            value={state?.status}
            onChange={handleStateChange?.value}
            disabled={Boolean(state?.status_inherit)}
            items={[
              {id: $Enums.objectStatusEnum.works, label: "Works"},
              {id: $Enums.objectStatusEnum.open_soon, label: "Opening soon"},
              {id: $Enums.objectStatusEnum.might_not_work, label: "Might not work"},
              {id: $Enums.objectStatusEnum.closed_temp, label: "Closed temporarily"},
              {id: $Enums.objectStatusEnum.closed_forever, label: "Closed forever"},
            ]}
          />
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Comment</Control.Label>
        <Control.Section>
          <Input
            name="status_comment"
            value={state?.status_comment}
            onChange={handleStateChange?.value}
            disabled={state?.status_inherit || state?.status === $Enums.objectStatusEnum.works}
          />
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Confirmation (link)</Control.Label>
        <Control.Section>
          <Input
            name="status_confirm"
            value={state?.status_confirm}
            onChange={handleStateChange?.value}
            disabled={state?.status_inherit || state?.status === $Enums.objectStatusEnum.works}
          />
        </Control.Section>
      </Control>
      <Control>
        <Control.Label>Instead of closed</Control.Label>
        <Control.Section>
          <Select
            name="status_instead_id"
            value={state?.status_instead_id}
            label={state?.statusInstead?.name}
            onChange={handleStateChange?.value}
            onChangeData={(data) => setState(create((draft) => {draft.statusInstead = data}))}
            isAutocomplete
            placeholder="Enter name"
            disabled={state?.status_inherit || state?.status !== $Enums.objectStatusEnum.closed_forever}
            requestItemsOnInputChange={
              async (value) => (await getObjectsByFilters({cityId: state?.city_id!, type: state?.type, query: value}))
              ?.filter((object) => object.id !== state?.id)
              ?.map((object) => ({id: object.id, label: object.name, data: object}))
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