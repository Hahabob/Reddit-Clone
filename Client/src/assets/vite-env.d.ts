/// <reference types="vite/client" />

declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
