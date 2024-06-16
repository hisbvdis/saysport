import { option, section, section_on_spec, spec } from "@prisma/client";

// =============================================================================
// Database
// =============================================================================
export interface DBSpec extends spec {
  options: option[]
}

export interface DBSection extends section {
  specs: (section_on_spec & { spec: DBSpec })[];
}

// =============================================================================
// UI
// =============================================================================
export interface UIOption extends Omit<option, "id"|"spec_id"> {
  id?: number;
  spec_id?:number;
  uiID: string;
}

export interface UISpec extends Omit<spec, "id"> {
  id?: number;
  options?: UIOption[];
  uiID: string;
};

export interface UISection extends Omit<section, "id"> {
  id?: number;
  specs?: UISpec[];
  uiID: string;
}