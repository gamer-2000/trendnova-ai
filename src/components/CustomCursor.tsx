import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = !!(
        target.closest("a, button, [role='button'], input, textarea, select, label[for], .cursor-pointer")
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    let raf: number;
    const animate = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;

        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) scale(${isHovering.current ? 1.5 : 1})`;
        ringRef.current.style.borderColor = isHovering.current
          ? "hsl(175 80% 50% / 0.8)"
          : "hsl(175 80% 50% / 0.4)";
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: "hsl(175 80% 50%)",
          boxShadow: "0 0 10px hsl(175 80% 50% / 0.6), 0 0 20px hsl(175 80% 50% / 0.3)",
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: "1.5px solid hsl(175 80% 50% / 0.4)",
          transition: "border-color 0.2s, width 0.2s, height 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CustomCursor;
