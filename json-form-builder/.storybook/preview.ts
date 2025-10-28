export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
};

// Inject global Storybook Docs styling
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    /* 📏 Make Control column wider */
    table.docblock-argstable th:nth-child(4),
    table.docblock-argstable td:nth-child(4) {
      width: 320px !important;
    }

    table.docblock-argstable th:nth-child(3),
    table.docblock-argstable td:nth-child(3) {
      width: max-content !important;
      text-align: center;
      color: #666;
    }
  `;
  document.head.appendChild(style);
}
