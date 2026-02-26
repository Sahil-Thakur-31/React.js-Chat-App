import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Education from '../components/Education'
import Contact from '../components/Contact'

export default function Page(){
  return (
    <div>
      <Hero />
      <div className="max-w-6xl mx-auto px-6">
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </div>
    </div>
  )
}