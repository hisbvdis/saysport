import type { City, ObjectOnOption, Object_, Option, SectionOnSpec, Section, Spec, ObjectOnSection, objectTypeUnion, objectStatusUnion, Object_On_Link, ObjectPhone, ObjectLink, Object_On_Schedule, ObjectSchedule, ObjectPhoto, ObjectUsage } from "@/drizzle/schema";


// =============================================================================
// DB TYPES
// =============================================================================
export interface DBSpec extends Spec {
  options: Option[];
}

export interface DBSection extends Section {
  sectionOnSpec: (SectionOnSpec & { spec: DBSpec })[];
}

export interface DBObject extends Object_ {
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: Object_ | null;
  phones: ObjectPhone[],
  links: ObjectLink[],
  objectOnSection?: (ObjectOnSection & {section: Section & {sectionOnSpec: (SectionOnSpec & {spec: Spec & {options: Option[]}})[]}})[];
  objectOnOption?: (ObjectOnOption & {option: Option})[];
  usages?: ObjectUsage[];
  photos?: ObjectPhoto[];
  children?: DBObject[];
  schedules: ObjectSchedule[];
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

export interface UIObjectUsage extends Partial<ObjectUsage> {
  usage_id:number;
  object_id:number;
  section_id:number;
}

export interface UIScheduleDay extends ObjectSchedule {
  isWork:boolean;
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
  usages?: UIObjectUsage[];
  photos?: (ObjectPhoto & {uiID: string, blob?: string, file?: File})[];
  children?: DBObject[];
  schedules: UIScheduleDay[];
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}