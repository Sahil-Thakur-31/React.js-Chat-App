'use client'
import { motion } from 'framer-motion'

export default function Education(){
  const items = [
    { title:'10th - Seth Dagaduram Katariya English Medium High School', year:'2019', score:'74.20%'},
    { title:'12th - Modern College of Arts, Science and Commerce, Warje', year:'2021', score:'71.33% (Science)'},
    { title:'BBA(CA) - Sinhgad College of Science (Savitribai Phule Pune University)', year:'2021-2024', score:'8.08 CGPA'},
    { title:'MCA - Modern College of Engineering', year:'2024-2026', score:'7.3 (1st year)'}
  ]
  return (
    <section className="py-16" id="education">
      <h3 className="text-2xl font-semibold">Education</h3>
      <div className="mt-6 space-y-4 ">
        {items.map((it,i)=> (
          <motion.div key={i} initial={{x:-30,opacity:0}} whileInView={{x:0,opacity:1}} className="backdrop-blur-sm p-4 border rounded-lg">
            <div className="flex justify-between"><div className="font-bold">{it.title}</div><div className="text-sm">{it.year}</div></div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{it.score}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}