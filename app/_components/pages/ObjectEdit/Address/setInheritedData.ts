import type { UIObject, ProcessedDBObject } from "@/app/_types/db";
import { create } from "mutative";
import type { SetStateAction } from "react";

export const setInheritedData = (parent:ProcessedDBObject|null, setState:React.Dispatch<SetStateAction<UIObject>>) => {
  if (parent) {
    setState((prevState) => create(prevState, (draft) => {
      draft.status_inherit = true;
      draft.coord_inherit = true;
      draft.name_where = `${parent?.name_locative} ${parent.name_title ? `«${parent.name_title}»` : ""} ${parent.name_where ?? ""}`;
      draft.status = parent?.status;
      draft.status_comment = parent?.status_comment;
      draft.status_source = parent?.status_source;
      draft.city_id = parent?.city_id;
      draft.city = parent?.city;
      draft.parent_id = parent?.object_id;
      draft.parent = parent;
      draft.address = parent?.address;
      draft.address_2 = parent?.address_2;
      draft.coord_lat = parent?.coord_lat;
      draft.coord_lon = parent?.coord_lon;
      draft.phones = parent?.phones;
      draft.links = parent?.links;
      draft.statusInstead = parent?.statusInstead;
      draft.status_instead_id = parent?.status_instead_id;
    }))
  } else {
    setState((prevState) => create(prevState, (draft) => {
      draft.parent_id = null;
      draft.parent = null;
      draft.status_inherit = false;
      draft.coord_inherit = false;
    }))
  }
}