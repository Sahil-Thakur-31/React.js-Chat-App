'use client'
import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState('dark')
  useEffect(()=>{
    const stored = localStorage.getItem('theme') || 'dark'
    setTheme(stored)
    document.documentElement.classList.toggle('dark', stored === 'dark')
  },[])
  useEffect(()=>{
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },[theme])
  return [theme, setTheme]
}