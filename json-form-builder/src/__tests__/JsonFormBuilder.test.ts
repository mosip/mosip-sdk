/// <reference types="jest" />
import '@testing-library/jest-dom';
import { JsonFormBuilder } from '../JsonFormBuilder';
import { FormConfig, AdditionalConfig } from '../types';

describe('JsonFormBuilder', () => {
  let container: HTMLElement;
  let config: FormConfig;
  let additionalConfig: AdditionalConfig;

  beforeEach(() => {
    // Create a container for each test
    container = document.createElement('div');
    container.id = 'form-container';
    document.body.appendChild(container);

    // Basic form configuration
    config = {
      schema: [
        {
          id: 'name',
          controlType: 'textbox',
          type: 'simpleType',
          labelName: {
            eng: 'Name',
            fra: 'Nom',
            ara: 'الاسم'
          },
          required: true,
          validators: [
            {
              regex: /^[a-zA-Z ]+$/,
              error: {
                'eng': 'Only letters and spaces allowed'
              },
              langCode: 'eng'
            }
          ]
        },
        {
          id: 'email',
          controlType: 'textbox',
          type: 'simpleType' as const,
          labelName: {
            eng: 'Email',
            fra: 'Courriel',
            ara: 'البريد الإلكتروني'
          },
          required: true,
          validators: [
            {
              regex: /^[^@]+@[^@]+\\.[^@]+$/,
              error: {
                'eng': 'Invalid email format'
              }
            }
          ]
        }
      ],
      resetPasswordChallengeFields: ["name", "email"],
      language: {
        mandatory: ["eng"],
        optional: ['fra', 'ara'],
        langCodeMap: {
          eng: 'en',
          fra: 'fr',
          ara: 'ar'
        }
      }
    };

    additionalConfig = {
      submitButton: {
        label: 'Submit',
        action: jest.fn()
      },
      language: {
        currentLanguage: 'eng',
        defaultLanguage: 'eng',
        showLanguageSwitcher: true,
        languageSwitcherPosition: 'top',
        availableLanguages: ['eng', 'fra', 'ara'],
        rtlLanguages: ['ara', 'ar', 'he', 'fa', 'ur']
      }
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create a form with the correct structure', async () => {
      const formBuilder = JsonFormBuilder(config, 'form-container', additionalConfig);
      await formBuilder.render();

      expect(container.querySelector('form')).toBeTruthy();
      expect(container.querySelector('.language-switcher')).toBeTruthy();

      // Check for form field groups (one per field)
      const fieldGroups = container.querySelectorAll('.form-field-group');
      expect(fieldGroups).toHaveLength(2);

      // Check for language inputs in the first field group (name)
      const nameFieldGroup = fieldGroups[0];
      expect(nameFieldGroup.querySelectorAll('.form-field.lang-eng')).toHaveLength(1);
      expect(nameFieldGroup.querySelectorAll('.form-field.lang-fra')).toHaveLength(1);
      expect(nameFieldGroup.querySelectorAll('.form-field.lang-ara')).toHaveLength(1);
    });

    it('should initialize with the correct language', async () => {
      const formBuilder = JsonFormBuilder(config, 'form-container', additionalConfig);
      await formBuilder.render();

      const fieldGroups = container.querySelectorAll('.form-field-group');
      const nameLabel = fieldGroups[0]?.querySelector('label');
      expect(nameLabel?.textContent).toContain('Name');
    });
  });

  describe('Language Switching', () => {
    it('should update labels when language is changed', async () => {
      const formBuilder = JsonFormBuilder(config, 'form-container', additionalConfig);
      await formBuilder.render();

      formBuilder.updateLanguage('fra', 'login');
      const fieldGroups = container.querySelectorAll('.form-field-group');
      const nameLabel = fieldGroups[0]?.querySelector('label');
      expect(nameLabel?.textContent).toContain('Nom');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const formBuilder = JsonFormBuilder(config, 'form-container', additionalConfig);
      await formBuilder.render();

      const form = container.querySelector('form');
      form?.dispatchEvent(new Event('submit'));

      const errorMessages = container.querySelectorAll('.error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('should validate regex patterns', async () => {
      const formBuilder = JsonFormBuilder(config, 'form-container', additionalConfig);
      await formBuilder.render();

      const nameInput = container.querySelector('input[data-lang="eng"][data-field-id="name"]') as HTMLInputElement;
      nameInput.value = '123';
      nameInput.dispatchEvent(new Event('input'));

      const errorMessage = nameInput.parentElement?.querySelector('.error-message');
      expect(errorMessage?.textContent).toContain('Only letters and spaces allowed');
    });
  });
}); 