export interface Label {
  [key: string]: string;
}

export interface Validator {
  type: 'regex';
  validator: string;
  errorCode: string;
  langCode?: string;
}

export interface FormField {
  id: string;
  controlType: 'textbox' | 'password' | 'date' | 'dropdown';
  type?: 'string' | 'simpleType';
  label: Label;
  required?: boolean;
  validators?: Validator[];
  alignmentGroup?: string;
  cssClasses?: string[];
}

export interface AllowedValues {
  [key: string]: {
    [key: string]: Label;
  };
}

export interface SubmitButtonConfig {
  label: string;
  action: (data: FormData) => void;
}

export interface LanguageConfig {
  currentLanguage?: string;
  defaultLanguage?: string;
  showLanguageSwitcher?: boolean;
  languageSwitcherPosition?: 'top' | 'bottom';
  availableLanguages?: string[];
  rtlLanguages?: string[];
}

export interface ReCaptchaConfig {
  siteKey: string;
  enabled?: boolean;
  language?: string;
}

export interface AdditionalConfig {
  submitButton: SubmitButtonConfig;
  language?: LanguageConfig;
  recaptcha?: ReCaptchaConfig;
}

export interface Errors {
  [key: string]: { [language: string]: string };
}

export interface FormConfig {
  schema: FormField[];
  allowedValues?: AllowedValues;
  errors?: Errors
  language: LanguageSettings;
}

export interface FormData {
  [key: string]: string | { [key: string]: string } | undefined;
}

export interface LanguageSettings {
  mandatory?: string[];
  optional?: string[];
  langCodeMap?: { [key: string]: string }; // for languageMap builder
}

export interface Validator {
  regex?: RegExp;
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
  languageSwitcherPosition: 'top' | 'bottom';
  availableLanguages: string[];
  rtlLanguages: string[];
  isRTL: boolean;
  recaptcha?: ReCaptchaConfig;
  fallbackErrors: Errors;
  lastErrors?: Record<string, 'required' | number | null>;
  languageMap: { [key: string]: string }
} 