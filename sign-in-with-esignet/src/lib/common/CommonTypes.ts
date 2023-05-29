// interface customStyle {
//   outerDivStyle?: React.CSSProperties;
//   logoDivStyle?: React.CSSProperties;
//   logoImgStyle?: React.CSSProperties;
//   labelSpanStyle?: React.CSSProperties;
// }

interface customStyle {
  outerDivStyle?: { [key: string]: string };
  logoDivStyle?: { [key: string]: string };
  logoImgStyle?: { [key: string]: string };
  labelSpanStyle?: { [key: string]: string };
}

interface styleClasses {
  outerDivClasses: string;
  logoDivClasses: string;
  logoImgClasses: string;
  labelSpanClasses: string;
}

export { customStyle, styleClasses };
