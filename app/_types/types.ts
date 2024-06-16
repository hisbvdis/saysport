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