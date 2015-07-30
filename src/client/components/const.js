import React from "react";

export const FONT_FAMILY = "'Helvetica Neue', sans-serif";

export const NUMBER_OR_STRING = React.PropTypes.oneOfType([
  React.PropTypes.number,
  React.PropTypes.string
]);
