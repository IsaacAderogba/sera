import React from "react";
import ReactDOM from "react-dom/client";
import { MainApp } from "./MainApp";

const Router: React.FC = () => {
  switch (window.location.pathname) {
    default:
      return <MainApp />;
  }
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router />
);
