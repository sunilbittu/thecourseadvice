"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  decimals?: number;
}

export default function Counter({
  value,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.8,
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ val: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(counterRef.current, {
      val: value,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
      onUpdate: () => {
        if (el) {
          const v = counterRef.current.val;
          el.textContent = prefix + (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()) + suffix;
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [value, prefix, suffix, duration, decimals]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
