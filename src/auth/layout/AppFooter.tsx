import React from "react";
import { APP_VERSION, APP_RELEASE_NAME } from "config/version";
import "./AppFooter.css";

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-content">
        <div className="app-footer-copyright">
          <span>&copy; {currentYear} </span>
          <span className="app-footer-department">
            Madhya Pradesh Textbook Corporation
          </span>
        </div>

        <div className="app-footer-credit">
          <span
            className="app-footer-version"
            title={`Project Release: ${APP_RELEASE_NAME}`}
          >
            {APP_VERSION}
          </span>
          <span className="app-footer-credit-short">
            Designed &amp; Developed :{" "}
          </span>
          <span className="app-footer-company">NICSI</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
