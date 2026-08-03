import "./AIAgentChat.css";

export default function AIAgentChat({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-container">
        {/* Header */}
        <div className="ai-chat-header">
          <button onClick={onClose} className="ai-chat-close">
            Close
          </button>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages">Hello...</div>

        {/* Input */}
        <form className="ai-chat-input">
          <input type="text" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}
