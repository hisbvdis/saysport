import type { Category, CategoryOnSection, City, Object_, ObjectLink, ObjectOnOption, ObjectOnSection, ObjectOnUsage, ObjectPhone, ObjectPhoto, ObjectSchedule, objectStatusUnion, objectTypeUnion, Option, Section, SectionOnSpec, SectionOnUsage, Spec, Usage } from "@/drizzle/schema";


// =============================================================================
// OPTION
// =============================================================================
export interface ProccessedDBOption extends Option {
  uiID: string;
}


// =============================================================================
// SPEC
// =============================================================================
export interface DBSpec extends Spec {
  options: Option[];
}

export interface ProcessedDBSpec extends Spec {
  options: ProccessedDBOption[];
  uiID: string;
};

export interface UISpec extends Omit<ProcessedDBSpec, "spec_id"> {
  spec_id: ProcessedDBSpec["spec_id"] | null;
};


// =============================================================================
// SECTION
// =============================================================================
export interface DBSection extends Section {
  sectionOnSpecs?: (SectionOnSpec & {spec: DBSpec})[];
  sectionOnUsages?: (SectionOnUsage & {usage: Usage})[];
}

export interface ProcessedDBSection extends Section {
  specs: ProcessedDBSpec[];
  usages: (SectionOnUsage & Usage)[];
  uiID: string;
}

export interface UISection extends Omit<ProcessedDBSection, "section_id"> {
  section_id: ProcessedDBSection["section_id"] | null;
}


// =============================================================================
// CATEGORY
// =============================================================================
export interface DBCategory extends Category {
  categoryOnSections?: (CategoryOnSection & {section: Section})[];
}

export interface ProcessedDBCategory extends Category {
  sections: Section[];
}

export interface UICategory extends Omit<ProcessedDBCategory, "category_id"> {
  category_id: ProcessedDBCategory["category_id"] | null;
}


// =============================================================================
// CATEGORY
// =============================================================================
export interface DBCategory extends Category {
  categoryOnSections?: (CategoryOnSection & {section: Section})[];
}

export interface ProcessedDBCategory extends Category {
  sections: Section[];
}

export interface UICategory extends Omit<ProcessedDBCategory, "category_id"> {
  category_id: ProcessedDBCategory["category_id"] | null;
}


// =============================================================================
// USAGE
// =============================================================================
export interface UIUsage extends Omit<Usage, "usage_id"> {
  usage_id: Usage["usage_id"] | null;
}


// =============================================================================
// OBJECT SCHEDULE
// =============================================================================
export interface ProcessedObjectSchedule extends ObjectSchedule {
  uiID: string;
}

interface UIObjectSchedule extends Omit<ProcessedObjectSchedule, "object_on_usage_id"|"object_id"|"schedule_id"> {
  object_id: ProcessedObjectSchedule["object_id"] | null;
  object_on_usage_id: ProcessedObjectSchedule["object_on_usage_id"] | null;
  schedule_id: ProcessedObjectSchedule["schedule_id"] | null;
}


// =============================================================================
// OBJECT USAGE
// =============================================================================
export interface ProcessedObjectUsage extends ObjectOnUsage, Usage {
  uiID: string;
  schedules: ProcessedObjectSchedule[];
}

export interface UIObjectUsage extends Omit<ProcessedObjectUsage, "object_on_usage_id"|"object_id"|"schedules"> {
  object_id: ProcessedObjectUsage["object_id"] | null;
  object_on_usage_id: ProcessedObjectUsage["object_on_usage_id"] | null;
  uiID: string;
  schedules: UIObjectSchedule[];
}


// =============================================================================
// PHOTO
// =============================================================================
interface UIObjectPhoto extends Omit<ObjectPhoto, "object_id" | "photo_id"> {
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

export interface ProcessedDBObject extends Partial<Object_> {
  name_type: string;
  coord_lat: number;
  coord_lon: number;
  city_id: number;
  type: objectTypeUnion;
  status: objectStatusUnion;
  statusInstead?: Object_ | null;
  city?: City;
  parent?: ProcessedDBObject | null;
  phones?: (ObjectPhone & {uiID: string})[];
  links?: (ObjectLink & {uiID: string})[];
  sections: ProcessedDBSection[];
  options?: ProccessedDBOption[];
  usages: ProcessedObjectUsage[];
  photos?: UIObjectPhoto[];
  children?: DBObject[];
}

export interface UIObject extends Omit<ProcessedDBObject, "object_id"|"usages"> {
  object_id?: ProcessedDBObject["object_id"] | null;
  usages: UIObjectUsage[];
}