import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [latestUpdate, setLatestUpdate] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLatestUpdate(new Date());
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const formattedLatestUpdate = latestUpdate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="dashboard">
      <section className="dashboard-heading-row">
        <div className="dashboard-heading-content">
          <h1>
            {t(
              "home.welcome_portal",
              "Welcome to Madhya Pradesh Textbook Corporation Portal",
            )}
          </h1>
          <p>
            {t(
              "home.sub_header",
              "Overview of key statistics and recent activities",
            )}
          </p>
        </div>

        <div
          className="dashboard-date-filter"
          aria-label={`Latest update: ${formattedLatestUpdate}`}
        >
          <i className="pi pi-clock" />
          <span>
            Latest Update: <span>{formattedLatestUpdate}</span>
          </span>
        </div>
      </section>

      <section className="mt-6 p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm text-center">
        <div className="mx-auto h-16 w-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary">
          <i className="pi pi-th-large text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Madhya Pradesh Textbook Corporation
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
          Welcome to the portal dashboard. Select a module from the sidebar menu
          to get started.
        </p>
      </section>
    </div>
  );
};

export default Home;
