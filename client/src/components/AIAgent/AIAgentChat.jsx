import { useState, useRef, useEffect } from "react";
import { X, Bot } from "lucide-react";
import "./AIAgentChat.css";
import { MdOutlineForwardToInbox, MdPersonOutline } from "react-icons/md";
import { MdHourglassEmpty } from "react-icons/md";
import { Link } from "react-router-dom";
import { AGENT_MATCH_URL } from "../../config/api";

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
  // Last search criteria from API — sent back so follow-ups keep filters
  const [lastCriteria, setLastCriteria] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Map API status/payload to chat text and optional listing links */
  function formatAgentReply(data) {
    if (data.status === "need_more_info") {
      return {
        content:
          data.followUpQuestion ||
          "Could you share a bit more (city, rooms, or budget)?",
        suggestions: [],
      };
    }

    if (data.status === "no_match") {
      return {
        content:
          "I couldn't find a matching property. Try different rooms, budget, or city.",
        suggestions: [],
      };
    }

    const list = data.suggestions ?? [];
    if (list.length === 0) {
      return { content: "No listings to show.", suggestions: [] };
    }

    return {
      content: `I found ${list.length} listing(s) that match your request:`,
      suggestions: list,
    };
  }

  // Call server agent (DeepSeek + DB stay on backend)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    const userMessage = { role: "user", content: text };

    // Short history BEFORE this message (text only — no suggestion payloads)
    const history = messages
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(AGENT_MATCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          previousCriteria: lastCriteria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      // Remember criteria for next follow-up turn
      if (data.criteria) {
        setLastCriteria(data.criteria);
      }

      const { content, suggestions } = formatAgentReply(data);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content, suggestions },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          suggestions: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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

                {/* Clickable matches → property detail; close chat panel */}
                {msg.suggestions?.length > 0 && (
                  <ul className="ai-suggestions">
                    {msg.suggestions.map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/estate/${s.id}`}
                          className="ai-suggestion-link"
                          onClick={onClose}
                        >
                          {s.category} · {s.rooms} rooms · {s.address}
                          {s.buy != null && ` · €${s.buy.toLocaleString()}`}
                          {s.rent != null &&
                            ` · €${s.rent.toLocaleString()}/mo`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
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
