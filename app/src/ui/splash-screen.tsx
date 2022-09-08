import React, { PropsWithChildren } from "react";
import "./style.css";

export function SplashScreen(props: PropsWithChildren) {
  return <div className="splashScreen">{props.children}</div>;
}
