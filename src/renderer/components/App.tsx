import * as React from "react";

export const App = () => (
  <div>
    Current version: <span>{window.location.hash.substring(1)}</span>
  </div>
);
