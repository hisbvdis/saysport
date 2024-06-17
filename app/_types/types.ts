import { city, object as object_, object_link, object_on_option, object_on_section, object_phone, object_photo, object_schedule, option, section, section_on_spec, spec } from "@prisma/client";

// =============================================================================
// DB TYPES
// =============================================================================
export interface DBSpec extends spec {
  options: option[]
}

export interface DBSection extends section {
  specs: (section_on_spec & { spec: DBSpec })[];
}

export interface DBObject extends object_ {
  statusInstead: object_ | null;
  city: city | null;
  parent: object_ | null;
  phones: object_phone[];
  links: object_link[];
  sections: (object_on_section & {section: section & {specs: (section_on_spec & {spec: spec & {options: option[]}})[]}})[];
  options: (object_on_option & {option: option})[];
  schedule: object_schedule[];
  photos: object_photo[];
}

// =============================================================================
// UI TYPES
// =============================================================================
export interface UIOption extends option {
  uiID: string;
}

export interface UISpec extends spec {
  options?: UIOption[];
  uiID: string;
};

export interface UISection extends section {
  specs: UISpec[];
  uiID: string;
}

export interface UIObject extends Partial<object_> {
  city?: city | null;
  phones?: (object_phone & {uiID: string})[];
  links?: (object_link & {uiID: string})[];
  sections?: UISection[];
  options?: UIOption[];
  schedule: (object_schedule & {uiID: string, isWork: boolean})[];
  photos?: (object_photo & {uiID: string, blob?: string})[];
  [key: string]: any;
}

export enum UIContactTypeEnum {
  PHONES = "phones",
  LINKS = "links"
}