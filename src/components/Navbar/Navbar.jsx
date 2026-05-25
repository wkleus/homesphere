import "./Navbar.css";
import { Buildings, EnvelopeOpen, PhoneCall } from "phosphor-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Buildings className="nav-brand-icon" weight="fill" />
        <span className="nav-span">
          <b>H</b>ome<b>S</b>phere
        </span>
      </div>
      <div className="nav-items">
        <div className="nav-item">
          <EnvelopeOpen className="nav-icon" weight="fill" />
          <span className="nav-span">example@example.com</span>
        </div>
        <div className="nav-item">
          <PhoneCall className="nav-icon" weight="fill" />
          <span className="nav-span">(+49) 030 XXXX XXXX</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
