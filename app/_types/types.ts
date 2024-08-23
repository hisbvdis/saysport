import type { City, ObjectOnOption, Object_, Option, SectionOnSpec, Section, Spec, ObjectOnSection, objectTypeUnion, objectStatusUnion, ObjectPhone, ObjectLink, ObjectPhoto, Category, CategoryOnSection, ObjectOnUsage, Usage, ObjectSchedule, SectionOnUsage } from "@/drizzle/schema";


// =============================================================================
// DB TYPES
// =============================================================================
export interface DBCategory extends Category {
  categoryOnSections?: (CategoryOnSection & {section: Section})[];
}

export interface DBSection extends Section {
  sectionOnSpecs?: (SectionOnSpec & { spec: DBSpec })[];
  sectionOnUsages?: (SectionOnUsage & {usage: Usage})[];
}

export interface DBSpec extends Spec {
  options: Option[];
}

export interface DBObject extends Object_ {
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: Object_ | null;
  phones?: ObjectPhone[],
  links?: ObjectLink[],
  objectOnSections?: (ObjectOnSection & {section: Section & {sectionOnSpecs: (SectionOnSpec & {spec: Spec & {options: Option[]}})[]}})[];
  objectOnOptions?: (ObjectOnOption & {option: Option})[];
  objectOnUsages?: (ObjectOnUsage & {usage: Usage, schedules: ObjectSchedule[]})[];
  photos?: ObjectPhoto[];
  children?: DBObject[];
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
  usages: SectionOnUsage[];
  uiID: string;
}

export interface UIUsage extends ObjectOnUsage, Usage {
  uiID: string;
  schedules: UISchedule[];
}

export interface UISchedule extends ObjectSchedule {
  uiID: string;
}

export interface UICategory extends Category {
  sections: Section[];
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
  usages: UIUsage[];
  photos?: (ObjectPhoto & {uiID: string, blob?: string, file?: File})[];
  children?: DBObject[];
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}