import React from "react";
import ReactDOM from "react-dom/client";
import { MainApp } from "./MainApp";
import { MenubarApp } from "./MenubarApp";

const Router: React.FC = () => {
  switch (window.location.pathname) {
    case "/menubar":
      return <MenubarApp />;
    default:
      return <MainApp />;
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router />
);
