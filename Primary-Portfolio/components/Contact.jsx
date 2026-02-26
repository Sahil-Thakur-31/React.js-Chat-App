'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !message) {
      setStatus({ type: 'error', msg: 'Please fill out all fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error || 'Failed to send message.' });
      } else {
        setStatus({ type: 'success', msg: 'Message sent successfully!' });
        setEmail('');
        setMessage('');
      }
    } catch {
      setStatus({ type: 'error', msg: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16" id="contact">
      <h3 className="text-2xl font-semibold">Contact</h3>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="p-6 border rounded-lg backdrop-blur-sm flex flex-col justify-between shadow-xl"
        >
        <div>
            {/* Your existing contact info */}
            <div className="flex items-center gap-3">
            <FaEnvelope className="text-primary-light dark:text-primary-dark" />
            <p className="text-lg">sahilthakur3109@gmail.com</p>
            </div>
            <div className="flex items-center gap-3 mt-7">
            <FaPhone className="text-primary-light dark:text-primary-dark" />
            <p className="text-lg">7030179095</p>
            </div>
            <div className="flex items-center gap-3 mt-7">
            <FaMapMarkerAlt className="text-primary-light dark:text-primary-dark" />
            <p className="text-lg">Pune, Maharashtra</p>
            </div>

            {/* Social links */}
            <div className="mt-8 flex gap-6">
            <a
                href="https://github.com/Sahil-Thakur-31/"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center gap-1"
            >
                <FaGithub />
                GitHub
            </a>
            <a
                href="https://www.linkedin.com/in/sahil-thakur31/"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center gap-1"
            >
                <FaLinkedin />
                LinkedIn
            </a>
            <a
                href="https://www.instagram.com/sahil_thakur74/#"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center gap-1"
            >
                <FaInstagram />
                Instagram
            </a>
            </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
            <a
            href="/resume.pdf"
            download
            className="px-5 py-2 bg-primary-light dark:bg-primary-dark text-white rounded text-center hover:brightness-110 transition"
            >
            Download Resume
            </a>
            <a
            href="https://certificate-gallary-eta.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 border border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark rounded text-center hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition"
            >
            View Certificates
            </a>
        </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="p-6 border rounded-lg backdrop-blur-sm flex flex-col shadow-xl"
        >
          <label className="block">Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2 mt-2 bg-white dark:bg-gray-800"
            required
          />

          <label className="block mt-4">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded p-2 mt-2 bg-white dark:bg-gray-800"
            rows={5}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 px-4 py-2 bg-primary-light dark:bg-primary-dark rounded text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          <div className="mt-4 h-6">
            {status && (
                <p
                className={`${
                    status.type === "success" ? "text-green-500" : "text-red-500"
                }`}
                >
                {status.msg}
                </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
