import type { City, Object_On_Option, Object_, Option, Section_On_Spec, Section, Spec, Object_On_Section, objectTypeUnion, objectStatusUnion, Object_On_Link, ObjectPhone, ObjectLink, Object_On_Schedule, ObjectSchedule, ObjectPhoto, ObjectUsage } from "@/drizzle/schema";


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
  phones: ObjectPhone[],
  links: ObjectLink[],
  objectOnSection?: (Object_On_Section & {section: Section & {sectionOnSpec: (Section_On_Spec & {spec: Spec & {options: Option[]}})[]}})[];
  objectOnOption?: (Object_On_Option & {option: Option})[];
  usages: (ObjectUsage & {section: DBSection})[];
  schedules?: ObjectSchedule[];
  photos?: ObjectPhoto[];
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
  name_type: string;
  coord_lat: number;
  coord_lon: number;
  city_id: number;
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: Object_ | UIObject | null;
  phones?: (ObjectPhone & {uiID: string})[];
  links?: (ObjectLink & {uiID: string})[];
  sections: UISection[];
  options?: UIOption[];
  usages: (ObjectUsage & {section: UISection})[];
  schedule: (ObjectSchedule & {uiID: string, isWork: boolean})[];
  photos?: (ObjectPhoto & {uiID: string, blob?: string, file?: File})[];
  children?: DBObject[];
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}