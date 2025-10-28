import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { JsonFormBuilder } from "../JsonFormBuilder";

const defaultFormConfig = {
  schema: [
    {
      id: "individualId",
      controlType: "textbox",
      labelName: {
        eng: "Individual ID",
        fra: "ID Individuel",
        ara: "معرف الفرد",
      },
      placeholder: {
        eng: "Enter Individual ID",
        fra: "Entrez l'identifiant individuel",
        ara: "أدخل معرف الفرد",
      },
      required: true,
      alignmentGroup: "groupA",
    },
    {
      id: "fullName",
      controlType: "textbox",
      type: "simpleType",
      capsLockCheck: true,
      labelName: {
        eng: "Full Name",
        fra: "Nom Complet",
        ara: "الاسم الكامل",
      },
      placeholder: {
        eng: "Enter Full Name",
        fra: "Entrez le nom complet",
        ara: "أدخل الاسم الكامل",
      },
      validators: [
        {
          regex: "^[a-zA-Z][a-zA-Z ]{1,30}$",
          error: {
            eng: "Full Name must be in English letters only",
            fra: "Le nom complet doit être uniquement en lettres anglaises",
            ara: "يجب أن يكون الاسم الكامل بأحرف إنجليزية فقط",
          },
          langCode: "eng",
        },
      ],
      required: true,
      alignmentGroup: "groupB",
    },
    {
      id: "dob",
      controlType: "date",
      labelName: {
        eng: "Date of Birth",
        fra: "Date de Naissance",
        ara: "تاريخ الميلاد",
      },
      placeholder: {
        eng: "Enter Date of Birth",
        fra: "Entrez la date de naissance",
        ara: "أدخل تاريخ الميلاد",
      },
      required: true,
      alignmentGroup: "groupC",
    },
    {
      id: "phone",
      controlType: "phone",
      labelName: {
        eng: "Phone Number",
        fra: "Numéro de Téléphone",
        ara: "رقم الهاتف",
      },
      placeholder: {
        eng: "Enter Phone Number",
        fra: "Entrez le numéro de téléphone",
        ara: "أدخل رقم الهاتف",
      },
      prefix: ["+91"],
      required: true,
      alignmentGroup: "groupD",
    },
    {
      id: "password",
      controlType: "password",
      capsLockCheck: true,
      labelName: {
        eng: "Password",
        fra: "Mot de Passe",
        ara: "كلمة المرور",
      },
      placeholder: {
        eng: "Enter your password",
        fra: "Entrez votre mot de passe",
        ara: "أدخل كلمة المرور الخاصة بك",
      },
      info: {
        eng: "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char.",
        fra: "Doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.",
        ara: "يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير واحد، حرف صغير واحد، رقم واحد، ورمز خاص واحد.",
      },
      validators: [
        {
          regex:
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$",
          error: {
            eng: "Password must have 8+ chars, one uppercase, one lowercase, one number, and one special character.",
            fra: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
            ara: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وحرف كبير واحد، وحرف صغير واحد، ورقم واحد، ورمز خاص واحد.",
          },
          langCode: "eng",
        },
      ],
      required: true,
      alignmentGroup: "groupE",
    },
    {
      id: "gender",
      controlType: "dropdown",
      labelName: {
        eng: "Gender",
        fra: "Sexe",
        ara: "الجنس",
      },
      options: [
        { value: "male", labelName: { eng: "Male", fra: "Homme", ara: "ذكر" } },
        {
          value: "female",
          labelName: { eng: "Female", fra: "Femme", ara: "أنثى" },
        },
      ],
      placeholder: {
        eng: "Select Gender",
        fra: "Sélectionnez le sexe",
        ara: "اختر الجنس",
      },
      required: true,
      alignmentGroup: "groupG",
    },
    {
      id: "consent",
      controlType: "checkbox",
      labelName: {
        eng: "I agree to <b><a target='_blank' href='https://www.example.com/'>Terms & Conditions</a></b> and <b><a href='https://www.example.com/'>Privacy Policy</a></b>.",
        fra: "J'accepte les <b><a target='_blank' href='https://www.example.com/'>Conditions Générales</a></b> et la <b><a href='https://www.example.com/'>Politique de Confidentialité</a></b>.",
        ara: "أوافق على <b><a target='_blank' href='https://www.example.com/'>الشروط والأحكام</a></b> و<b><a href='https://www.example.com/'>سياسة الخصوصية</a></b>.",
      },
      required: true,
      alignmentGroup: "groupH",
    },
  ],
  allowedValues: {
    gender: {
      MLE: {
        eng: "Male",
        fra: "Mâle",
        ara: "ذكر",
      },
      FLE: {
        eng: "Female",
        fra: "Femelle",
        ara: "أنثى",
      },
    },
  },
  errors: {
    required: {
      eng: "This field is required",
      fra: "Ce champ est obligatoire",
      ara: "هذا الحقل مطلوب",
    },
    passwordMismatch: {
      eng: "Passwords do not match",
      fra: "Les mots de passe ne correspondent pas",
      ara: "كلمات المرور غير متطابقة",
    },
    capsLock: {
      eng: "Caps Lock is on",
      fra: "Le verrouillage des majuscules est activé",
      ara: "مفتاح الحروف الكبيرة قيد التشغيل",
    },
  },
  language: {
    mandatory: ["eng"],
    optional: ["fra", "ara"],
    langCodeMap: {
      eng: "en",
      fra: "fr",
      ara: "ar",
    },
  },
};

