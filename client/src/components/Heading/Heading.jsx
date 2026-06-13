import "./Heading.css";
import { useTranslation } from "react-i18next";

const Heading = ({ available }) => {
  const { t } = useTranslation();

  return (
    <div className="heading">
      <p className="heading-eyebrow">{t("heading.eyebrow")}</p>
      <h1 className="heading-title">
        {t("heading.title")}
        <br />
        <em>{t("heading.subtitle")}</em>
      </h1>
      <p className="heading-sub">{t("heading.sub")}</p>
      <div className="heading-line">
        <span className="heading-badge">
          {available !== null
            ? t("heading.available", { count: available })
            : ""}
        </span>
      </div>
    </div>
  );
};

export default Heading;
