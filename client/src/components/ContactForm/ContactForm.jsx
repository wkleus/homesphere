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

const steps = ["name", "contact", "message", "confirm", "success"];

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

const ContactForm = ({ onClose }) => {
  const [step, setStep] = useState("name");
  const [direction, setDirection] = useState("forward");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const modalRoot = document.getElementById("modal-root");

  // Optional: enable dark mode while modal is open
  // useEffect(() => {
  //   document.body.classList.add("dark");
  //   return () => document.body.classList.remove("dark");
  // }, []);

  // ESC closes modal
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
    const nextIndex = steps.indexOf(step) + 1;
    setStep(steps[nextIndex]);
  };

  const back = () => {
    setDirection("backward");
    const prevIndex = steps.indexOf(step) - 1;
    if (prevIndex >= 0) setStep(steps[prevIndex]);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const progress = (steps.indexOf(step) / (steps.length - 1)) * 100;

  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="modal-layout">
          {/* Left illustration panel */}
          <div className="modal-illustration">
            <HouseLine size={48} weight="duotone" className="house-outline" />
            <h3>Contact the Agent</h3>
            <p className="modal-note">
              Share your details and message, and we’ll connect you with the
              agent.
            </p>
          </div>

          {/* Right content */}
          <div className="modal-content">
            {step !== "success" && (
              <>
                {/* Progress bar */}
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            <div className={`step-content slide-${direction} content`}>
              {/* Step 1: Name */}
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
                  <button className="send-btn" onClick={next}>
                    Next
                  </button>
                </>
              )}

              {/* Step 2: Contact */}
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
                    <button className="back-btn" onClick={back}>
                      Back
                    </button>
                    <button className="send-btn" onClick={next}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Message */}
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
                    <button className="back-btn" onClick={back}>
                      Back
                    </button>
                    <button className="send-btn" onClick={next}>
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Step 4: Confirm */}
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

                  <div className="wizard-buttons">
                    <button className="back-btn" onClick={back}>
                      Back
                    </button>
                    <button className="send-btn" onClick={next}>
                      Send
                    </button>
                  </div>
                </>
              )}

              {/* Step 5: Success */}
              {step === "success" && (
                <div className="success-screen">
                  <h2>Message Sent!</h2>
                  <p>The agent will contact you shortly.</p>
                  <button className="send-btn" onClick={onClose}>
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
