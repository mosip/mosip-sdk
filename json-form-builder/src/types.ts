export interface Label {
  [key: string]: string;
}

export interface FormField {
  id: string;
  controlType: "textbox" | "password" | "date" | "dropdown" | "checkbox";
  type?: "string" | "simpleType";
  label: Label;
  required?: boolean;
  validators?: Validator[];
  alignmentGroup?: string;
  cssClasses?: string[];
  placeholder?: Label;
  disabled?: boolean;
  info?: Label;
  capsLock?: Label;
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
  [key: string]: { [language: string]: string };
}

export interface FormConfig {
  schema: FormField[];
  language: LanguageSettings;
  allowedValues?: AllowedValues;
  errors?: Errors;
}

export interface FormData {
  [key: string]: string | { [key: string]: string } | undefined;
}

export interface LanguageSettings {
  mandatory: string[];
  langCodeMap: { [key: string]: string }; // for languageMap builder
  optional?: string[];
}

export interface Validator {
  regex?: RegExp | string;
  error?: {
    [lang: string]: string;
  };
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
  lastErrors?: Record<string, "required" | number | null>;
  languageMap: { [key: string]: string };
  additionalSchema?: AdditionalSchema;
  isSubmitting: boolean;
}
