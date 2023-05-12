const validResponseTypes: string[] = ["code"];
const validDisplays: string[] = ["page", "popup", "touch", "wap"];
const validPrompt: string[] = ["none", "login", "consent", "select_account"];

const defaultThemes = {
  outline: "outline",
  filledOrange: "filled_orange",
  filledBlack: "filled_black",
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

export {
  validResponseTypes,
  validDisplays,
  validPrompt,
  defaultThemes,
  defaultShapes,
  buttonTypes
};
