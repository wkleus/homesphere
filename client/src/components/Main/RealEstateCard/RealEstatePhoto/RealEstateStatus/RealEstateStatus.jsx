import "./RealEstateStatus.css";
import { useTranslation } from "react-i18next";

const RealEstateStatus = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="status">{t("card.alreadyTaken")}</div>
    </div>
  );
};

export default RealEstateStatus;
