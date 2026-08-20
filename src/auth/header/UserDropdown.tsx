import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { getAssetUrl } from "../../shared/utils/assetPath";
import "./UserDropdown.css";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.profile?.name || "User";

  function toggleDropdown() {
    setIsOpen((previousState) => !previousState);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    closeDropdown();
    logout();
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="wcd-user-dropdown">
      <button
        type="button"
        onClick={toggleDropdown}
        className="user-dropdown-toggle"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open user menu"
      >
        <div className="user-dropdown-avatar-wrapper">
          <div className="user-dropdown-avatar">
            <img
              src={getAssetUrl("images/user/owner.jpg")}
              alt={`${userName} profile`}
              className="user-dropdown-avatar-image"
            />
          </div>

          <span className="user-dropdown-online-status" />
        </div>

        <div className="user-dropdown-user-details">
          <span className="user-dropdown-user-name">{userName}</span>

          <span className="user-dropdown-user-role">
            {user?.profile?.role?.[0] || "User"}
          </span>
        </div>

        <i
          className={`pi ${
            isOpen ? "pi-angle-up" : "pi-angle-down"
          } user-dropdown-arrow`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="user-dropdown-menu" role="menu">
          <div className="user-dropdown-menu-content">
            <div className="user-dropdown-heading">Account Management</div>

            <ul className="user-dropdown-list">
              <li>
                <Link
                  to="/profile"
                  onClick={closeDropdown}
                  className="user-dropdown-item"
                  role="menuitem"
                >
                  <div className="user-dropdown-item-icon">
                    <i className="pi pi-user" aria-hidden="true" />
                  </div>

                  <div className="user-dropdown-item-content">
                    <span className="user-dropdown-item-title">Profile</span>

                    <span className="user-dropdown-item-description">
                      View &amp; Edit Profile
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <button
                  type="button"
                  className="user-dropdown-item user-dropdown-settings"
                  role="menuitem"
                >
                  <div className="user-dropdown-item-icon">
                    <i className="pi pi-cog" aria-hidden="true" />
                  </div>

                  <div className="user-dropdown-item-content">
                    <span className="user-dropdown-item-title">Settings</span>

                    <span className="user-dropdown-item-description">
                      Account Preferences
                    </span>
                  </div>
                </button>
              </li>
            </ul>

            <div className="user-dropdown-divider" />

            <button
              type="button"
              onClick={handleLogout}
              className="user-dropdown-logout"
              role="menuitem"
            >
              <div className="user-dropdown-logout-icon">
                <i className="pi pi-sign-out" aria-hidden="true" />
              </div>

              <div className="user-dropdown-item-content">
                <span className="user-dropdown-logout-title">Log Out</span>

                <span className="user-dropdown-logout-description">
                  End your session
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
