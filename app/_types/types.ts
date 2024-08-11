import type { City, ObjectOnOption, Object_, Option, SectionOnSpec, Section, Spec, ObjectOnSection, objectTypeUnion, objectStatusUnion, ObjectPhone, ObjectLink, ObjectSchedule, ObjectPhoto, SectionOnUsage, Category, CategoryOnSection } from "@/drizzle/schema";

// =============================================================================
// DB TYPES
// =============================================================================
export interface DBCategory extends Category {
  categoryOnSection?: (CategoryOnSection & {section: Section})[];
}

export interface DBSection extends Section {
  sectionOnSpec?: (SectionOnSpec & { spec: DBSpec })[];
  sectionOnUsage?: (SectionOnUsage & { usage: DBSection })[];
  description?:string|null;
}

export interface DBSpec extends Spec {
  options: Option[];
}

export interface DBObject extends Object_ {
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: Object_ & {schedules: ObjectSchedule[]} | null;
  phones?: ObjectPhone[],
  links?: ObjectLink[],
  objectOnSection?: (ObjectOnSection & {section: Section & {sectionOnSpec: (SectionOnSpec & {spec: Spec & {options: Option[]}})[]}, description:string|null})[];
  objectOnOption?: (ObjectOnOption & {option: Option})[];
  photos?: ObjectPhoto[];
  children?: DBObject[];
  schedules?: ObjectSchedule[];
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
  usages: UISection[];
  description?:string|null;
  uiID: string;
}

export interface UICategory extends Category {
  sections: Section[];
}

export interface UIScheduleDay extends ObjectSchedule {
  isWork?:boolean;
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
  parent?: UIObject | null;
  phones?: (ObjectPhone & {uiID: string})[];
  links?: (ObjectLink & {uiID: string})[];
  sections: UISection[];
  options?: UIOption[];
  photos?: (ObjectPhoto & {uiID: string, blob?: string, file?: File})[];
  children?: DBObject[];
  schedules: UIScheduleDay[];
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}