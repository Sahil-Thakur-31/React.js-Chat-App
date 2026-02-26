// app/layout.jsx
import './global.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar' 
import ScrollButtons from "../components/ScrollButtons";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
        />
      </head>
      <body className="bg-gray-300 dark:bg-[#071022] text-gray-900 dark:text-gray-100 transition-colors duration-500">
        <Navbar /> 
        {children}
        <ScrollButtons />
        <Footer />
      </body>
    </html>
  )
}
