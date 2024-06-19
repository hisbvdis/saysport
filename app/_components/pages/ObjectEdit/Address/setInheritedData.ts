import { objectReadProcessing } from "@/app/_db/object.processing";
import { DBObject, UIObject } from "@/app/_types/types";
import { create } from "mutative";
import { SetStateAction } from "react";

export const setInheritedData = (parent:DBObject, state:UIObject, setState:React.Dispatch<SetStateAction<UIObject>>) => {
  if (parent) {
    const processedParent = objectReadProcessing(parent);
    setState(create(state, (draft) => {
      draft.status_inherit = true;
      draft.coord_inherit = true;
      draft.schedule_inherit = true;
      draft.name_where = processedParent?.name_locative;
      draft.status = processedParent?.status;
      draft.status_comment = processedParent?.status_comment;
      draft.status_confirm = processedParent?.status_confirm;
      draft.city_id = processedParent?.city_id;
      draft.city = processedParent?.city;
      draft.parent_id = processedParent?.id;
      // draft.parent = processedParent;
      draft.address = processedParent?.address;
      draft.address_2 = processedParent?.address_2;
      draft.coord_lat = processedParent?.coord_lat;
      draft.coord_lon = processedParent?.coord_lon;
      draft.phones = processedParent?.phones;
      draft.links = processedParent?.links;
      draft.schedule_247 = processedParent?.schedule_247;
      draft.schedule = processedParent?.schedule;
      draft.schedule_date = processedParent?.schedule_date;
      draft.schedule_comment = processedParent?.schedule_comment;
      draft.schedule_source = processedParent?.schedule_source;
      draft.statusInstead = processedParent?.statusInstead;
      draft.status_instead_id = processedParent?.status_instead_id;
    }))
  } else {
    setState(create(state, (draft) => {
      draft.parent_id = null;
      draft.parent = null;
      draft.status_inherit = false;
      draft.coord_inherit = false;
      draft.schedule_inherit = false;
    }))
  }
}