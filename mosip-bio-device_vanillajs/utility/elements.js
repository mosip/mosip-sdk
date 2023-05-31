const attributeExceptions = [
  `role`,
  `dataset`,
  `d`,
  `r`,
  `cx`,
  `cy`,
  `width`,
  `height`,
  `viewBox`,
  `fill`,
];

const customExceptions = [
  `autocorrect`,
  `tabindex`,
  `aria-autocomplete`,
  `aria-expanded`,
  `aria-haspopup`,
  `aria-label`,
  `aria-hidden`,
  `data-deviceid`,
  `data-value`,
  `focusable`,
  `name`,
];

const styleVarExceptions = [
  "--mbd-dropdown__option_panelbg_normal",
  "--mbd-dropdown__option_panelbg_hover",
  "--mbd-dropdown__option_panelbg_selected",
  "--mbd-dropdown__control_bordercolor_normal",
  "--mbd-dropdown__control_bordercolor_hover",
  "--mbd-dropdown__control_bordercolor_selected",
];

const SVG_NAMESPACE = `http://www.w3.org/2000/svg`;

const appendText = (el, text) => {
  const textNode = document.createTextNode(text);
  el.appendChild(textNode);
};

const appendArray = (el, children) => {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      appendArray(el, child);
    } else if (child instanceof window.Element) {
      el.appendChild(child);
    } else if (typeof child === `string` || typeof child === `number`) {
      appendText(el, child);
    }
  });
};

const setStyles = (el, styles) => {
  if (!styles) {
    el.removeAttribute(`styles`);
    return;
  }

  Object.keys(styles).forEach((styleName) => {
    if (styleName in el.style) {
      el.style[styleName] = styles[styleName]; // eslint-disable-line no-param-reassign
    } else if (styleVarExceptions.includes(styleName)) {
      // setting css variable for custom styling
      el.style.setProperty(styleName, styles[styleName]);
    } else {
      console.warn(
        `${styleName} is not a valid style for a <${el.tagName.toLowerCase()}>`
      );
    }
  });
};

const setDataAttributes = (el, dataAttributes) => {
  Object.keys(dataAttributes).forEach((dataAttribute) => {
    // jsdom doesn't support element.dataset, so set them as named attributes
    el.setAttribute(`data-${dataAttribute}`, dataAttributes[dataAttribute]);
  });
};

const isSvg = (type) => [`path`, `svg`, `circle`].includes(type);

const makeElement = (type, textOrPropsOrChild, ...otherChildren) => {
  const el = isSvg(type)
    ? document.createElementNS(SVG_NAMESPACE, type)
    : document.createElement(type);

  if (Array.isArray(textOrPropsOrChild)) {
    appendArray(el, textOrPropsOrChild);
  } else if (textOrPropsOrChild instanceof window.Element) {
    el.appendChild(textOrPropsOrChild);
  } else if (
    typeof textOrPropsOrChild === `string` ||
    typeof textOrPropsOrChild === `number`
  ) {
    appendText(el, textOrPropsOrChild);
  } else if (typeof textOrPropsOrChild === `object`) {
    Object.keys(textOrPropsOrChild).forEach((propName) => {
      if (
        propName in el ||
        attributeExceptions.includes(propName) ||
        customExceptions.includes(propName)
      ) {
        const value = textOrPropsOrChild[propName];

        if (propName === `style`) {
          setStyles(el, value);
        } else if (propName === `dataset`) {
          setDataAttributes(el, value);
        } else if (isSvg(type) && propName === `className`) {
          el.className.baseVal = value; // for adding class in svg
        } else if (typeof value === `function` || propName === `className`) {
          el[propName] = value; // e.g. onclick
        } else if (value) {
          el.setAttribute(propName, value); // need this for SVG elements
        }
      } else {
        console.warn(`${propName} is not a valid property of a <${type}>`);
      }
    });
  }

  if (otherChildren) appendArray(el, otherChildren);

  return el;
};

const a = (...args) => makeElement(`a`, ...args);
const button = (...args) => makeElement(`button`, ...args);
const div = (...args) => makeElement(`div`, ...args);
const h1 = (...args) => makeElement(`h1`, ...args);
const h2 = (...args) => makeElement(`h2`, ...args);
const header = (...args) => makeElement(`header`, ...args);
const p = (...args) => makeElement(`p`, ...args);
const i = (...args) => makeElement(`i`, ...args);
const span = (...args) => makeElement(`span`, ...args);
const ul = (...args) => makeElement(`ul`, ...args);
const li = (...args) => makeElement(`li`, ...args);
const svg = (...args) => makeElement(`svg`, ...args);
const path = (...args) => makeElement(`path`, ...args);
const circle = (...args) => makeElement(`circle`, ...args);
const input = (...args) => makeElement(`input`, ...args);
const label = (...args) => makeElement(`label`, ...args);
const img = (...args) => makeElement(`img`, ...args);

export {
  a,
  button,
  div,
  h1,
  h2,
  header,
  p,
  i,
  span,
  ul,
  li,
  svg,
  path,
  circle,
  input,
  label,
  img,
  appendArray,
};
