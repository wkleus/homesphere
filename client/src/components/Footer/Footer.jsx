import { ClockAfternoon } from "phosphor-react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const businessStart = 8;
  const businessEnd = 18;
  const curDay = new Date().getDay();
  const curTime = new Date().getHours();

  const storeIsOpen =
    curDay > 0 &&
    curDay < 6 &&
    curTime >= businessStart &&
    curTime < businessEnd;

  const openStatus = storeIsOpen ? (
    <div>
      <div className="note">
        <ClockAfternoon className="clock-icon open" />
        <span className="note open">{t("footer.openNote")}</span>
      </div>
      <div>
        {t("footer.contact")}{" "}
        <a className="email" href="mailto:example@example.com">
          example@example.com
        </a>
      </div>
    </div>
  ) : (
    <div>
      <div className="note">
        <ClockAfternoon className="clock-icon closed" />
        <span className="note closed">{t("footer.closedNote")}</span>
      </div>
      <div>{t("footer.hours")}</div>
    </div>
  );

  return <footer className="footer">{openStatus}</footer>;
};

export default Footer;
