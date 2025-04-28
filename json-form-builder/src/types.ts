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
  type?: 'simpleType';
  label: Label;
  required?: boolean;
  validators?: Validator[];
  cssClasses?: string[];
  alignmentGroup?: string;
}

export interface AllowedValues {
  [key: string]: {
    [key: string]: Label;
  };
}

export interface RecaptchaConfig {
  siteKey: string;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  position?: 'before' | 'after';
  enabled?: boolean;
}

export interface SubmitButtonConfig {
  label: string;
  action: (data: FormData) => void;
}

export interface LanguageConfig {
  currentLanguage: string;
  defaultLanguage: string;
  showLanguageSwitcher?: boolean;
  languageSwitcherPosition?: 'top' | 'bottom';
  availableLanguages?: string[];
  rtlLanguages?: string[];
}

export interface AdditionalConfig {
  submitButton: SubmitButtonConfig;
  recaptcha?: RecaptchaConfig;
  language?: LanguageConfig;
}

export interface FormConfig {
  schema: FormField[];
  allowedValues?: AllowedValues;
  mandatoryLanguages?: string[];
  optionalLanguages?: string[];
}

export interface FormData {
  [key: string]: string | { [key: string]: string } | undefined;
  recaptchaToken?: string;
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
  recaptcha?: RecaptchaConfig;
  currentLanguage: string;
  defaultLanguage: string;
  showLanguageSwitcher: boolean;
  languageSwitcherPosition: 'top' | 'bottom';
  availableLanguages: string[];
  rtlLanguages: string[];
  isRTL: boolean;
} 