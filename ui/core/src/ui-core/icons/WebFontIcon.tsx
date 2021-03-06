/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Icon */

import * as React from "react";
import * as classnames from "classnames";
import "./WebFontIcon.scss";
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";

/** Properties for the [[WebFontIcon]] React component */
export interface WebFontIconProps {
  /** Bentley Web Font icon name */
  iconName: string;
  /** CSS class name */
  className?: string;
  /** CSS style properties */
  style?: React.CSSProperties;
  /** Click event handler */
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  /** Text that will be shown when hovered on the icon. */
  title?: string;
  /** Size of the icon */
  iconSize?: "small" | "medium" | "large" | "x-large";
}

/** WebFontIcon React component */
// tslint:disable-next-line:variable-name
export const WebFontIcon: React.FunctionComponent<WebFontIconProps> = (props) => {
  const className = classnames(
    "bui-webfont-icon",
    props.iconName,
    props.iconSize ? `core-icon-${props.iconSize}` : undefined,
    props.className,
  );

  return (
    <span
      className={className}
      title={props.title}
      style={props.style}
      onClick={props.onClick}
    />
  );
};
