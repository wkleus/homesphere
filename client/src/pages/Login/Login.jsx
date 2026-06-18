import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buildings } from "phosphor-react";
import { motion } from "framer-motion";
import useAuth from "../../context/useAuth";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send credentials to Supabase Auth for authentication
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Stagger animation for form fields
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="login-page">
      {/* Animated background with gradient */}
      <div className="login-bg">
        <motion.div
          className="bg-gradient"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Login card with spring animation */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 4,
          type: "spring",
          bounce: 0.6,
          delay: 0.5,
          ease: "easeInOut",
        }}
      >
        <div className="login-header">
          <div className="login-logo">
            <Buildings size={28} weight="fill" />
          </div>
          <span className="login-title">
            Home<strong>Sphere</strong>
          </span>
          <p className="login-subtitle">Admin Login</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <motion.div
            className="login-field"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </motion.div>

          <motion.div
            className="login-field"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.p
              className="login-error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="login-btn"
            disabled={loading}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
