'use client'
export default function Footer(){
  return (
    <footer className="py-8 mt-12 border-t backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 text-center text-sm">© {new Date().getFullYear()} Sahil Chandan Thakur — Built with ❤️</div>
    </footer>
  )
}