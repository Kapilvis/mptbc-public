import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Headphones,
  Layers,
  Printer,
  ShieldCheck,
  Truck,
  User,
  Users,
} from "lucide-react";
import React from "react";
import { Button } from "../../shared/components/buttons";
import { Captcha, PasswordBox, TextBox } from "../../shared/components/forms";
import "./Login.css";
import { useLoginForm } from "./login.hook";

/* ─── Background Decorations (Map, Dot Grid, Arcs) ─── */
const BackgroundDecorations: React.FC = () => (
  <div className="mptbc-bg-layer">
    <div className="mptbc-bg-tint" />
    <div className="mptbc-bg-map-container">
      <div className="mptbc-map-glow" />
      <img
        src="/mp_map_bg.png"
        alt="Madhya Pradesh District Boundary Map"
        className="mptbc-bg-map-img"
      />
    </div>
    <div className="mptbc-dot-grid-decor">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="1.5" fill="#008a45" />
        </pattern>
        <rect width="120" height="120" fill="url(#dot-grid)" />
      </svg>
    </div>
    <div className="mptbc-arc-lines-decor">
      <svg width="340" height="340" viewBox="0 0 340 340" fill="none">
        <circle
          cx="340"
          cy="0"
          r="120"
          stroke="#008a45"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle cx="340" cy="0" r="180" stroke="#008a45" strokeWidth="1.2" />
        <circle
          cx="340"
          cy="0"
          r="240"
          stroke="#008a45"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
        <circle cx="340" cy="0" r="300" stroke="#008a45" strokeWidth="1.2" />
      </svg>
    </div>
  </div>
);

/* ─── Portal Branding Header ─── */
const PortalBranding: React.FC = () => (
  <div className="mptbc-branding-container">
    <div className="mptbc-emblem-wrapper">
      <img
        src="/MP_LOGO.svg"
        alt="Government of Madhya Pradesh Seal"
        className="mptbc-emblem-img"
      />
    </div>
    <h1 className="mptbc-brand-title">
      Madhya Pradesh
      <br />
      Textbook Corporation
    </h1>
    <div className="mptbc-brand-sub">Government of Madhya Pradesh</div>
    <div className="mptbc-portal-tag-row">
      <div className="mptbc-portal-line" />
      <div className="mptbc-portal-dot" />
      <span className="mptbc-portal-text">Digital Operations Portal</span>
      <div className="mptbc-portal-dot" />
      <div className="mptbc-portal-line reverse" />
    </div>
  </div>
);

/* ─── Operational Workspaces Header Bar ─── */
const WORKSPACE_MODULES = [
  { id: "schools", label: "Schools", icon: GraduationCap, color: "#008a45" },
  { id: "paper", label: "Paper", icon: BookOpen, color: "#ea580c" },
  { id: "depot", label: "Depot", icon: Building2, color: "#2563eb" },
  { id: "printing", label: "Printing", icon: Printer, color: "#9333ea" },
  { id: "dispatch", label: "Dispatch", icon: Truck, color: "#4f46e5" },
];

const OperationalWorkspaces: React.FC = () => (
  <div className="mptbc-workspaces-wrapper">
    <div className="mptbc-workspaces-header">
      <div className="mptbc-workspaces-title-wrap">
        <Layers className="mptbc-workspaces-title-icon" />
        <span className="mptbc-workspaces-title">OPERATIONAL WORKSPACES</span>
      </div>
    </div>

    <div className="mptbc-workspaces-nav">
      {WORKSPACE_MODULES.map((mod) => {
        const Icon = mod.icon;
        return (
          <div
            key={mod.id}
            className="mptbc-workspace-tab"
            style={
              {
                "--mod-color": mod.color,
              } as React.CSSProperties
            }
          >
            <Icon className="mptbc-tab-icon" />
            <span className="mptbc-tab-label">{mod.label}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── Bottom Information Bar ─── */
const bottomFeatures = [
  {
    icon: ShieldCheck,
    title: "Secure Access",
    sub: "Enterprise-grade security",
  },
  {
    icon: Users,
    title: "Role-based Permissions",
    sub: "Access what you need",
  },
  {
    icon: ClipboardCheck,
    title: "Audited Activity",
    sub: "Track & monitor actions",
  },
  {
    icon: Headphones,
    title: "Help & Support",
    sub: "We're here to assist you",
  },
];

const BottomFeatureBar: React.FC = () => (
  <div className="mptbc-bottom-bar-container">
    <div className="mptbc-bottom-bar-card">
      <div className="mptbc-bottom-bar-grid">
        {bottomFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="mptbc-bottom-divider" />}
              <div className="mptbc-bottom-feature-item">
                <div className="mptbc-bottom-icon-wrap">
                  <Icon className="mptbc-bottom-icon-svg" />
                </div>
                <div className="mptbc-bottom-info-text">
                  <h4 className="mptbc-bottom-info-title">{feat.title}</h4>
                  <p className="mptbc-bottom-info-sub">{feat.sub}</p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
);

/* ─── Centered Login Card ─── */
interface LoginCardProps {
  onSubmit: (e: React.FormEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (name: any) => any;
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
    <div className="mptbc-login-card-container">
      <OperationalWorkspaces />

      <div className="mptbc-welcome-banner">
        <div className="mptbc-avatar-circle">
          <User className="mptbc-avatar-icon" />
        </div>
        <div className="mptbc-welcome-text-group">
          <h2 className="mptbc-welcome-heading">Welcome Back!</h2>
          <p className="mptbc-welcome-subtext">
            Sign in to access your authorized MPTBC workspace.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mptbc-form-body" noValidate>
        <TextBox
          placeholder="User ID / Employee ID"
          icon="user"
          {...register("userName")}
        />

        <PasswordBox
          placeholder="Password"
          icon="lock"
          {...register("password")}
        />

        <div className="captcha-field-wrapper">
          <Captcha
            label=""
            placeholder="CAPTCHA"
            captchaCode={captchaCode}
            onRegenerate={onRegenerateCaptcha}
            {...register("captcha")}
          />
        </div>

        <div className="mptbc-options-row">
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert(
                "Please contact your system administrator to reset your password.",
              );
            }}
            className="mptbc-forgot-link-btn"
          >
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          label={isLoading ? "Signing In..." : "Sign In Securely"}
          icon={isLoading ? undefined : "shield"}
          isLoading={isLoading}
          className="mptbc-btn-submit"
        />
      </form>
    </div>
  );
};

/* ─── Main Login Page Component ─── */
export default function LoginPage() {
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

  return (
    <div className="mptbc-login-viewport">
      <BackgroundDecorations />
      <PortalBranding />
      <LoginCard
        onSubmit={handleSubmit}
        register={register}
        captchaCode={captchaCode}
        onRegenerateCaptcha={regenerateCaptcha}
        isLoading={isLoading}
      />
      <BottomFeatureBar />

      {loginError && (
        <div
          className={`login-floating-error ${isHiding ? "hiding" : ""}`}
          role="alert"
        >
          <i className="pi pi-exclamation-triangle" aria-hidden="true" />
          <span>{loginError}</span>
          <button
            className="login-floating-error-close"
            type="button"
            onClick={handleCloseError}
            aria-label="Close error"
          >
            <i className="pi pi-times" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
