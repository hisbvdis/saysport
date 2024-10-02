"use client";
import { create } from "mutative";
import type * as Leaflet from "leaflet";
import { useRouter } from "next/navigation";
import { objectTypeEnum } from "@/drizzle/schema";
import type { UIObject, ProcessedDBObject, ProccessedDBOption, ProcessedDBSection, ProcessedDBSpec } from "@/app/_types/db";
import { type ChangeEvent, type ChangeEventHandler, type Dispatch, type SetStateAction, type SyntheticEvent, createContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { EditBottomPanel } from "@/app/_components/blocks/EditBottomPanel";
import { NameOrg, NamePlace, Address, Contacts, Sections, Description, Photos, Usages, NameClass } from "./"
// -----------------------------------------------------------------------------
import { syncPhotos } from "./Photos/syncPhotos";
import { setInheritedData } from "./Address/setInheritedData";
import { deleteObjectById, upsertObject } from "@/app/_actions/db/object";


export default function ObjectEdit(props:{init:UIObject, parent?:ProcessedDBObject|null, commonSections?: ProcessedDBSection[]}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();
  const [ mapInstance, setMapInstance ] = useState<Leaflet.Map>();

  const handleStateChange = {
    value: ({name, value}:{name:string, value:string}) => {
      setState((prevState) => create(prevState, (draft) => {draft[name as keyof typeof draft] = value as never}));
    },
    checked: (e:ChangeEvent<HTMLInputElement>) => {
      setState((prevState) => create(prevState, (draft) => {draft[e.target.name as keyof typeof draft] = e.target.checked as never}));
    }
  }

  const handleSections = {
    add: (section:ProcessedDBSection) => {
      if (!section.section_id || state.sections?.some((stateSection) => stateSection.section_id === section.section_id)) return;
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.sections) draft.sections = [];
        draft.sections.push(section);
      }))
    },
    delete: (section:ProcessedDBSection) => {
      setState((prevState) => create(prevState, (draft) => {
        draft.sections = draft.sections?.filter((draftSection) => draftSection.section_id !== section.section_id);
        const optionsOfDeletedSection = section.specs?.flatMap((spec) => spec.options?.flatMap(({spec_id}) => spec_id));
        draft.options = draft.options?.filter((option) => !optionsOfDeletedSection.includes(option.spec_id));
      }));
    },
  }

  const handleOptions = {
    changeCheckbox: (e:ChangeEvent<HTMLInputElement>, opt: ProccessedDBOption) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.options) draft.options = [];
        if (e.target.checked) {
          draft.options = draft.options.concat(opt);
        } else {
          draft.options = draft.options.filter(({option_id}) => option_id !== opt.option_id);
        }
      }))
    },
    changeRadio: (spec:ProcessedDBSpec, opt:ProccessedDBOption) => {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.options) draft.options = [];
        draft.options = draft.options?.filter((stateOpt) => !spec.options?.map((opt) => opt.option_id).includes(stateOpt.option_id));
        draft.options = draft.options?.concat(opt);
      }));
    },
  }

  useEffect(() => {
    if (state.object_id) return;
    if (state.type === objectTypeEnum.place || state.type === objectTypeEnum.class) {
      setState((prevState) => create(prevState, (draft) => {
        if (!draft.sections) draft.sections = [];
        if (!props.commonSections?.length) return;
        draft.sections = draft.sections.concat(props.commonSections);
      }))
    }
    if (!props.parent) return;
    setInheritedData(props.parent, setState);
  }, [])

  useEffect(() => {
    if (!state.parent) return;
    mapInstance?.setView([state.coord_lat, state.coord_lon]);
  }, [mapInstance])

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
    <ObjectEditContext.Provider value={{ state, setState, handleStateChange, handleSections, handleOptions, mapInstance, setMapInstance }}>
      <form onSubmit={handleFormSubmit}>
        {state.type === objectTypeEnum.org ? <NameOrg/> : null}
        {state.type === objectTypeEnum.place ? <NamePlace/> : null}
        {state.type === objectTypeEnum.class ? <NameClass/> : null}
        <Address/>
        <Contacts/>
        <Description/>
        <Sections/>
        <Usages/>
        <Photos/>
        <EditBottomPanel
          id={state.object_id}
          delFunc={deleteObjectById}
          exitRedirectPath="./"
          delRedirectPath="/"
        />
      </form>
    </ObjectEditContext.Provider>
  )
}

export const ObjectEditContext = createContext<ObjectEditContextType>({} as ObjectEditContextType);

interface ObjectEditContextType {
  state: UIObject;
  setState: React.Dispatch<SetStateAction<UIObject>>;
  handleStateChange: {
    value: (data:{name:string, value:string}) => void,
    checked: ChangeEventHandler,
  },
  handleSections: {
    add: (section:ProcessedDBSection) => void,
    delete: (section:ProcessedDBSection) => void,
  },
  handleOptions: {
    changeCheckbox: (e:ChangeEvent<HTMLInputElement>, opt: ProccessedDBOption) => void,
    changeRadio: (spec:ProcessedDBSpec, opt:ProccessedDBOption) => void,
  },
  mapInstance?: Leaflet.Map;
  setMapInstance: Dispatch<SetStateAction<Leaflet.Map | undefined>>;
}