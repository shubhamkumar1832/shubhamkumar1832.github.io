"use client";

import { useEffect, useRef } from "react";

const DESKTOP_RADIUS = 235;
const MOBILE_RADIUS = 150;
const OFFSCREEN = -999;
const POSITION_EASE = 0.14;
const RADIUS_EASE = 0.12;

const NAME = "Shubham Kumar";
const FULL_TITLE = "AI & Data Science Student | Aspiring Software Developer";
const LINKEDIN_URL = "https://www.linkedin.com/in/shubham-kumar-74b174330";
const GITHUB_URL = "https://github.com/shubhamkumar1832";
const LEETCODE_URL = "https://leetcode.com/u/Shubham18kumar/";
const INTRO =
  "I'm a 3rd-year BTech student in AI & Data Science at Galgotias College of Engineering and Technology, building projects and sharpening my problem-solving skills.";

type Point = { x: number; y: number };

export default function GlassHero() {
  const heroRef = useRef<HTMLElement>(null);
  const rawRef = useRef<Point>({ x: OFFSCREEN, y: OFFSCREEN });
  const smoothRef = useRef<Point>({ x: OFFSCREEN, y: OFFSCREEN });
  const radiusRef = useRef(0);
  const targetRadiusRef = useRef(0);
  const touchingRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = () => {
      hero.style.setProperty("--reveal-x", `${smoothRef.current.x}px`);
      hero.style.setProperty("--reveal-y", `${smoothRef.current.y}px`);
      hero.style.setProperty("--reveal-radius", `${radiusRef.current}px`);
    };

    // The single rAF loop. It runs while anything is still easing and parks
    // itself (frameRef = 0) once position and radius have settled.
    const tick = () => {
      const positionEase = reducedMotion.matches ? 1 : POSITION_EASE;
      const radiusEase = reducedMotion.matches ? 1 : RADIUS_EASE;
      const raw = rawRef.current;
      const smooth = smoothRef.current;
      const target = targetRadiusRef.current;

      smooth.x += (raw.x - smooth.x) * positionEase;
      smooth.y += (raw.y - smooth.y) * positionEase;
      radiusRef.current += (target - radiusRef.current) * radiusEase;

      const settled =
        Math.abs(raw.x - smooth.x) < 0.05 &&
        Math.abs(raw.y - smooth.y) < 0.05 &&
        Math.abs(target - radiusRef.current) < 0.05;

      if (settled) {
        smooth.x = raw.x;
        smooth.y = raw.y;
        radiusRef.current = target;
      }

      paint();
      frameRef.current = settled ? 0 : requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (frameRef.current === 0) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    const setPoint = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      rawRef.current.x = event.clientX - rect.left;
      rawRef.current.y = event.clientY - rect.top;
    };

    // Jump the smoothed point to the raw point so the reveal opens where the
    // pointer is instead of flying in from off-screen.
    const snapToPoint = () => {
      smoothRef.current.x = rawRef.current.x;
      smoothRef.current.y = rawRef.current.y;
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setPoint(event);
      if (radiusRef.current < 1) snapToPoint();
      targetRadiusRef.current = DESKTOP_RADIUS;
      startLoop();
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetRadiusRef.current = 0;
      startLoop();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      touchingRef.current = true;
      setPoint(event);
      snapToPoint();
      targetRadiusRef.current = MOBILE_RADIUS;

      // Capturing would retarget the tap away from links/buttons, so skip it
      // when the touch starts on one.
      const onInteractive = (event.target as Element | null)?.closest("a, button");
      if (!onInteractive && hero.setPointerCapture) {
        try {
          hero.setPointerCapture(event.pointerId);
        } catch {
          /* pointer capture is best-effort */
        }
      }
      startLoop();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        setPoint(event);
        if (targetRadiusRef.current === 0) {
          if (radiusRef.current < 1) snapToPoint();
          targetRadiusRef.current = DESKTOP_RADIUS;
        }
        startLoop();
        return;
      }
      if (!touchingRef.current) return;
      setPoint(event);
      startLoop();
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      touchingRef.current = false;
      targetRadiusRef.current = 0;
      startLoop();
    };

    hero.addEventListener("pointerenter", onPointerEnter);
    hero.addEventListener("pointerleave", onPointerLeave);
    hero.addEventListener("pointerdown", onPointerDown);
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerup", onPointerEnd);
    hero.addEventListener("pointercancel", onPointerEnd);
    paint();

    return () => {
      hero.removeEventListener("pointerenter", onPointerEnter);
      hero.removeEventListener("pointerleave", onPointerLeave);
      hero.removeEventListener("pointerdown", onPointerDown);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerup", onPointerEnd);
      hero.removeEventListener("pointercancel", onPointerEnd);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, []);

  return (
    <section ref={heroRef} className="glass-hero" aria-label="Introduction">
      {/* 1 + 2: aligned portrait pair */}
      <div className="portrait portrait--base" aria-hidden="true" />
      <div className="portrait portrait--reveal" aria-hidden="true" />

      {/* 3: technical grid + oversized circle */}
      <div className="tech-grid" aria-hidden="true">
        <span className="tech-circle" />
      </div>

      {/* 4: headline and copy */}
      <h1 className="hero-title" aria-label={FULL_TITLE}>
        <span className="hero-line">Building</span>
        <span className="hero-line">with Data</span>
        <span className="hero-line">&amp; Code</span>
      </h1>

      <div className="hero-intro">
        <p>{INTRO}</p>
        <a
          className="pill pill--body"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          Explore my work
        </a>
      </div>

      <div className="hero-tagline">
        <p>
          <span>Turning data</span>
          <span>and code into</span>
          <span>useful things.</span>
        </p>
        <ul className="hero-social">
          <li>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={LEETCODE_URL} target="_blank" rel="noreferrer">
              LeetCode
            </a>
          </li>
        </ul>
      </div>

      {/* 5: navigation */}
      <header className="hero-nav">
        <nav aria-label="Primary">
          <a className="brand" href="/" aria-label={`${NAME} — home`}>
            <svg
              className="monogram"
              viewBox="0 0 40 40"
              width="36"
              height="36"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="20" cy="20" r="19" fill="#fff" stroke="currentColor" strokeWidth="1" />
              <path
                d="M25.5 15.5A5.5 5.5 0 1 0 20 21A5.5 5.5 0 1 1 14.5 26.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="20" cy="21" r="1.4" fill="currentColor" />
            </svg>
            <span>{NAME}</span>
          </a>

          <ul className="nav-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#process">Process</a>
            </li>
            <li>
              <a href="#experiments">Experiments</a>
            </li>
          </ul>

          <a
            className="pill pill--mono"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
          >
            Let&apos;s talk
          </a>
        </nav>
      </header>
    </section>
  );
}
