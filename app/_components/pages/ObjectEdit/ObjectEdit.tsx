"use client";
import { create } from "mutative";
import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type ChangeEventHandler, type SetStateAction, type SyntheticEvent, createContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/ui/Form";
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
import { NameOrg, NamePlace, Address, Contacts, Sections, Description, Schedule, Photos } from "./"
// -----------------------------------------------------------------------------
import type { UIObject } from "@/app/_types/types";
import { deleteObjectById, upsertObject } from "@/app/_db/object";


export default function ObjectEdit(props:{init:UIObject}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:ChangeEvent<HTMLInputElement>) => {
      setState(create(state, (draft) => {draft[e.target.name] = e.target.value}));
    },
    checked: (e:ChangeEvent<HTMLInputElement>) => {
      setState(create(state, (draft) => {draft[e.target.name] = e.target.checked}));
    },
    valueAsNumber: (e:ChangeEvent<HTMLInputElement>) => {
      setState(create(state, (draft) => {draft[e.target.name] = Number(e.target.value)}));
    },
  }

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    // const stateWithoutPhotoFiles = {...state, photos: state.photos?.map((photo) => ({...photo, file: undefined}))};
    // const { id } = await upsertObject(stateWithoutPhotoFiles, props.init);
    const { id } = await upsertObject(state, props.init);
    // await syncPhotos(id, state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push(`/object/${id}`);
    } else {
      router.replace(`/object/${id}/edit`, {scroll: false});
      router.refresh();
    }
  }

  return (
    <ObjectEditContext.Provider value={{ state, setState, handleStateChange }}>
      <Form onSubmit={handleFormSubmit}>
        {state.type === $Enums.objectTypeEnum.org ? <NameOrg/> : <NamePlace/>}
        <Address/>
        <Contacts/>
        <Sections/>
        <Description/>
        <Schedule/>
        <Photos/>
        <EditBottomPanel
          id={state.id}
          delFunc={deleteObjectById}
          exitRedirectPath="./"
          delRedirectPath="/catalog"
        />
      </Form>
    </ObjectEditContext.Provider>
  )
}

export const ObjectEditContext = createContext<ObjectEditContextType>({} as ObjectEditContextType);

interface ObjectEditContextType {
  state: UIObject;
  setState: React.Dispatch<SetStateAction<UIObject>>;
  handleStateChange: {
    value: ChangeEventHandler,
    checked: ChangeEventHandler,
    valueAsNumber: ChangeEventHandler,
  }
}