import "./Contact.css";
import { EnvelopeOpen, PhoneCall, Buildings, MapPin } from "phosphor-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  // Stagger animation for contact items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="contact-page">
      {/* Animated background with gradient */}
      <div className="contact-bg">
        <motion.div
          className="contact-bg-gradient"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Contact card with spring animation */}
      <motion.div
        className="contact-card"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 4,
          type: "spring",
          bounce: 0.6,
          delay: 0.5,
          ease: "easeInOut",
        }}
      >
        <div className="contact-header">
          <div className="contact-logo">
            <Buildings size={28} weight="fill" />
          </div>
          <span className="contact-title">
            Home<strong>Sphere</strong>
          </span>
          <p className="contact-subtitle">{t("contact.pageTitle")}</p>
        </div>

        <motion.div
          className="contact-items"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="contact-item" variants={itemVariants}>
            <div className="contact-icon">
              <Buildings size={24} weight="duotone" />
            </div>
            <div>
              <span className="contact-label">{t("contact.company")}</span>
              <span className="contact-value">HomeSphere GmbH</span>
            </div>
          </motion.div>

          <motion.div className="contact-item" variants={itemVariants}>
            <div className="contact-icon">
              <MapPin size={24} weight="duotone" />
            </div>
            <div>
              <span className="contact-label">{t("contact.address")}</span>
              <span className="contact-value">
                Musterstraße 1, 10115 Berlin, Germany
              </span>
            </div>
          </motion.div>

          <motion.div className="contact-item" variants={itemVariants}>
            <div className="contact-icon">
              <EnvelopeOpen size={24} weight="duotone" />
            </div>
            <div>
              <span className="contact-label">{t("nav.email")}</span>
              <a
                className="contact-value contact-link"
                href="mailto:example@example.com"
              >
                example@example.com
              </a>
            </div>
          </motion.div>

          <motion.div className="contact-item" variants={itemVariants}>
            <div className="contact-icon">
              <PhoneCall size={24} weight="duotone" />
            </div>
            <div>
              <span className="contact-label">{t("nav.phone")}</span>
              <a
                className="contact-value contact-link"
                href="tel:+4930XXXXXXXX"
              >
                (+49) 030 XXX XXX
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
