import type { City, ObjectOnOption, Object_, Option, SectionOnSpec, Section, Spec, ObjectOnSection, objectTypeUnion, objectStatusUnion, ObjectPhone, ObjectLink, ObjectPhoto, Category, CategoryOnSection, ObjectOnUsage, Usage, ObjectSchedule, SectionOnUsage } from "@/drizzle/schema";


// =============================================================================
// OPTION
// =============================================================================
export interface ProcOption extends Option {
  uiID: string;
}


// =============================================================================
// SPEC
// =============================================================================
export interface DBSpec extends Spec {
  options: Option[];
}

export interface ProcSpec extends Spec {
  options: ProcOption[];
  uiID: string;
};

export interface EditSpec extends Omit<ProcSpec, "spec_id"> {
  spec_id: ProcSpec["spec_id"] | null;
};


// =============================================================================
// SECTION
// =============================================================================
export interface DBSection extends Section {
  sectionOnSpecs?: (SectionOnSpec & { spec: DBSpec })[];
  sectionOnUsages?: (SectionOnUsage & {usage: Usage})[];
}

export interface ProcSection extends Section {
  specs: ProcSpec[];
  usages: (SectionOnUsage & Usage)[];
  uiID: string;
}

export interface EditSection extends Omit<ProcSection, "section_id"> {
  section_id: ProcSection["section_id"] | null;
}


// =============================================================================
// CATEGORY
// =============================================================================
export interface DBCategory extends Category {
  categoryOnSections?: (CategoryOnSection & {section: Section})[];
}

export interface ProcCategory extends Category {
  sections: Section[];
}

export interface EditCategory extends Omit<ProcCategory, "category_id"> {
  category_id: ProcCategory["category_id"] | null;
}


// =============================================================================
// USAGE
// =============================================================================
export interface EditUsage extends Omit<Usage, "usage_id"> {
  usage_id: Usage["usage_id"] | null;
}


// =============================================================================
// OBJECT USAGE
// =============================================================================
export interface ProcObjectUsage extends ObjectOnUsage, Usage {
  uiID: string;
  schedules: ProcObjectSchedule[];
}

export interface EditObjectUsage extends Omit<ProcObjectUsage, "object_on_usage_id"|"object_id"|"schedules"> {
  object_id: ProcObjectUsage["object_id"] | null;
  object_on_usage_id: ProcObjectUsage["object_on_usage_id"] | null;
  uiID: string;
  schedules: EditObjectSchedule[];
}


// =============================================================================
// OBJECT SCHEDULE
// =============================================================================
export interface ProcObjectSchedule extends ObjectSchedule {
  uiID: string;
}

export interface EditObjectSchedule extends Omit<ProcObjectSchedule, "object_on_usage_id"|"object_id"|"schedule_id"> {
  object_id: ProcObjectSchedule["object_id"] | null;
  object_on_usage_id: ProcObjectSchedule["object_on_usage_id"] | null;
  schedule_id: ProcObjectSchedule["schedule_id"] | null;
}


// =============================================================================
// PHOTO
// =============================================================================
export interface EditObjectPhoto extends Omit<ObjectPhoto, "object_id" | "photo_id"> {
  object_id: ObjectPhoto["object_id"] | null;
  photo_id: ObjectPhoto["photo_id"] | null;
  uiID: string;
  blob?: string;
  file?: File;
}


// =============================================================================
// OBJECT
// =============================================================================
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

export interface ProcObject extends Partial<Object_> {
  name_type: string;
  coord_lat: number;
  coord_lon: number;
  city_id: number;
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: ProcObject | null;
  phones?: (ObjectPhone & {uiID: string})[];
  links?: (ObjectLink & {uiID: string})[];
  sections: ProcSection[];
  options?: ProcOption[];
  usages: EditObjectUsage[];
  photos?: EditObjectPhoto[];
  children?: DBObject[];
}

export interface EditObject extends Omit<ProcObject, "object_id"> {
  object_id?: ProcObject["object_id"] | null;
}