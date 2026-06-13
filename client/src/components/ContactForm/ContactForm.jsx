import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  EnvelopeSimple,
  ChatCircleText,
  CheckCircle,
  HouseLine,
} from "phosphor-react";
import * as Yup from "yup";
import "./ContactForm.css";
import { CONTACT_URL } from "../../config/api";
import { useTranslation } from "react-i18next";

const steps = ["name", "contact", "message", "confirm", "success"];

const ContactForm = ({ onClose, address }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState("name");
  const [direction, setDirection] = useState("forward");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // Yup validation schemas per step
  const schemas = {
    name: Yup.object({
      fullName: Yup.string()
        .min(2, "Name is too short")
        .required("Name is required"),
    }),
    contact: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    message: Yup.object({
      message: Yup.string()
        .min(10, "Message is too short")
        .required("Message is required"),
    }),
  };

  // Render modal into #modal-root to escape stacking context
  const modalRoot = document.getElementById("modal-root");

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validateStep = async () => {
    if (!schemas[step]) return true;
    try {
      await schemas[step].validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const formatted = {};
      err.inner.forEach((e) => {
        formatted[e.path] = e.message;
      });
      setErrors(formatted);
      return false;
    }
  };

  const next = async () => {
    const valid = await validateStep();
    if (!valid) return;
    setDirection("forward");
    setStep(steps[steps.indexOf(step) + 1]);
  };

  const back = () => {
    setDirection("backward");
    setStep(steps[steps.indexOf(step) - 1]);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Send form data to backend – triggers email via Resend
  const handleSend = async () => {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          message: formData.message,
          property: address,
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setDirection("forward");
      setStep("success");
    } catch {
      setSendError(t("contact.error"));
    } finally {
      setSending(false);
    }
  };

  const progress = (steps.indexOf(step) / (steps.length - 1)) * 100;

  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="modal-layout">
          <div className="modal-illustration">
            <HouseLine size={48} weight="duotone" className="house-outline" />
            <h3>{t("contact.title")}</h3>
            <p className="modal-note">{t("contact.note")}</p>
          </div>

          <div className="modal-content">
            {step !== "success" && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className={`step-content slide-${direction} content`}>
              {step === "name" && (
                <>
                  <h2 className="step-title">
                    <User size={26} weight="duotone" /> {t("contact.name")}
                  </h2>
                  <input
                    name="fullName"
                    placeholder={t("contact.fullName")}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <p className="error">{errors.fullName}</p>
                  )}
                  <button type="button" className="send-btn" onClick={next}>
                    {t("contact.next")}
                  </button>
                </>
              )}

              {step === "contact" && (
                <>
                  <h2 className="step-title">
                    <EnvelopeSimple size={30} weight="duotone" />{" "}
                    {t("contact.contactStep")}
                  </h2>
                  <input
                    name="email"
                    placeholder={t("contact.email")}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                  <div className="wizard-buttons">
                    <button type="button" className="back-btn" onClick={back}>
                      {t("contact.back")}
                    </button>
                    <button type="button" className="send-btn" onClick={next}>
                      {t("contact.next")}
                    </button>
                  </div>
                </>
              )}

              {step === "message" && (
                <>
                  <h2 className="step-title">
                    <ChatCircleText size={26} weight="duotone" />{" "}
                    {t("contact.message")}
                  </h2>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder={t("contact.messagePlaceholder")}
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {errors.message && <p className="error">{errors.message}</p>}
                  <div className="wizard-buttons">
                    <button type="button" className="back-btn" onClick={back}>
                      {t("contact.back")}
                    </button>
                    <button type="button" className="send-btn" onClick={next}>
                      {t("contact.next")}
                    </button>
                  </div>
                </>
              )}

              {step === "confirm" && (
                <>
                  <h2 className="step-title">
                    <CheckCircle size={26} weight="duotone" />{" "}
                    {t("contact.confirm")}
                  </h2>
                  <p>
                    <strong>Name:</strong> {formData.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Message:</strong> {formData.message}
                  </p>
                  {sendError && <p className="error">{sendError}</p>}
                  <div className="wizard-buttons">
                    <button
                      type="button"
                      className="back-btn"
                      onClick={back}
                      disabled={sending}
                    >
                      {t("contact.back")}
                    </button>
                    <button
                      type="button"
                      className="send-btn"
                      onClick={handleSend}
                      disabled={sending}
                    >
                      {sending ? t("contact.sending") : t("contact.send")}
                    </button>
                  </div>
                </>
              )}

              {step === "success" && (
                <div className="success-screen">
                  <h2 className="checked">
                    {t("contact.success")}{" "}
                    <CheckCircle size={30} weight="duotone" />
                  </h2>
                  <p>{t("contact.successMsg")}</p>
                  <button type="button" className="send-btn" onClick={onClose}>
                    {t("contact.close")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default ContactForm;
