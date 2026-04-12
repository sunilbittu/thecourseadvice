"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroTextProps {
  text: string;
  className?: string;
}

export default function HeroText({ text, className = "" }: HeroTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { y: "110%", rotateX: -20, opacity: 0 },
      {
        y: "0%",
        rotateX: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "power4.out",
        delay: 0.2,
      }
    );
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <span className="word inline-block" style={{ opacity: 0 }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
