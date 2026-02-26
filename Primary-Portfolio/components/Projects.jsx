'use client'
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion'
import Reveal from "./Reveal";

const projects = [
  {
    id: 1,
    title: "Chat App",
    desc: "A real-time chat application built with React and a Firebase backend, which includes user authentication, chat management, and the ability to send messages and emojis.",
    tech: ["React.js", "CSS3", "Firebase"],
    demo: "https://reactchat31.web.app/",
    code: "https://github.com/Sahil-Thakur-31/Next.js-Chat-App",
    image: "projects/chat.png",
  },
  {
    id: 2,
    title: "Certificate Gallery",
    desc: "This is a full-stack Next.js certificate gallery with an admin panel for managing certificates, using a MongoDB database for storage.",
    tech: ["Node.js", "Next.js", "MongoDB Atlas"],
    demo: "https://certificate-gallary-eta.vercel.app/",
    code: "https://github.com/Sahil-Thakur-31/Certificate-Gallary",
    image: "projects/gallery.png",
  },
];

export default function Projects(){
  return (
    <section className="py-16" id="projects">
      <Reveal>
        <h3 className="text-2xl font-semibold">Projects</h3>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p=> (
            <Tilt key={p.id} className="backdrop-blur-sm rounded-xl p-4 border shadow-lg" tiltMaxAngleX={8} tiltMaxAngleY={8} transitionSpeed={150} scale={1.05}>
              <motion.div whileHover={{scale:1.02}} className="space-y-3">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-40 object-cover rounded-md bg-gray-400 dark:bg-gray-700" 
                />
                <h4 className="font-bold">{p.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {p.tech.map((techItem, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 rounded bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a 
                    href={p.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 border rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
                  >
                    Demo
                  </a>
                  <a 
                    href={p.code} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 border rounded hover:bg-primary-light dark:hover:bg-primary-dark transition"
                  >
                    Code
                  </a>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
