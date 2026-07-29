import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HouseLine } from "phosphor-react";
import { useTranslation } from "react-i18next";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      className="not-found-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <HouseLine size={80} weight="thin" className="not-found-icon" />
      <h1 className="not-found-code">404</h1>
      <p className="not-found-message">{t("notFound.message")}</p>
      <button onClick={() => navigate("/")}>{t("notFound.backHome")}</button>
    </motion.div>
  );
};

export default NotFound;
