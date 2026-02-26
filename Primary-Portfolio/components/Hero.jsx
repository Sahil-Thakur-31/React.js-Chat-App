'use client';
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

export default function Hero() {
  const [init, setInit] = useState(false);
  const [particleColor, setParticleColor] = useState("#00ffff");
  const [bgGradient, setBgGradient] = useState('');

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const updateColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setParticleColor(isDark ? "#00ffff" : "#ff6600");
      setBgGradient(
        isDark
          ? 'radial-gradient(ellipse 100% 80% at center, rgba(0, 255, 255, 0.1), transparent 50%)'
          : 'radial-gradient(ellipse 100% 80% at center, rgba(255, 165, 0, 0.1), transparent 50%)'
      );
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Radial spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: bgGradient }}
      />

      {init && (
        <Particles
          id="tsparticles"
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
              },
              modes: { repulse: { distance: 100, duration: 0.4 } },
            },
            particles: {
              color: { value: particleColor },
              links: {
                color: particleColor,
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1.5,
              },
              move: {
                enable: true,
                speed: 1,
                outModes: { default: "bounce" },
              },
              number: { value: 50, density: { enable: true, area: 800 } },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center text-white"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
          Hi, I’m Sahil Chandan Thakur
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          MCA Student & Frontend Developer — Crafting smooth, animated web apps
        </p>
      </motion.div>
    </section>
  );
}
