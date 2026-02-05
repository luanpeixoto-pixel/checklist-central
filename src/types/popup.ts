export interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "rating" | "email" | "number";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  min?: number; // For rating, number
  max?: number; // For rating, number
}

export interface FormSchema {
  fields: FormField[];
  submitButtonText?: string;
}

export interface PopupDefinition {
  id: string;
  name: string;
  title: string;
  description?: string;
  form_schema: FormSchema;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PopupTrigger {
  id: string;
  popup_id: string;
  trigger_type: "event_count" | "page_view" | "time_on_page" | "scroll_depth";
  conditions: TriggerConditions;
  priority: number;
  max_displays: number | null;
  cooldown_hours: number | null;
  delay_seconds: number | null;
  pages: string[] | null;
  trigger_event_name: string | null;
  is_active: boolean;
  created_at: string;
}

export type TriggerConditions = 
  | EventCountCondition 
  | PageViewCondition 
  | TimeOnPageCondition 
  | ScrollDepthCondition;

export interface EventCountCondition {
  event_type: string;
  event_name?: string;
  count: number;
}

export interface PageViewCondition {
  page_path?: string;
  page_count: number;
}

export interface TimeOnPageCondition {
  page_path?: string;
  time_seconds: number;
}

export interface ScrollDepthCondition {
  page_path?: string;
  depth_percent: number;
}

export interface PopupWithTrigger {
  popup: PopupDefinition;
  trigger: PopupTrigger;
}
