export interface KeyValuePair {
  [key: string]: string;
}

export interface Label extends KeyValuePair { }

export interface FormField {
  id: string;
  controlType:
  | "textbox"
  | "password"
  | "date"
  | "dropdown"
  | "checkbox"
  | "phone"
  | "photo"
  | "radio"
  | "textarea"
  | "fileupload";
  type?: "string" | "simpleType";
  labelName: Label;
  required?: boolean;
  validators?: Validator[];
  alignmentGroup?: string;
  cssClasses?: string[];
  placeholder?: Label;
  disabled?: boolean;
  info?: Label;
  capsLockCheck?: boolean;
  prefix?: string[];
  acceptedFileTypes?: string[];
  format?: string;
  minAge?: number;
  maxAge?: number;
  rows?: number;
  maxFileSizeMB?: number;
}

export interface AllowedValues {
  [key: string]:
  | {
    [key: string]: Label;
  }
  | string;
}

export interface SubmitButtonConfig {
  label: string;
  action: (data: FormData) => void;
}

export interface LanguageConfig {
  currentLanguage?: string;
  defaultLanguage?: string;
  showLanguageSwitcher?: boolean;
  languageSwitcherPosition?: "top" | "bottom";
  availableLanguages?: string[];
  rtlLanguages?: string[];
}

export interface ReCaptchaConfig {
  siteKey: string;
  enabled?: boolean;
  language?: string;
}

export interface AdditionalSchema {
  [id: string]: {
    label: Label;
    placeholder: Label;
  };
}

export interface AdditionalConfig {
  submitButton: SubmitButtonConfig;
  language?: LanguageConfig;
  recaptcha?: ReCaptchaConfig;
  additionalSchema?: AdditionalSchema;
}

export interface Errors {
  [key: string]: KeyValuePair;
}

export interface FormConfig {
  schema: FormField[];
  language: LanguageSettings;
  allowedValues?: AllowedValues;
  errors?: Errors;
  maxFileSizeMB?: number; // in mega bytes
  i18nValues?: {
    errors?: Errors;
    labels?: { [id: string]: Label };
    placeholders?: { [id: string]: Label };
  };
}

export interface FileUploadData {
  value: string | Blob; // Base64 encoded file content,
  docType: string; // e.g., "passport", "photo", coming from allowedValues
  format: string; // e.g., "image/jpeg"
  refId: string; // Unique identifier for the file, text field data
}

export type FormValue =
  | string
  | boolean
  | KeyValuePair
  | KeyValuePair[]
  | File
  | FileUploadData
  | undefined;

export interface FormData {
  [key: string]: FormValue;
}

export interface LanguageSettings {
  mandatory: string[];
  langCodeMap: KeyValuePair; // for languageMap builder
  optional?: string[];
}

export interface Validator {
  regex?: RegExp | string;
  error?: KeyValuePair;
  langCode?: string;
}

export interface FormState {
  schema: FormField[];
  allowedValues: AllowedValues;
  mandatoryLanguages: string[];
  optionalLanguages: string[];
  container: HTMLElement;
  formData: FormData;
  formElements: { [key: string]: HTMLElement | { [key: string]: HTMLElement } };
  submitLabel: string;
  submitAction: (data: FormData) => void;
  currentLanguage: string;
  defaultLanguage: string;
  showLanguageSwitcher: boolean;
  languageSwitcherPosition: "top" | "bottom";
  availableLanguages: string[];
  rtlLanguages: string[];
  isRTL: boolean;
  recaptcha?: ReCaptchaConfig;
  fallbackErrors: Errors;
  lastErrors?: Record<string, "required" | "mismatch" | number | null>;
  languageMap: KeyValuePair;
  additionalSchema?: AdditionalSchema;
  isSubmitting: boolean;
  maxFileSizeMB: number;
  labels: { [id: string]: Label };
  placeholders: { [id: string]: Label };
  isFormInitialized: boolean;
}
