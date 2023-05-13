interface Error {
  errorCode?: string;
  errorMsg?: string;
}

interface customStyle {
  outerDivStyle?: React.CSSProperties;
  logoDivStyle?: React.CSSProperties;
  logoImgStyle?: React.CSSProperties;
  labelSpanStyle?: React.CSSProperties;
}

interface styleClasses {
  outerDivClasses: string;
  logoDivClasses: string;
  logoImgClasses: string;
  labelSpanClasses: string;
}

export { Error, customStyle, styleClasses };
