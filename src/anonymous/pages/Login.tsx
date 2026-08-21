import React from "react";
import { Navigate } from "react-router-dom";
import { Sparkles, Headphones, HelpCircle } from "lucide-react";
import { useAuth } from "../../auth/AuthProvider";
import { ROLE_OPTIONS, getRoleDashboardRoute } from "../../auth/authConfig";
import { Button } from "../../shared/components/buttons";
import {
  DropDownList,
  Captcha,
  PasswordBox,
  TextBox,
} from "../../shared/components/forms";
import { getAssetUrl } from "../../shared/utils/assetPath";
import "./Login.css";
import { useLoginForm } from "./login.hook";

/* ─── Login Form Component ─── */
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
    <div className="mptbc-light-card">
      {/* Floating Emblem Logo: Half Inside, Half Outside */}
      <div className="mptbc-card-floating-logo-wrapper">
        <img
          src={getAssetUrl("/logo.png")}
          alt="MPTBC Official Seal"
          className="mptbc-card-floating-logo"
        />
      </div>

      {/* Top Header Title */}
      <div className="mptbc-card-header">
        <div className="mptbc-card-header-text">
          <h2 className="mptbc-login-title">पोर्टल में प्रवेश करें</h2>
          <p className="mptbc-login-subtitle">
            अधिकृत यूजर आईडी व पासवर्ड दर्ज करें
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mptbc-form-grid" noValidate>
        <div className="mptbc-input-field-group">
          <DropDownList
            label="उपयोगकर्ता वर्ग / Select Section"
            placeholder="Select Section"
            data={ROLE_OPTIONS}
            filter={false}
            required
            optionValue="value"
            {...register("loginRole")}
          />
        </div>

        <div className="mptbc-input-field-group">
          <TextBox
            label="उपयोगकर्ता नाम"
            placeholder="उपयोगकर्ता नाम / User ID"
            icon="user"
            required
            {...register("userName")}
          />
        </div>

        <div className="mptbc-input-field-group">
          <PasswordBox
            label="पासवर्ड"
            placeholder="पासवर्ड दर्ज करें"
            icon="lock"
            required
            {...register("password")}
          />
        </div>

        <div className="captcha-field-wrapper mptbc-input-field-group">
          <Captcha
            label="सुरक्षा कैप्चा"
            placeholder="कैप्चा कोड दर्ज करें"
            captchaCode={captchaCode}
            onRegenerate={onRegenerateCaptcha}
            required
            {...register("captcha")}
          />
        </div>

        <div className="mptbc-action-area">
          <Button
            type="submit"
            label={isLoading ? "प्रमाणित हो रहा है..." : "लॉगिन करें"}
            icon={isLoading ? undefined : "sign-in"}
            isLoading={isLoading}
            className="mptbc-primary-submit-btn"
          />
        </div>

        <div className="mptbc-footer-links">
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert(
                "पासवर्ड रीसेट करने के लिए कृपया अपने सिस्टम प्रशासक से संपर्क करें।\nहेल्पलाइन: support@mptbc.gov.in",
              );
            }}
            className="mptbc-forgot-link"
          >
            <HelpCircle className="mptbc-link-icon" />
            पासवर्ड भूल गए?
          </a>
        </div>
      </form>
    </div>
  );
};

/* ─── Main Redesigned Light Mode Login Page ─── */
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
    <div
      className="mptbc-light-page-wrapper"
      style={{ backgroundImage: `url(${getAssetUrl("/login_bgg.jpg")})` }}
    >
      {/* Top Banner Navigation Bar */}
      <header className="mptbc-light-nav-header">
        <div className="mptbc-nav-brand">
          <img
            src={getAssetUrl("/MP_LOGO.svg")}
            alt="MP State Emblem"
            className="mptbc-nav-logo"
          />
          <div className="mptbc-nav-titles">
            <h1 className="mptbc-nav-main-title">
              मध्य प्रदेश पाठ्यपुस्तक निगम
            </h1>
            <p className="mptbc-nav-sub-title">
              Madhya Pradesh Textbook Corporation
            </p>
          </div>
        </div>

        <div className="mptbc-nav-help-pill">
          <Headphones className="mptbc-help-icon" />
          <div className="mptbc-help-text">
            <span className="mptbc-help-lbl">तकनीकी सहायता:</span>
            <span className="mptbc-help-val">1800-233-5555</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Viewport Area */}
      <main className="mptbc-light-main-content">
        {/* LEFT COLUMN: Hero Section */}
        <section className="mptbc-light-hero-section">
          {/* Tagline Pill */}
          <div className="mptbc-light-tagline-chip">
            <Sparkles className="mptbc-sparkle-icon" />
            <span>डिजिटल गवर्नेंस व एकीकृत प्रबंधन पोर्टल</span>
          </div>

          <h2 className="mptbc-light-hero-heading">
            <span className="mptbc-heading-blue">
              गुणवत्तापूर्ण पाठ्यपुस्तकें,
            </span>
            <br />
            <span className="mptbc-heading-green">बेहतर शिक्षा की नींव</span>
          </h2>

          <div className="mptbc-accent-divider-bar" />

          <p className="mptbc-light-hero-subheading">
            मध्य प्रदेश के विद्यार्थियों तक गुणवत्तापूर्ण, विश्वसनीय और समय पर
            पाठ्य सामग्री पहुंचाने की प्रतिबद्धता
          </p>
        </section>

        {/* RIGHT COLUMN: Elevated Light Login Card */}
        <section className="mptbc-light-login-section">
          <LoginCard
            onSubmit={handleSubmit}
            register={register}
            captchaCode={captchaCode}
            onRegenerateCaptcha={regenerateCaptcha}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* Footer Rights Banner */}
      <footer className="mptbc-light-page-footer">
        <div className="mptbc-footer-left">
          <span>
            © {new Date().getFullYear()} मध्य प्रदेश पाठ्यपुस्तक निगम.
            सर्वाधिकार सुरक्षित।
          </span>
        </div>
        <div className="mptbc-footer-right">
          <span>स्कूल शिक्षा विभाग, मध्य प्रदेश शासन</span>
        </div>
      </footer>

      {/* Floating Error Toast */}
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
