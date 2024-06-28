import { create } from "mutative";
import { ChangeEvent, useContext } from "react";
// -----------------------------------------------------------------------------
import { Card } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";
import { Button } from "@/app/_components/ui/Button";
import { FieldSet } from "@/app/_components/ui/FieldSet";
// -----------------------------------------------------------------------------
import { ObjectEditContext } from "../ObjectEdit";
import { UIContactTypeEnum } from "@/app/_types/types";


export default function Contacts() {
  const { state, setState } = useContext(ObjectEditContext);

  const handleContacts = {
    add: (type:UIContactTypeEnum) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft[type]) draft[type] = [];
        draft[type] = draft[type]?.concat({contact_id: -1, object_id: -1, value: "", order: draft[type]?.length ?? 0, uiID: crypto.randomUUID(), comment: ""})
      }))
    },
    delete: (type:UIContactTypeEnum, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        draft[type] = draft[type]?.filter((item) => item.uiID !== uiID);
      }));
    },
    changeValue: (type:UIContactTypeEnum, e:ChangeEvent<HTMLInputElement>, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const item = draft[type]?.find((item) => item.uiID === uiID);
        if (!item) return;
        item.value = e.target.value;
      }));
    },
    changeComment: (type:UIContactTypeEnum, e:ChangeEvent<HTMLInputElement>, uiID:string) => {
      setState((prevState) => create(prevState, (draft) => {
        const item = draft[type]?.find((item) => item.uiID === uiID);
        if (!item) return;
        item.comment = e.target.value;
      }));
    },
  }

  return (
    <Card style={{marginBlockStart: "10px"}}>
      <Card.Heading>Контакты</Card.Heading>
      <Card.Section style={{display: "flex", gap: "10px"}}>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSet.Legend style={{marginBlockEnd: "10px"}}>
            <span>Телефоны</span>
            <Button onClick={() => handleContacts.add(UIContactTypeEnum.PHONES)} disabled={Boolean(state.parent_id)}>+</Button>
          </FieldSet.Legend>
          <FieldSet.Section style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {state.phones?.map((phone) => (
              <div key={phone.uiID} style={{display: "grid", gridTemplateColumns: "auto 1fr"}}>
                <Button
                  style={{gridRow: "1 / span 2"}}
                  onClick={() => handleContacts.delete(UIContactTypeEnum.PHONES, phone.uiID)}
                  tabIndex={-1}
                  disabled={Boolean(state.parent_id)}
                >X</Button>
                <Input
                  value={phone.value}
                  placeholder="+1 (111) 111-11-11"
                  disabled={Boolean(state.parent_id)}
                  onChange={(e) => handleContacts.changeValue(UIContactTypeEnum.PHONES, e, phone.uiID)}
                />
                <Input
                  value={phone.comment}
                  placeholder="Комментарий"
                  disabled={Boolean(state.parent_id)}
                  onChange={(e) => handleContacts.changeComment(UIContactTypeEnum.PHONES, e, phone.uiID)}
                />
              </div>
            ))}
          </FieldSet.Section>
        </FieldSet>
        <FieldSet style={{flexBasis: "50%"}}>
          <FieldSet.Legend style={{marginBlockEnd: "10px"}}>
            <span>Ссылка</span>
            <Button onClick={() => handleContacts.add(UIContactTypeEnum.LINKS)} disabled={Boolean(state.parent_id)}>+</Button>
          </FieldSet.Legend>
          <FieldSet.Section style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {state.links?.map((link) => (
              <div key={link.uiID} style={{display: "grid", gridTemplateColumns: "auto 1fr"}}>
                <Button
                  style={{gridRow: "1 / span 2"}}
                  onClick={() => handleContacts.delete(UIContactTypeEnum.LINKS, link.uiID)}
                  tabIndex={-1}
                  disabled={Boolean(state.parent_id)}
                >X</Button>
                <Input
                  value={link.value}
                  placeholder="site.com"
                  disabled={Boolean(state.parent_id)}
                  onChange={(e) => handleContacts.changeValue(UIContactTypeEnum.LINKS, e, link.uiID)}
                />
                <Input
                  value={link.comment}
                  placeholder="Комментарий"
                  disabled={Boolean(state.parent_id)}
                  onChange={(e) => handleContacts.changeComment(UIContactTypeEnum.LINKS, e, link.uiID)}
                />
              </div>
            ))}
          </FieldSet.Section>
        </FieldSet>
      </Card.Section>
    </Card>
  )
}