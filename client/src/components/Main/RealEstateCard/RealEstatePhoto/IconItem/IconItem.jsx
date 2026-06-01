import "./IconItem.css";

const IconItem = ({ Icon, description, tooltip }) => {
  return (
    <span className="icon-item" title={tooltip}>
      <Icon size={15} className="icon" /> {description}
    </span>
  );
};

export default IconItem;
