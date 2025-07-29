const validResponseTypes: string[] = ["code"];
const validDisplays: string[] = ["page", "popup", "touch", "wap"];
const validPrompt: string[] = ["none", "login", "consent", "select_account"];

const defaultThemes = {
  outline: "outline",
  filledOrange: "filled_orange",
  filledBlack: "filled_black",
  custom: "custom",
};

const defaultShapes = {
  sharpEdges: "sharp_edges",
  softEdges: "soft_edges",
  roundedEdges: "rounded_edges",
};

const buttonTypes = {
  standard: "standard",
  icon: "icon",
};

const errorMessage = {
  requestUriTimeout: "Request timed out while fetching Request URI. Please try again later.",
  requestUriFailed: "Failed to get Request URI. Please try again later.",
  clientIdMissing: "Client ID missing.",
  generic: "An unexpected error occurred. Please try again.",
  dpopFailed: "DPoP callback failed. Please try again."
};

const defaultButtonLabel = "Sign in with e-Signet";

export {
  validResponseTypes,
  validDisplays,
  validPrompt,
  defaultThemes,
  defaultShapes,
  buttonTypes,
  defaultButtonLabel,
  errorMessage
};