const availableLanguages =
  defaultFormConfig?.language?.mandatory?.concat(
    defaultFormConfig?.language?.optional || []
  ) || [];

const JsonFormBuilderWrapper: React.FC<any> = () => <div />;

export default {
  title: "Javascript/JsonFormBuilder",
  component: JsonFormBuilderWrapper,
  argTypes: {
    formConfig: {
      name: "Form Config",
      description: "Schema configuration used to render the form fields.",
      control: "object",
    },
    submitButtonLabel: {
      name: "Submit Button Label",
      description: "Text displayed on the form’s submit button.",
      control: "text",
    },
    currentLanguage: {
      name: "Current Language",
      description: "Sets the default language for the form.",
      control: "select",
      options: availableLanguages,
    },
    showLanguageSwitcher: {
      name: "Show Language Switcher",
      description: "Toggle visibility of the language selector dropdown.",
      control: "boolean",
    },
    submitAction: {
      name: "Submit Action",
      description: "Action triggered when the form is submitted successfully.",
      control: false,
    },
  },
} as Meta<typeof JsonFormBuilderWrapper>;

type Story = StoryObj<typeof JsonFormBuilder>;

export const JsonFormBuilderExample: Story = {
  args: {
    formConfig: defaultFormConfig,
    submitButtonLabel: "Submit",
    currentLanguage: "eng",
    showLanguageSwitcher: true,
    submitAction: action("Form submitted"),
  },
  render: ({
    formConfig,
    submitButtonLabel,
    submitAction,
    currentLanguage,
    showLanguageSwitcher,
  }: any) => {
    const [localConfig, setLocalConfig] = useState(formConfig);
    const [key, setKey] = useState(0);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      try {
        const newConfig = JSON.parse(JSON.stringify(formConfig));
        if (JSON.stringify(newConfig) !== JSON.stringify(localConfig)) {
          setLocalConfig(newConfig);
          setKey((prev) => prev + 1);
        }
      } catch (e) {
        console.warn("Invalid JSON config in Storybook controls");
      }
    }, [formConfig]);

    useEffect(() => {
      const container = document.getElementById("formContainer");
      if (container) container.innerHTML = "";
      setSuccess(false);

      if (!localConfig?.schema) return;

      const additionalConfig = {
        submitButton: {
          label: submitButtonLabel,
          action: (formData: any) => {
            const button =
              document.querySelector("button[type='submit']") ||
              document.querySelector("button");
            submitAction(formData);
            setSuccess(true);
            setTimeout(() => {
              const successElement = document.getElementById("successMessage");
              if (successElement) {
                const topPosition =
                  successElement.getBoundingClientRect().top +
                  window.scrollY -
                  50;
                window.scrollTo({ top: topPosition, behavior: "smooth" });
              }
            }, 100);
            if (button) button.textContent = submitButtonLabel;

            setTimeout(() => {
              setSuccess(false);
            }, 3000);
          },
        },
        language: {
          currentLanguage,
          defaultLanguage: "eng",
          showLanguageSwitcher,
          availableLanguages: availableLanguages,
        },
      };

      const form = JsonFormBuilder(
        localConfig,
        "formContainer",
        additionalConfig
      );
      form.render();

      const style = document.createElement("style");
      style.innerHTML = `
        * { box-sizing: border-box; font-family: 'Roboto', sans-serif; }

        label {
          display: block;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        a {
          color: #1262C9;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        input, select {
          width: max-content;
          padding: 10px 12px;
          margin: 6px 0 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s;
        }

        .language-switcher select {
          width: max-content;
          margin: 1em 0;
        }

        select:hover, input[type="date"]:hover {
          cursor: pointer;
        }

        .password-eye-icon {
          top: 0.75em;
        }

        input:focus, select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
        }

        input.input-error {
          border-color: #fe6b6b;
        }

        .phone-div-display hr {
          display: none;
        }

        .error-message {
          color: #fe6b6b;
          font-size: 12px;
          margin-top: -8px;
          margin-bottom: 10px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .info-detail.active {
          position: absolute;
          top: 1em;
        }

        button {
          width: 100%;
          background-color: #1262C9;
          color: #fff;
          padding: 0.75rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;

          svg {
            display: none;
          }
        }

        .required {
          color: #fe6b6b;
          margin-left: 2px;
        }

        .info-icon {
          width: 14px;
          height: 14px;
        }

        .input_box {
          &.error {
            border-color: #fe6b6b;
            border-width: 1.75px;
          }

          &:focus {
            border-color: #80bdff;
            outline: 0;
          }
        }

        button:hover {
          background-color: #1262C9;
          color: white;
        }

        .success-message {
          background-color: #e6ffed;
          color: #107c41;
          padding: 10px;
          margin-top: 16px;
          border-radius: 5px;
          text-align: center;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid #b2f5bf;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (style.parentNode) style.parentNode.removeChild(style);
      };
    }, [
      key,
      submitButtonLabel,
      submitAction,
      currentLanguage,
      showLanguageSwitcher,
    ]);

    return (
      <div
        style={{
          padding: "20px",
          margin: "auto",
          borderRadius: "5px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px",
          maxWidth: "425px",
          border: "1px solid rgba(38, 85, 115, 0.15)",
        }}
      >
        {success && (
          <div
            id="successMessage"
            className="success-message"
            style={{ margin: "1em auto" }}
          >
            Form submitted successfully!
          </div>
        )}
        <div key={key} id="formContainer" />
      </div>
    );
  },
};
