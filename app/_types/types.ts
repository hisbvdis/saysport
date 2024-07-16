import { type City, type Object_Link, type Object_On_Option, type Object_Phone, type Object_Photo, type Object_Schedule, type Object_, type Option, type Section_On_Spec, type Section, type Spec, objectTypeEnum, type Object_On_Section, objectStatusEnum, type objectTypeUnion, type objectStatusUnion } from "@/drizzle/schema";


// =============================================================================
// DB TYPES
// =============================================================================
export interface DBSpec extends Spec {
  options: Option[];
}

export interface DBSection extends Section {
  sectionOnSpec: (Section_On_Spec & { spec: DBSpec })[];
}

export interface DBObject extends Object_ {
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: Object_ | null;
  phones?: Object_Phone[];
  links?: Object_Link[];
  objectOnSection?: (Object_On_Section & {section: Section & {sectionOnSpec: (Section_On_Spec & {spec: Spec & {options: Option[]}})[]}})[];
  objectOnOption?: (Object_On_Option & {option: Option})[];
  schedule?: Object_Schedule[];
  photos?: Object_Photo[];
  children?: DBObject[],
}


// =============================================================================
// UI TYPES
// =============================================================================
export interface UIOption extends Option {
  uiID: string;
}

export interface UISpec extends Spec {
  options: UIOption[];
  uiID: string;
};

export interface UISection extends Section {
  specs: UISpec[];
  uiID: string;
}

export interface UIObject extends Partial<Object_> {
  name: string;
  city_id: number;
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: Object_ | UIObject | null;
  phones?: (Object_Phone & {uiID: string})[];
  links?: (Object_Link & {uiID: string})[];
  sections?: UISection[];
  options?: UIOption[];
  schedule: (Object_Schedule & {uiID: string, isWork: boolean})[];
  photos?: (Object_Photo & {uiID: string, blob?: string, file?: File})[];
  children?: DBObject[];
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}