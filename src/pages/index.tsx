// src/pages/index.tsx
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [showText, setShowText] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0a1a33] to-[#13294b] text-white">
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-16 text-center">
        {/* Logo with bounce zoom */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1.2, 1], opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          onAnimationComplete={() => setTimeout(() => setShowText(true), 400)} // ⏳ wait before text appears
          className="mb-6"
        >
          <Image
            src="/images/logo.png"
            alt="Club Logo"
            width={200}
            height={200}
            priority
          />
        </motion.div>

        {/* Reveal text after logo finishes */}
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-extrabold mb-4 text-white">
              RVR Football Club
            </h1>
            <p className="text-lg max-w-xl text-gray-200">
              Welcome to the official site of RVR Football Club. Stay up to date
              with fixtures, results, and club news.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
