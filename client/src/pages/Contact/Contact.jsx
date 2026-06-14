import "./Contact.css";
import { EnvelopeOpen, PhoneCall, Buildings, MapPin } from "phosphor-react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <h1 className="contact-page-title">{t("contact.pageTitle")}</h1>

      <div className="contact-page-card">
        <div className="contact-page-item">
          <div className="contact-page-icon">
            <Buildings size={24} weight="duotone" />
          </div>
          <div>
            <span className="contact-page-label">{t("contact.company")}</span>
            <span className="contact-page-value">HomeSphere GmbH</span>
          </div>
        </div>

        <div className="contact-page-item">
          <div className="contact-page-icon">
            <MapPin size={24} weight="duotone" />
          </div>
          <div>
            <span className="contact-page-label">{t("contact.address")}</span>
            <span className="contact-page-value">
              Musterstraße 1, 10115 Berlin, Germany
            </span>
          </div>
        </div>

        <div className="contact-page-item">
          <div className="contact-page-icon">
            <EnvelopeOpen size={24} weight="duotone" />
          </div>
          <div>
            <span className="contact-page-label">{t("nav.email")}</span>
            <a
              className="contact-page-value contact-page-link"
              href="mailto:example@example.com"
            >
              example@example.com
            </a>
          </div>
        </div>

        <div className="contact-page-item">
          <div className="contact-page-icon">
            <PhoneCall size={24} weight="duotone" />
          </div>
          <div>
            <span className="contact-page-label">{t("nav.phone")}</span>
            <a
              className="contact-page-value contact-page-link"
              href="tel:+4930XXXXXXXX"
            >
              (+49) 030 XXXX XXXX
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
