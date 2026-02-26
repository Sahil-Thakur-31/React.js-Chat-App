"use client";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="py-16" id="about">
      <div className="flex items-center justify-between gap-8">
        <Reveal>
          <h2 className="text-3xl font-bold">About</h2>
        </Reveal>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-8 items-center">
        <Reveal>
          <div className="backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <p className="leading-relaxed">
              I’m a second-year MCA student passionate about crafting
              smooth, interactive, and visually striking web experiences.
              My focus lies in building high-performance frontends with
              <strong> Next.js</strong> and <strong>React</strong>, while
              bringing designs to life with clean animations and intuitive
              user flows.
            </p>

            <p className="mt-4 leading-relaxed">
              Beyond coding, I’m driven by the challenge of turning complex
              ideas into accessible solutions. Whether collaborating in a team
              or working independently, I aim to deliver experiences that feel
              effortless for the user.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex justify-center">
            <img 
              src="Sahil.jpg" 
              alt="Description" 
              className="w-72 h-72 rounded-2xl object-cover" 
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
