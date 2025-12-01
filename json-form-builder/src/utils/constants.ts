const ControlType = {
  TEXTBOX: "textbox",
  TEXTAREA: "textarea",
  PASSWORD: "password",
  DATE: "date",
  DROPDOWN: "dropdown",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  PHONE: "phone",
  PHOTO: "photo",
  FILE: "fileupload",
};

const InputType = {
  STRING: "string",
  SIMPLE_TYPE: "simpleType",
};

const CameraErrorCodes = {
  PERMISSION_DENIED: "permissionDenied",
  NOT_ACCESSIBLE: "notAccessible",
  CAMERA_NOT_FOUND: "cameraNotFound",
  NOT_READABLE: "NotReadableError"
};

export { ControlType, InputType, CameraErrorCodes };
