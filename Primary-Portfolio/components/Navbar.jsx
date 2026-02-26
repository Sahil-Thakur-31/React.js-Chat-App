'use client'
import Link from 'next/link'
import { useTheme } from '../utils/theme-store'
import { useEffect, useState } from 'react'

export default function Navbar(){
  const [theme, setTheme] = useTheme()
  return (
<nav className="py-4 px-6 sticky top-0 z-50">
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    <div className="font-bold text-xl">
      Sahil <span className="text-primary-light dark:text-primary-dark">Thakur</span>
    </div>
    <div className="flex items-center gap-4">
      <Link href="#projects">Projects</Link>
      <Link href="#contact">Contact</Link>
      <button
        className="px-3 py-1 rounded-md border border-white/20 bg-black/5 backdrop-blur-sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </div>
  </div>
</nav>
  )
}