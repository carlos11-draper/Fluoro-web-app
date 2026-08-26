import { motion } from "framer-motion";

// Continuous left-to-right shine sweeping across text.
// Base #64CEFB with a deep blue (#1d4ed8) body and white highlight.
export const ShinyText = ({
  children,
  speed = 3,
  spread = 100,
  baseColor = "#64CEFB",
  shineColor = "#ffffff",
  deepColor = "#1d4ed8",
  className = "",
}) => (
  <motion.span
    className={`inline-block ${className}`}
    style={{
      backgroundImage: `linear-gradient(${spread}deg, ${deepColor} 0%, ${baseColor} 35%, ${shineColor} 50%, ${baseColor} 65%, ${deepColor} 100%)`,
      backgroundSize: "200% 100%",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    }}
    animate={{ backgroundPosition: ["200% 50%", "-200% 50%"] }}
    transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
  >
    {children}
  </motion.span>
);
