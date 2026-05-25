import { ClockAfternoon } from "phosphor-react";
import "./Footer.css";

const Footer = () => {
  const businessStart = 8;
  const businessEnd = 18;
  const curDay = new Date().getDay();
  const curTime = new Date().getHours();

  // const storeIsOpen = true;
  const storeIsOpen =
    curDay > 0 &&
    curDay < 6 &&
    curTime >= businessStart &&
    curTime < businessEnd;

  const openStatus = storeIsOpen ? (
    <div>
      <div className="note">
        <ClockAfternoon className="clock-icon open" />
        <span className="note open">Store is still open.</span>
      </div>
      <div>
        Contact us at{" "}
        <a className="email" href="mailto:example@example.com">
          example@example.com
        </a>
      </div>
    </div>
  ) : (
    <div>
      <div className="note">
        <ClockAfternoon className="clock-icon closed" />
        <span className="note closed">Store is closed.</span>
      </div>
      <div>Business hours: 8am - 6pm, Mon - Fri</div>
    </div>
  );

  return <footer className="footer">{openStatus}</footer>;
};

export default Footer;
