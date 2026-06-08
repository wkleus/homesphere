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

const steps = ["name", "contact", "message", "confirm", "success"];

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

const ContactForm = ({ onClose, address }) => {
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
      setSendError("Something went wrong. Please try again.");
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
            <h3>Contact the Agent</h3>
            <p className="modal-note">
              Share your details and message, and we'll connect you with the
              agent.
            </p>
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
                    <User size={26} weight="duotone" /> Your Name
                  </h2>
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && (
                    <p className="error">{errors.fullName}</p>
                  )}
                  <button type="button" className="send-btn" onClick={next}>
                    Next
                  </button>
                </>
              )}

              {step === "contact" && (
                <>
                  <h2 className="step-title">
                    <EnvelopeSimple size={30} weight="duotone" /> Your Contact
                  </h2>
                  <input
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                  <div className="wizard-buttons">
                    <button type="button" className="back-btn" onClick={back}>
                      Back
                    </button>
                    <button type="button" className="send-btn" onClick={next}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === "message" && (
                <>
                  <h2 className="step-title">
                    <ChatCircleText size={26} weight="duotone" /> Your Message
                  </h2>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {errors.message && <p className="error">{errors.message}</p>}
                  <div className="wizard-buttons">
                    <button type="button" className="back-btn" onClick={back}>
                      Back
                    </button>
                    <button type="button" className="send-btn" onClick={next}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {step === "confirm" && (
                <>
                  <h2 className="step-title">
                    <CheckCircle size={26} weight="duotone" /> Confirm Details
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
                      Back
                    </button>
                    <button
                      type="button"
                      className="send-btn"
                      onClick={handleSend}
                      disabled={sending}
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </>
              )}

              {step === "success" && (
                <div className="success-screen">
                  <h2 className="checked">
                    Message Sent! <CheckCircle size={30} weight="duotone" />
                  </h2>
                  <p>The agent will contact you shortly.</p>
                  <button type="button" className="send-btn" onClick={onClose}>
                    Close
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
