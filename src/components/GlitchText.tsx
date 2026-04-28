import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    setGlitch(true);
    const timer = setTimeout(() => setGlitch(false), 600);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <h1
      className={`relative inline-block ${className} ${glitch ? "animate-glitch" : ""}`}
      data-text={text}
    >
      {text}
    </h1>
  );
}
