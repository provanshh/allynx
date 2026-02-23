import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseDuration?: number;
}

const TypewriterText = ({
  text,
  className = "",
  typeSpeed = 100,
  eraseSpeed = 60,
  pauseDuration = 2000,
}: TypewriterTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => setIsTyping(false), pauseDuration);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, eraseSpeed);
      } else {
        timeout = setTimeout(() => setIsTyping(true), 400);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isTyping, text, typeSpeed, eraseSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[4px] h-[0.85em] bg-primary ml-0.5 align-middle rounded-sm"
      />
    </span>
  );
};

export default TypewriterText;
