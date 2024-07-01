"use client";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, SetStateAction, SyntheticEvent, createContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/ui/Form";
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
import { NameOrg, NamePlace, Address, Contacts, Specs, Description, Schedule, Photos } from "./"
// -----------------------------------------------------------------------------
import { UIObject } from "@/app/_types/types";
import { syncPhotos } from "./Photos/syncPhotos";
import { setInheritedData } from "./Address/setInheritedData";
import { deleteObjectById, upsertObject } from "@/app/_db/object";
import { objectTypeEnum } from "@/drizzle/schema";


export default function ObjectEdit(props:{init:UIObject, parent?:UIObject|null}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name] = e.target.value}));
    },
    checked: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name] = e.target.checked}));
    },
    valueAsNumber: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name] = Number(e.target.value) || null}));
    },
  }

  useEffect(() => {
    if (state.id || !props.parent) return;
    setInheritedData(props.parent, setState);
  }, [])

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const stateWithoutFiles = {...state, photos: state.photos?.map((photo) => ({...photo, file: undefined}))};
    const { object_id } = await upsertObject(stateWithoutFiles, props.init);
    await syncPhotos(object_id, state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push(`/object/${object_id}`);
    } else {
      router.replace(`/object/${object_id}/edit`, {scroll: false});
      router.refresh();
    }
  }

  return (
    <ObjectEditContext.Provider value={{ state, setState, handleStateChange }}>
      <Form onSubmit={handleFormSubmit} noValidate>
        {state.type === objectTypeEnum.org ? <NameOrg/> : <NamePlace/>}
        <Address/>
        <Contacts/>
        <Specs/>
        <Description/>
        <Schedule/>
        <Photos/>
        <EditBottomPanel
          id={state.object_id}
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