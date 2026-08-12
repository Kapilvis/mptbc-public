import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageDropdown.css";
import languages from "./languages.json";

export const LanguageDropdown = () => {
  const menuRef = useRef<Menu>(null);
  const { i18n } = useTranslation();

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const menuItems: MenuItem[] = languages.map((lang) => ({
    label: lang.label,
    command: async () => {
      await i18n.changeLanguage(lang.code);
      localStorage.setItem("user-language", lang.code);
    },
    template: (_, options) => {
      const isActive = i18n.language === lang.code;
      return (
        <div
          className={`lang-dropdown-item ${isActive ? "active" : ""}`}
          onClick={(e) => {
            options.onClick(e);
          }}
        >
          <span className="lang-flag">{lang.flag}</span>
          {lang.label}
        </div>
      );
    },
  }));

  return (
    <div className="wcd-language-dropdown">
      <Menu
        model={menuItems}
        popup
        ref={menuRef}
        id="language_dropdown_menu"
        className="wcd-lang-menu"
      />
      <button
        className="lang-toggle-btn"
        onClick={(e) => menuRef.current?.toggle(e)}
        aria-controls="language_dropdown_menu"
        aria-haspopup
      >
        <span className="lang-flag">{currentLang?.flag}</span>
        <span>{currentLang?.label}</span>
      </button>
    </div>
  );
};

export default LanguageDropdown;
