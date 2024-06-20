"use client";
import { create } from "mutative";
import { $Enums } from "@prisma/client";
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
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name] = Number(e.target.value)}));
    },
  }

  useEffect(() => {
    if (state.id || !props.parent) return;
    setInheritedData(props.parent, setState);
  }, [])

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const stateWithoutFiles = {...state, photos: state.photos?.map((photo) => ({...photo, file: undefined}))};
    const { id } = await upsertObject(stateWithoutFiles, props.init);
    await syncPhotos(id, state, props.init);
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
        <Specs/>
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