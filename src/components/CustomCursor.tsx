import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(Array.from({ length: 5 }, () => ({ x: -100, y: -100 })));
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = !!(
        target.closest("a, button, [role='button'], input, textarea, select, label[for], .cursor-pointer")
      );
    };

    const onDown = () => { isClicking.current = true; };
    const onUp = () => { isClicking.current = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf: number;
    const animate = () => {
      if (dotRef.current) {
        const scale = isClicking.current ? 0.5 : isHovering.current ? 2 : 1;
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scale(${scale})`;
        dotRef.current.style.opacity = isHovering.current ? "0.6" : "1";
      }

      // Update trail positions with staggered lerp
      for (let i = 0; i < trailPositions.current.length; i++) {
        const target = i === 0 ? pos.current : trailPositions.current[i - 1];
        const speed = 0.2 - i * 0.03;
        trailPositions.current[i].x += (target.x - trailPositions.current[i].x) * speed;
        trailPositions.current[i].y += (target.y - trailPositions.current[i].y) * speed;

        const el = trailRefs.current[i];
        if (el) {
          const trailScale = isHovering.current ? 1.8 - i * 0.2 : 1 - i * 0.12;
          el.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px) scale(${trailScale})`;
        }
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
          style={{
            width: 8 - i,
            height: 8 - i,
            marginLeft: -(8 - i) / 2,
            marginTop: -(8 - i) / 2,
            borderRadius: "50%",
            background: `hsl(175 80% ${60 - i * 6}% / ${0.5 - i * 0.08})`,
            willChange: "transform",
          }}
        />
      ))}
      {/* Main cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(175 80% 70%), hsl(200 80% 55%))",
          boxShadow:
            "0 0 8px hsl(175 80% 50% / 0.7), 0 0 20px hsl(175 80% 50% / 0.3), 0 0 40px hsl(200 80% 55% / 0.15)",
          willChange: "transform",
          transition: "opacity 0.2s",
        }}
      />
    </>
  );
};

export default CustomCursor;
