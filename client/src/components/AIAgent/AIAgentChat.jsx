import { useState, useRef, useEffect } from "react";
import { X, Bot } from "lucide-react";
import "./AIAgentChat.css";
import { MdOutlineForwardToInbox, MdPersonOutline } from "react-icons/md";
import { MdHourglassEmpty } from "react-icons/md";

export default function AIAgentChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        'Hello! I’m your personal real estate assistant. Just describe what you’re looking for – e.g.:\n• "3-room apartment in Berlin"\n• "House in Munich, max. €500,000"\n• "Rental apartment in Hamburg with a garden"',
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const mockResponse = {
        role: "assistant",
        content: `I have received your request: "${userMessage.content}". The AI assistant will soon search for real estate and present suitable listings to you!`,
      };
      setMessages((prev) => [...prev, mockResponse]);
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="ai-chat-overlay"
      role="dialog"
      aria-label="AI Real Estate Assistant"
    >
      <div className="ai-chat-container">
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span className="ai-icon">
              <Bot size={28} />
            </span>
            <span>AI Real Estate Assistant</span>
          </div>
          <button
            onClick={onClose}
            className="ai-chat-close"
            aria-label="Close chat window"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.role}`}>
              <div className="ai-message-avatar">
                {msg.role === "user" ? <MdPersonOutline /> : <Bot />}
              </div>
              <div className="ai-message-content">
                <div>
                  {msg.content.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-message assistant">
              <div className="ai-message-avatar">
                <Bot />
              </div>
              <div className="ai-message-content">
                <div className="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="ai-chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your request..."
            disabled={isLoading}
            aria-label="Type your request and press enter..."
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <MdHourglassEmpty /> : <MdOutlineForwardToInbox />}
          </button>
        </form>
      </div>
    </div>
  );
}
