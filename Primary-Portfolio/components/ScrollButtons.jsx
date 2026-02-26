"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // install lucide-react for icons

export default function ScrollButtons() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [docHeight, setDocHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setWindowHeight(window.innerHeight);
      setDocHeight(document.documentElement.scrollHeight);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll(); // initial check
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const atTop = scrollPosition < 50;
  const atBottom = scrollPosition + windowHeight >= docHeight - 50;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Scroll Up */}
      {!atTop && (
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition"
        >
          <ChevronUp size={20} />
        </button>
      )}

      {/* Scroll Down */}
      {!atBottom && (
        <button
          onClick={scrollToBottom}
          className="p-3 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}
