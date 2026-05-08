import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2500; // 2.5 seconds total loading time
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      // Easing function for smooth progress
      const easeOutQuart = 1 - Math.pow(1 - currentStep / steps, 4);
      setProgress(Math.min(easeOutQuart * 100, 100));

      if (currentStep >= steps) {
        clearInterval(timer);
        // Start exit animation
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-[#FFF8F0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Background Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#E53935]/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#FF6F00]/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFC107]/10 blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating Food Elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-30"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 3) * 35}%`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                y: [0, -15, 0],
                rotate: [0, i % 2 === 0 ? 10 : -10, 0]
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            >
              {['🌶️', '🍗', '🍛', '🥘', '🌿', '🧄', '🍄', '⭐'][i]}
            </motion.div>
          ))}

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            >
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-[#E53935]/20"
                style={{ width: 140, height: 140, margin: -10 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Middle Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-dashed border-[#FF6F00]/30"
                style={{ width: 160, height: 160, margin: -20 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />

              {/* Logo Container */}
              <motion.div
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#E53935] to-[#FF6F00] flex items-center justify-center shadow-2xl"
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(229, 57, 53, 0.3)',
                    '0 0 60px rgba(229, 57, 53, 0.5)',
                    '0 0 30px rgba(229, 57, 53, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  className="text-6xl font-black text-white"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <img src="./logo.png" width={80} />
                </motion.span>
              </motion.div>

              {/* Decorative Sparks */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#FFC107]"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                    opacity: [1, 0],
                    scale: [1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Brand Name */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1
                className="text-5xl sm:text-6xl font-black mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span className="bg-gradient-to-r from-[#E53935] via-[#FF6F00] to-[#FFC107] bg-clip-text text-transparent">
                  Samola
                </span>
              </h1>
              <motion.p
                className="text-[#4A4A5A] text-lg font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Rasa Juara, Selera Nusantara
              </motion.p>
            </motion.div>

            {/* Loading Bar Container */}
            <motion.div
              className="w-64 sm:w-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Progress Bar Background */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                {/* Animated Progress Fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#E53935] via-[#FF6F00] to-[#FFC107]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Loading Text */}
              <div className="flex justify-between items-center mt-3">
                <motion.span
                  className="text-sm text-[#4A4A5A] font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {progress < 30 && "Memuat bumbu..."}
                  {progress >= 30 && progress < 60 && "Menyiapkan menu..."}
                  {progress >= 60 && progress < 90 && "Memanaskan dapur..."}
                  {progress >= 90 && "Siap disajikan!"}
                </motion.span>
                <span className="text-sm font-bold text-[#E53935]">
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>

            {/* Animated Dots */}
            <motion.div
              className="flex gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-[#E53935]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom Decoration */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#4A4A5A]/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <span className="text-sm">www.samola.id</span>
          </motion.div>

          {/* Curtain Exit Effect */}
          <motion.div
            className="absolute inset-0 bg-[#E53935] pointer-events-none"
            initial={{ scaleY: 0 }}
            animate={isExiting ? { scaleY: [0, 1, 1, 0] } : { scaleY: 0 }}
            style={{ originY: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-[#FF6F00] pointer-events-none"
            initial={{ scaleY: 0 }}
            animate={isExiting ? { scaleY: [0, 1, 1, 0] } : { scaleY: 0 }}
            style={{ originY: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
