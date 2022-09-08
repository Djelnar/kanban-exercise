import React from "react";
import Modal from "react-modal";
import { RecoilRoot } from "recoil";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "App";
import "style/style.scss";
import { SplashScreen } from "ui/splash-screen";

const container = document.getElementById("root");
const root = createRoot(container!);

Modal.setAppElement(container!);

root.render(
  <RecoilRoot>
    <React.Suspense fallback={<SplashScreen>Loading</SplashScreen>}>
      <Router>
        <App />
      </Router>
    </React.Suspense>
  </RecoilRoot>
);
