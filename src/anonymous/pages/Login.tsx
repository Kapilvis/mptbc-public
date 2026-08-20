import React from "react";
import { Navigate } from "react-router-dom";
import { BookOpen, Award, Bus, Users } from "lucide-react";
import { useAuth } from "../../auth/AuthProvider";
import { ROLE_OPTIONS } from "../../auth/authConfig";
import { Button } from "../../shared/components/buttons";
import {
  DropDownList,
  Captcha,
  PasswordBox,
  TextBox,
} from "../../shared/components/forms";
import "./Login.css";
import { useLoginForm } from "./login.hook";
import MpDivisionMap from "./components/MpDivisionMap";
import { getAssetUrl } from "../../shared/utils/assetPath";

/* ─── Bottom 4 Feature Cards Data ─── */
const FEATURE_ITEMS = [
  {
    icon: BookOpen,
    title: "गुणवत्तापूर्ण पाठ्यपुस्तक",
    sub: "उच्चतम मानक",
  },
  {
    icon: Award,
    title: "समय पर वितरण",
    sub: "हमारी प्राथमिकता",
  },
  {
    icon: Bus,
    title: "डिपो नेटवर्क",
    sub: "56 जिले",
  },
  {
    icon: Users,
    title: "शिक्षा के लिए समर्पित",
    sub: "हमारा संकल्प",
  },
];

/* ─── Functional Component-Based Login Card ─── */
interface LoginCardProps {
  onSubmit: (e: React.FormEvent) => void;
  register: (name: keyof User.LoginForm) => {
    control: import("react-hook-form").Control<User.LoginForm>;
    name: keyof User.LoginForm;
    setValue: import("react-hook-form").UseFormSetValue<User.LoginForm>;
  };
  captchaCode: string;
  onRegenerateCaptcha: () => void;
  isLoading: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  register,
  captchaCode,
  onRegenerateCaptcha,
  isLoading,
}) => {
  return (
    <div className="mptbc-login-card">
      {/* Emblem Circle Badge */}
      <div className="mptbc-emblem-badge">
        <BookOpen className="mptbc-emblem-icon" />
      </div>

      <h2 className="mptbc-login-heading">स्वागत है!</h2>
      <p className="mptbc-login-subheading">MPTBC पोर्टल में लॉगिन करें</p>

      <form onSubmit={onSubmit} className="mptbc-form-body" noValidate>
        <DropDownList
          label="उपयोगकर्ता वर्ग / Select Section"
          placeholder="Select Section"
          data={ROLE_OPTIONS}
          filter={false}
          required
          optionValue="value"
          {...register("loginRole")}
        />

        <TextBox
          label="उपयोगकर्ता नाम"
          placeholder="उपयोगकर्ता नाम / User ID"
          icon="user"
          required
          {...register("userName")}
        />

        <PasswordBox
          label="पासवर्ड"
          placeholder="पासवर्ड"
          icon="lock"
          required
          {...register("password")}
        />

        <div className="captcha-field-wrapper">
          <Captcha
            label="कैप्चा"
            placeholder="कैप्चा दर्ज करें"
            captchaCode={captchaCode}
            onRegenerate={onRegenerateCaptcha}
            required
            {...register("captcha")}
          />
        </div>

        <div className="mptbc-buttons-row">
          <Button
            type="submit"
            label={isLoading ? "प्रारंभ हो रहा है..." : "लॉगिन करें"}
            icon={isLoading ? undefined : "lock"}
            isLoading={isLoading}
            className="mptbc-btn-submit"
          />
        </div>

        <div className="mptbc-options-row">
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert(
                "पासवर्ड रीसेट करने के लिए कृपया अपने सिस्टम प्रशासक से संपर्क करें।",
              );
            }}
            className="mptbc-forgot-link-btn"
          >
            पासवर्ड भूल गए?
          </a>
        </div>
      </form>
    </div>
  );
};

import { getRoleDashboardRoute } from "../../auth/authConfig";

