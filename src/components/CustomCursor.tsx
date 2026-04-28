import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      setVisible(true);
      setPos({ x: e.clientX, y: e.clientY });
      ringX = e.clientX;
      ringY = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-clickable]")
      ) {
        setHovering(true);
      }
    };

    const onMouseOut = () => {
      setHovering(false);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const animate = () => {
      setRingPos((prev) => ({
        x: prev.x + (ringX - prev.x) * 0.15,
        y: prev.y + (ringY - prev.y) * 0.15,
      }));
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
        style={{
          left: pos.x - 6,
          top: pos.y - 6,
          transition: "transform 0.05s ease-out",
        }}
      />
      <div
        className={`fixed pointer-events-none z-[9998] w-8 h-8 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-transform duration-200 ease-out ${
          hovering ? "scale-150" : "scale-100"
        }`}
        style={{
          left: ringPos.x - 16,
          top: ringPos.y - 16,
        }}
      />
    </>
  );
}
