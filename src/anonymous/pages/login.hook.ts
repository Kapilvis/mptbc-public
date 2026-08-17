import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { useUserInfoStore } from "../../auth/reducer";
import { PubSubService } from "../../services";
import { useAppForm } from "../../shared/hooks/form";
import validation from "../../shared/utils/validation";

function generateCaptchaImage(code: string): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 40;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#E6F4EA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(5, 150, 105, ${0.2 + Math.random() * 0.35})`;
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    ctx.font = "bold 20px monospace";
    ctx.textBaseline = "middle";
    const startX = 15;
    const spacing = 16;
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = startX + i * spacing;
      const y = canvas.height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 16 - 8) * (Math.PI / 180);
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = i % 2 === 0 ? "#044E3B" : "#059669";
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
  }
  return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
}

const generateRandomCode = () => {
  if (import.meta.env.MODE !== "production") {
    return "000000";
  }
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

import { staticCredentials } from "../../auth/authConfig";

export function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { changeStateToSignedIn } = useUserInfoStore();

  const [isLoading, setIsLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaText, setCaptchaText] = useState("");

  /* ─── Unauthorized / Login Error State & Auto-Dismiss ─── */
  const [loginError, setLoginError] = useState<string | undefined>();
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    PubSubService.subscribe("@event/api-unauthorized", setLoginError);
    return () => {
      PubSubService.unsubscribe("@event/api-unauthorized", setLoginError);
    };
  }, []);

  useEffect(() => {
    if (loginError) {
      setIsHiding(false);
      const timer = setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => setLoginError(undefined), 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginError]);

  const handleCloseError = useCallback(() => {
    setIsHiding(true);
    setTimeout(() => setLoginError(undefined), 300);
  }, []);

  const { register, handleSubmit, reset, watch, setValue } =
    useAppForm<User.LoginForm>({
      resolver: validation.resolver(schema),
      defaultValues: {
        loginRole: "",
        captcha: "",
        userName: "",
        password: "",
      },
    });

  const selectedRole = watch("loginRole");

  useEffect(() => {
    if (selectedRole) {
      const matched = staticCredentials.find(
        (cred) => cred.role === selectedRole,
      );
      if (matched) {
        setValue("userName", matched.userId);
        setValue("password", matched.password);
      }
    } else {
      setValue("userName", "");
      setValue("password", "");
    }
  }, [selectedRole, setValue]);

  const regenerateCaptcha = useCallback(() => {
    const code = generateRandomCode();
    setCaptchaText(code);
    setCaptchaCode(generateCaptchaImage(code));
  }, []);

  useEffect(() => {
    regenerateCaptcha();
  }, [regenerateCaptcha]);

  const resetForm = useCallback(() => {
    reset({
      loginRole: "",
      userName: "",
      password: "",
      captcha: "",
    });
    regenerateCaptcha();
  }, [reset, regenerateCaptcha]);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    if (data.captcha?.toUpperCase() !== captchaText.toUpperCase()) {
      PubSubService.publish(
        "@event/api-unauthorized",
        "Invalid CAPTCHA code. Please try again.",
      );
      setIsLoading(false);
      regenerateCaptcha();
      return;
    }

    const matched = staticCredentials.find(
      (cred) =>
        cred.role === data.loginRole &&
        cred.userId?.trim() === data.userName?.trim() &&
        cred.password === data.password,
    );

    if (!matched) {
      PubSubService.publish(
        "@event/api-unauthorized",
        "Invalid User ID or Password.",
      );
      setIsLoading(false);
      regenerateCaptcha();
      return;
    }

    setTimeout(() => {
      login(matched.userId, matched.role, matched.roleName);
      changeStateToSignedIn({
        userName: matched.userId,
        fullName: matched.userId,
        roles: [matched.roleName],
      });
      setIsLoading(false);
      navigate("/home");
    }, 500);
  });

  return {
    register,
    handleSubmit: onSubmit,
    captchaCode,
    isLoading,
    regenerateCaptcha,
    loginError,
    isHiding,
    handleCloseError,
    resetForm,
  };
}

const schema = validation.create<User.LoginForm>((o) => ({
  loginRole: o.string().required().messages({
    "string.empty": "Please select Login User.",
    "any.required": "Please select Login User.",
  }),
  userName: o.string().required().messages({
    "string.empty": "Please enter User ID.",
    "any.required": "Please enter User ID.",
  }),
  password: o.string().required().messages({
    "string.empty": "Please enter Password.",
    "any.required": "Please enter Password.",
  }),
  captcha: o.string().required().max(6).messages({
    "string.empty": "Please enter CAPTCHA.",
    "any.required": "Please enter CAPTCHA.",
  }),
}));
