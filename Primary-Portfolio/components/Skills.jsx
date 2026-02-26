'use client'
import { motion } from 'framer-motion'
import Reveal from "./Reveal";
import { FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaNodeJs, FaPhp, FaPython, FaDatabase } from "react-icons/fa";
import { SiNextdotjs, SiMongodb, SiMysql } from "react-icons/si";

export default function Skills(){
  const skillIcons = {
    "Next.js": <SiNextdotjs className="inline-block text-xl text-gray-700 dark:text-white" />,
    "React": <FaReact className="inline-block text-xl text-cyan-500" />,
    "HTML5": <FaHtml5 className="inline-block text-xl text-orange-500" />,
    "CSS3": <FaCss3Alt className="inline-block text-xl text-blue-500" />,
    "JS": <FaJsSquare className="inline-block text-xl text-yellow-400" />,
    "Node.js": <FaNodeJs className="inline-block text-xl text-green-500" />,
    "PHP": <FaPhp className="inline-block text-xl text-indigo-500" />,
    "Python": <FaPython className="inline-block text-xl text-yellow-500" />,
    "MySQL": <SiMysql className="inline-block text-xl text-blue-500" />,
    "MongoDB": <SiMongodb className="inline-block text-xl text-green-600" />,
  };

  const frontend = ['Next.js','React','HTML5','CSS3','JS'];
  const backend = ['Node.js','PHP','Python'];
  const db = ['MySQL','MongoDB'];

  return (
    <section className="py-16" id="skills">
      <Reveal>
        <h3 className="text-2xl font-semibold">Skills</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 backdrop-blur-sm">
          
          {/* Frontend */}
          <motion.div whileHover={{scale:1.02}} className="p-6 rounded-xl border">
            <h4 className="font-bold">Frontend (Specialized)</h4>
            <ul className="mt-3 space-y-2">
              {frontend.map(skill => (
                <li key={skill} className="flex items-center gap-2">
                  {skillIcons[skill]} {skill}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Backend */}
          <motion.div whileHover={{scale:1.02}} className="p-6 rounded-xl border">
            <h4 className="font-bold">Backend</h4>
            <ul className="mt-3 space-y-2">
              {backend.map(skill => (
                <li key={skill} className="flex items-center gap-2">
                  {skillIcons[skill]} {skill}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Databases */}
          <motion.div whileHover={{scale:1.02}} className="p-6 rounded-xl border">
            <h4 className="font-bold">Databases & Other</h4>
            <ul className="mt-3 space-y-2">
              {db.map(skill => (
                <li key={skill} className="flex items-center gap-2">
                  {skillIcons[skill]} {skill}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </Reveal>
    </section>
  )
}