/* ─── Main Login Page Component ─── */
export default function LoginPage() {
  const { authenticated, user } = useAuth();
  const {
    register,
    handleSubmit,
    captchaCode,
    regenerateCaptcha,
    isLoading,
    loginError,
    isHiding,
    handleCloseError,
  } = useLoginForm();

  if (authenticated) {
    const role = user?.role || localStorage.getItem("role") || "";
    return <Navigate to={getRoleDashboardRoute(role)} replace />;
  }

  return (
    <div className="mptbc-split-viewport">
      {/* ─────────────────────────────────────────────────────────────
          LEFT COLUMN (60% width): Logo Header, Map Component, Features
      ─────────────────────────────────────────────────────────────── */}
      <div className="mptbc-left-column">
        {/* Top Header Row */}
        <header className="mptbc-top-header">
          <div className="mptbc-brand-group">
            <img
              src={getAssetUrl("MP_LOGO.svg")}
              alt="MPTBC Emblem Logo"
              className="mptbc-brand-logo-large"
            />
            <div className="mptbc-brand-text">
              <h1 className="mptbc-main-title-large">MPTBC</h1>
              <h2 className="mptbc-sub-title-hi-large">
                मध्य प्रदेश पाठ्यपुस्तक निगम
              </h2>
              <p className="mptbc-sub-title-en-large">
                Madhya Pradesh Textbook Corporation
              </p>
            </div>
          </div>

          {/* Slogan Section */}
          <div className="mptbc-slogan-wrapper">
            <div className="mptbc-tagline-group-large">
              <div className="mptbc-tagline-divider-large">
                <span className="mptbc-tagline-line" />
                <span className="mptbc-tagline-main-large">
                  शिक्षा से सशक्त भविष्य
                </span>
                <span className="mptbc-tagline-line" />
              </div>
              <div className="mptbc-tagline-sub-large">
                हमारा संकल्प, गुणवत्तापूर्ण पाठ्यपुस्तक
              </div>
            </div>
          </div>
        </header>

        {/* Separated Modular MP Division Map Component */}
        <MpDivisionMap />

        {/* Enhanced Bottom Feature Bar in Theme */}
        <div className="mptbc-features-row-enhanced">
          {FEATURE_ITEMS.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="mptbc-feature-card-enhanced">
                <div className="mptbc-feature-icon-wrapper-enhanced">
                  <IconComp className="mptbc-feature-icon-enhanced" />
                </div>
                <div className="mptbc-feature-text-enhanced">
                  <span className="mptbc-feature-title-enhanced">
                    {item.title}
                  </span>
                  <span className="mptbc-feature-sub-enhanced">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT COLUMN (40% width): Floating White Login Card
      ─────────────────────────────────────────────────────────────── */}
      <div className="mptbc-right-column">
        <LoginCard
          onSubmit={handleSubmit}
          register={register}
          captchaCode={captchaCode}
          onRegenerateCaptcha={regenerateCaptcha}
          isLoading={isLoading}
        />

        {/* Bottom Vector Skyline Graphic */}
        <div className="mptbc-skyline-decoration">
          <svg
            viewBox="0 0 500 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 80V65H15V80H0ZM20 80V45H35V80H20ZM40 80V55H55V80H40ZM60 80V35L72 25L84 35V80H60ZM90 80V50H105V80H90ZM110 80V60H125V80H110ZM130 80V40H145V80H130ZM150 80V20L165 10L180 20V80H150ZM185 80V55H200V80H185ZM205 80V45H220V80H205ZM225 80V30L240 18L255 30V80H225ZM260 80V50H275V80H260ZM280 80V62H295V80H280ZM300 80V38H315V80H300ZM320 80V22L335 12L350 22V80H320ZM355 80V55H370V80H355ZM375 80V42H390V80H375ZM395 80V32L410 20L425 32V80H395ZM430 80V60H445V80H430ZM450 80V48H465V80H450ZM470 80V35H485V80H470ZM490 80V68H500V80H490Z"
              fill="#94a3b8"
              fillOpacity="0.2"
            />
          </svg>
        </div>
      </div>

      {/* Floating Error Notification Toast */}
      {loginError && (
        <div
          className={`mptbc-floating-error ${isHiding ? "hiding" : ""}`}
          role="alert"
        >
          <span>{loginError}</span>
          <button
            className="mptbc-floating-error-close"
            type="button"
            onClick={handleCloseError}
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
