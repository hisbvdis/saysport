import { nanoid } from "nanoid";
import { create } from "mutative";
import { useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { FieldSet } from "@/app/_components/ui/FieldSet";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { UIContactTypeEnum } from "@/drizzle/schema";


export default function Contacts() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleContacts = {
    add: (type:UIContactTypeEnum) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft[type]) draft[type] = [];
        draft[type] = draft[type]?.concat({object_id: 0, value: "", order: draft[type]?.length ?? 0, uiID: nanoid(), comment: ""})
      }))
    },
    delete: (type:UIContactTypeEnum, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        draft[type] = draft[type]?.filter((item) => item.uiID !== uiID);
      }));
    },
    changeValue: (type:UIContactTypeEnum, value:string, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const item = draft[type]?.find((item) => item.uiID === uiID);
        if (!item) return;
        item.value = value;
      }));
    },
    changeComment: (type:UIContactTypeEnum, value:string, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const item = draft[type]?.find((item) => item.uiID === uiID);
        if (!item) return;
        item.comment = value;
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Контакты</Card.Heading>
      <Card.Section style={{display: "flex", gap: "10px"}}>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSet.Legend style={{marginBlockEnd: "10px"}}>
            <span>Ссылка</span>
            <Button onClick={() => handleContacts.add(UIContactTypeEnum.links)} disabled={Boolean(state.parent_id)}>+</Button>
          </FieldSet.Legend>
          <FieldSet.Section style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {state.links?.map((link) => (
              <div key={link.uiID} style={{display: "grid", gridTemplateColumns: "auto 1fr"}}>
                <Button
                  style={{gridRow: "1 / span 2"}}
                  onClick={() => handleContacts.delete(UIContactTypeEnum.links, link.uiID)}
                  tabIndex={-1}
                  disabled={Boolean(state.parent_id)}
                >X</Button>
                <Input
                  value={link.value}
                  placeholder="site.com"
                  disabled={Boolean(state.parent_id)}
                  onChangeValue={(value) => handleContacts.changeValue(UIContactTypeEnum.links, value, link.uiID)}
                />
                {/* <Input
                  value={link.comment}
                  placeholder="Комментарий"
                  disabled={Boolean(state.parent_id)}
                  onChangeValue={(value) => handleContacts.changeComment(UIContactTypeEnum.links, value, link.uiID)}
                /> */}
              </div>
            ))}
          </FieldSet.Section>
        </FieldSet>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSet.Legend style={{marginBlockEnd: "10px"}}>
            <span>Телефоны</span>
            <Button onClick={() => handleContacts.add(UIContactTypeEnum.phones)} disabled={Boolean(state.parent_id)}>+</Button>
          </FieldSet.Legend>
          <FieldSet.Section style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {state.phones?.map((phone) => (
              <div key={phone.uiID} style={{display: "grid", gridTemplateColumns: "auto 1fr"}}>
                <Button
                  style={{gridRow: "1 / span 2"}}
                  onClick={() => handleContacts.delete(UIContactTypeEnum.phones, phone.uiID)}
                  tabIndex={-1}
                  disabled={Boolean(state.parent_id)}
                >X</Button>
                <Input
                  value={phone.value}
                  placeholder="+1 (111) 111-11-11"
                  disabled={Boolean(state.parent_id)}
                  onChangeValue={(value) => handleContacts.changeValue(UIContactTypeEnum.phones, value, phone.uiID)}
                />
                {/* <Input
                  value={phone.comment}
                  placeholder="Комментарий"
                  disabled={Boolean(state.parent_id)}
                  onChangeValue={(value) => handleContacts.changeComment(UIContactTypeEnum.phones, value, phone.uiID)}
                /> */}
              </div>
            ))}
          </FieldSet.Section>
        </FieldSet>
      </Card.Section>
    </Card>
  )
}