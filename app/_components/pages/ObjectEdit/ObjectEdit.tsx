"use client";
import { create } from "mutative";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type ChangeEventHandler, type SetStateAction, type SyntheticEvent, createContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/ui/Form";
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
import { NameOrg, NamePlace, Address, Contacts, Specs, Description, Schedule, Photos } from "./"
// -----------------------------------------------------------------------------
import type { UIObject, UISection } from "@/app/_types/types";
import { syncPhotos } from "./Photos/syncPhotos";
import { setInheritedData } from "./Address/setInheritedData";
import { deleteObjectById, upsertObject } from "@/app/_db/object";
import { objectTypeEnum } from "@/drizzle/schema";


export default function ObjectEdit(props:{init:UIObject, parent?:UIObject|null, commonPlaceSection?: UISection}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name as keyof typeof draft] = e.target.value as never}));
    },
    checked: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name as keyof typeof draft] = e.target.checked as never}));
    },
    valueAsNumber: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name as keyof typeof draft] = Number(e.target.value) as never || null}));
    },
  }

  useEffect(() => {
    if (state.object_id) return;
    if (state.type === objectTypeEnum.place) {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.sections) draft.sections = [];
        if (!props.commonPlaceSection) return;
        draft.sections.push(props.commonPlaceSection);
      }))
    }
    if (!props.parent) return;
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
      // router.refresh();
    }
  }

  return (
    <ObjectEditContext.Provider value={{ state, setState, handleStateChange }}>
      <Form onSubmit={handleFormSubmit}>
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
  },
}