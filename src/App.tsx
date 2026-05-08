import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Flame,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Star,
  ChevronRight,
  Sparkles,
  Clock,
  Heart,
  ArrowRight
} from 'lucide-react';
import Preloader from './components/Preloader';

// =============================================
// INTERSECTION OBSERVER HOOK FOR SCROLL ANIMATIONS
// =============================================
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
};

// =============================================
// MAGNETIC BUTTON COMPONENT
// =============================================
const MagneticButton = ({
  children,
  href,
  className = '',
  onClick
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const buttonContent = (
    <motion.span
      className={`magnetic-btn inline-flex items-center gap-2 ${className}`}
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      onClick={onClick}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {buttonContent}
      </a>
    );
  }

  return <button className="inline-block">{buttonContent}</button>;
};

// =============================================
// 3D TILT CARD COMPONENT
// =============================================
const TiltCard = ({
  children,
  className = '',
  glare = true
}: {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setRotation({
      x: (y - 0.5) * -20,
      y: (x - 0.5) * 20
    });
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
    >
      {children}
      {glare && (
        <div
          className="tilt-card-glare"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
          }}
        />
      )}
    </motion.div>
  );
};

// =============================================
// FLOATING ELEMENT COMPONENT
// =============================================
const FloatingElement = ({
  children,
  delay = 0,
  duration = 6,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, 0, -5, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  >
    {children}
  </motion.div>
);

// =============================================
// HERO SECTION
// =============================================
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);

  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFF8F0] to-[#FFECB3]" />

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#E53935]/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#FF6F00]/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#FFC107]/5 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating Food Elements */}
      <motion.div
        className="absolute top-32 left-[10%] text-6xl"
        style={{ y: springY1 }}
      >
        <FloatingElement delay={0} duration={5}>🌶️</FloatingElement>
      </motion.div>
      <motion.div
        className="absolute top-40 right-[15%] text-5xl"
        style={{ y: springY2 }}
      >
        <FloatingElement delay={1} duration={6}>🍗</FloatingElement>
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-[20%] text-5xl"
        style={{ y: springY1 }}
      >
        <FloatingElement delay={2} duration={7}>🥘</FloatingElement>
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-[10%] text-6xl"
        style={{ y: springY2 }}
      >
        <FloatingElement delay={1.5} duration={5.5}>🍛</FloatingElement>
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-[5%] text-4xl"
        style={{ y: springY1 }}
      >
        <FloatingElement delay={0.5} duration={4}>🌿</FloatingElement>
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-[5%] text-4xl"
        style={{ y: springY2 }}
      >
        <FloatingElement delay={2.5} duration={6.5}>🧄</FloatingElement>
      </motion.div>

      {/* Main Hero Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#FFC107]" />
          <span className="text-sm font-medium text-[#4A4A5A]">Makanan Indonesia Autentik</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <span className="text-[#1A1A2E]">Rasa </span>
          <span className="text-gradient">Juara</span>
          <span className="text-[#1A1A2E]">,</span>
          <br />
          <span className="text-[#1A1A2E]">Selera </span>
          <span className="text-[#E53935]">Nusantara!</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-[#4A4A5A] max-w-2xl mx-auto mb-10"
        >
          Nikmati kelezatan masakan tradisional Indonesia dengan sentuhan modern.
          <span className="text-[#E53935] font-semibold"> Samola</span> hadir untuk memanjakan lidah Anda!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            href="https://menu.samola.id/"
            className="px-8 py-4 rounded-full bg-gradient-samola text-white font-bold text-lg shadow-xl animate-pulse-glow hover:shadow-2xl transition-shadow"
          >
            <Utensils className="w-5 h-5" />
            Lihat Menu Kami
            <ChevronRight className="w-5 h-5" />
          </MagneticButton>

          <MagneticButton
            href="#about"
            className="px-8 py-4 rounded-full bg-white text-[#1A1A2E] font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-[#E53935]/20"
          >
            <Heart className="w-5 h-5 text-[#E53935]" />
            Kenali Kami
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '50+', label: 'Menu Lezat' },
            { value: '10K+', label: 'Pelanggan' },
            { value: '4.9', label: 'Rating' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#E53935]">{stat.value}</div>
              <div className="text-sm text-[#4A4A5A]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#E53935]/30 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-[#E53935]"
            animate={{ opacity: [1, 0], y: [0, 8] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// =============================================
// ABOUT / STORY SECTION
// =============================================
const AboutSection = () => {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FFC107]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            style={{ scale: imageScale, y: imageY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Animated Blob Background */}
              <div className="absolute inset-0 bg-gradient-samola animate-morph opacity-20 scale-110" />

              {/* Main Image */}
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
                <img
                  src="/food-hero.jpg"
                  alt="Samola Food"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E53935]/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[#E53935]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1A1A2E]">100%</div>
                    <div className="text-sm text-[#4A4A5A]">Bumbu Autentik</div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-[#FFC107] flex items-center justify-center text-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                ⭐
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-[#E53935]/10 text-[#E53935] text-sm font-semibold mb-4">
                Tentang Samola
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-[#1A1A2E] mb-6 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Cerita Dari Dapur
              <span className="marker-text" data-visible={isVisible}> Nusantara</span>
              <br />Yang Penuh{' '}
              <span className="text-gradient">Cinta</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-[#4A4A5A] text-lg leading-relaxed"
            >
              <p>
                <span className="marker-text" data-visible={isVisible}>
                  Samola lahir dari kecintaan kami akan kuliner Indonesia
                </span>{' '}
                yang kaya akan rempah dan cita rasa. Setiap hidangan kami sajikan dengan resep turun-temurun yang telah sempurna selama bertahun-tahun.
              </p>
              <p>
                Kami percaya bahwa <span className="font-semibold text-[#E53935]">makanan yang enak</span> harus dinikmati oleh semua orang.
                Dengan bahan-bahan segar pilihan dan bumbu autentik, kami menghadirkan pengalaman kuliner yang tak terlupakan.
              </p>
              <p>
                Dari <span className="font-semibold text-[#FF6F00]">Ayam Geprek</span> yang pedas nendang hingga{' '}
                <span className="font-semibold text-[#FF6F00]">Nasi Goreng</span> yang gurih meresap,
                setiap suapan adalah perjalanan rasa yang memanjakan lidah.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {[
                { icon: Star, text: 'Kualitas Premium' },
                { icon: Clock, text: 'Masak Fresh Setiap Hari' },
                { icon: Heart, text: 'Dibuat Dengan Cinta' },
                { icon: MapPin, text: 'Lokal & Autentik' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFC107]/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-[#FF6F00]" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================
// INFINITE MARQUEE SECTION
// =============================================
const MarqueeSection = () => {
  const items = [
    { text: 'Ayam Geprek', icon: '🍗' },
    { text: 'Nasi Goreng', icon: '🍛' },
    { text: 'Mie Goreng', icon: '🍜' },
    { text: 'Sate Ayam', icon: '🍢' },
    { text: 'Rendang', icon: '🥩' },
    { text: 'Gado-Gado', icon: '🥗' },
    { text: 'Soto Ayam', icon: '🍲' },
    { text: 'Es Teler', icon: '🍹' },
  ];

  return (
    <section className="py-12 overflow-hidden bg-[#E53935]">
      <div className="relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {[...items, ...items, ...items, ...items].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 mx-8 text-white"
            >
              <span className="text-4xl">{item.icon}</span>
              <span className="text-3xl sm:text-4xl font-black uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {item.text}
              </span>
              <span className="text-[#FFC107] text-2xl">★</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// =============================================
// MENU SHOWCASE SECTION (BENTO GRID)
// =============================================
const MenuSection = () => {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  const menuItems = [
    {
      name: 'Ayam Geprek',
      desc: 'Ayam crispy dengan sambal pedas nendang',
      price: 'Rp 25.000',
      image: '/ayam-goreng.jpg',
      rating: 4.9,
      size: 'large',
    },
    {
      name: 'Nasi Goreng',
      desc: 'Nasi goreng spesial dengan telur mata sapi',
      price: 'Rp 22.000',
      image: '/nasi-goreng.jpg',
      rating: 4.8,
      size: 'medium',
    },
    {
      name: 'Mie Goreng',
      desc: 'Mie goreng lezat dengan topping melimpah',
      price: 'Rp 20.000',
      image: '/mie-goreng.jpg',
      rating: 4.7,
      size: 'medium',
    },
    {
      name: 'Sate Ayam',
      desc: 'Sate ayam bumbu kacang khas Madura',
      price: 'Rp 28.000',
      image: '/sate-ayam.jpg',
      rating: 4.9,
      size: 'medium',
    },
    {
      name: 'Rendang',
      desc: 'Rendang sapi empuk bumbu meresap',
      price: 'Rp 35.000',
      image: '/rendang.jpg',
      rating: 5.0,
      size: 'large',
    },
    {
      name: 'Gado-Gado',
      desc: 'Sayuran segar dengan bumbu kacang',
      price: 'Rp 18.000',
      image: '/gado-gado.jpg',
      rating: 4.6,
      size: 'small',
    },
    {
      name: 'Es Teler',
      desc: 'Minuman segar alpukat & kelapa',
      price: 'Rp 15.000',
      image: '/es-teler.jpg',
      rating: 4.8,
      size: 'small',
    },
  ];

  return (
    <section id="menu" ref={sectionRef} className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FFF8F0]" />
      <motion.div
        className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#E53935]/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#FFC107]/20 text-[#FF6F00] text-sm font-semibold mb-4">
            Menu Favorit
          </span>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A2E] mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Pilihan <span className="text-gradient">Terbaik</span> Kami
          </h2>
          <p className="text-lg text-[#4A4A5A] max-w-2xl mx-auto">
            Setiap hidangan disiapkan dengan penuh perhatian menggunakan bahan segar dan bumbu autentik
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`
                ${item.size === 'large' ? 'sm:col-span-2 sm:row-span-2' : ''}
                ${item.size === 'medium' ? 'sm:col-span-1' : ''}
                ${item.size === 'small' ? 'sm:col-span-1' : ''}
              `}
            >
              <TiltCard
                className="h-full rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-full group cursor-pointer">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                        <span className="text-white text-sm font-medium">{item.rating}</span>
                      </div>

                      {/* Name */}
                      <h3
                        className={`font-black text-white mb-1 ${item.size === 'large' ? 'text-3xl' : 'text-xl'}`}
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-white/80 text-sm mb-3 line-clamp-2">{item.desc}</p>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#FFC107] font-bold text-lg">{item.price}</span>

                        <motion.a
                          href="https://menu.samola.id/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white text-[#E53935] rounded-full text-sm font-bold flex items-center gap-1 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Pesan
                          <ArrowRight className="w-4 h-4" />
                        </motion.a>
                      </div>
                    </motion.div>
                  </div>

                  {/* Hot Badge */}
                  {item.rating >= 4.9 && (
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1 bg-[#E53935] text-white text-xs font-bold rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔥 BEST SELLER
                    </motion.div>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <MagneticButton
            href="https://menu.samola.id/"
            className="px-8 py-4 rounded-full bg-gradient-samola text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow inline-flex items-center gap-2"
          >
            <Utensils className="w-5 h-5" />
            Lihat Semua Menu
            <ChevronRight className="w-5 h-5" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

// =============================================
// CTA SECTION WITH LIQUID BACKGROUND
// =============================================
const CTASection = () => {
  const { ref: sectionRef, isVisible } = useIntersectionObserver();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-animated"
        style={{ y: backgroundY }}
      />

      {/* Liquid Shape Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20 text-6xl"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {['🌶️', '🍗', '🍛', '🥘', '🌿', '⭐'][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Promo Spesial Hari Ini!</span>
          </motion.div>

          {/* Headline */}
          <h2
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Lapar?
            <br />
            <span className="text-[#FFC107]">Samola</span> Solusinya!
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Pesan sekarang dan nikmati kelezatan masakan Indonesia autentik
            dengan pengantaran cepat via grab ke lokasi Anda.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              href="https://menu.samola.id/"
              className="px-10 py-5 rounded-full bg-white text-[#E53935] font-bold text-xl shadow-2xl hover:shadow-white/30 transition-shadow"
            >
              <Utensils className="w-6 h-6" />
              Pesan Sekarang
              <ChevronRight className="w-6 h-6" />
            </MagneticButton>

            <MagneticButton
              href="https://wa.me/6281234567890"
              className="px-8 py-5 rounded-full bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Hubungi Kami
            </MagneticButton>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80"
          >
            {[
              { icon: Clock, text: 'Pengantaran Cepat (Grab)' },
              { icon: Heart, text: 'Bahan Segar' },
              { icon: Star, text: '4.9 Rating' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <badge.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#1A1A2E"
            opacity="1"
          />
        </svg>
      </div>
    </section>
  );
};

// =============================================
// FOOTER SECTION
// =============================================
const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  const quickLinks = [
    { name: 'Menu', href: 'https://menu.samola.id/' },
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Lokasi', href: '#' },
    { name: 'Kontak', href: '#' },
  ];

  return (
    <footer className="bg-[#1A1A2E] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3
                className="text-4xl font-black mb-4"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span className="text-gradient">Samola</span>
              </h3>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                Makanan Indonesia autentik dengan cita rasa juara.
                Kami hadir untuk memanjakan lidah Anda dengan kelezatan Nusantara.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E53935] transition-colors group"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-4">Menu</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <motion.a
                      href={link.href}
                      className="text-white/70 hover:text-[#FFC107] transition-colors inline-flex items-center gap-2 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-0 h-0.5 bg-[#FFC107] group-hover:w-4 transition-all" />
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-4">Kontak</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E53935] mt-0.5 shrink-0" />
                  <span className="text-white/70"><span>Jl. Pariwisata, Berkas</span> Bengkulu</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#E53935] shrink-0" />
                  <a href="https://wa.me/+6285814534149" className="text-white/70 hover:text-[#FFC107] transition-colors">
                    +62 851-1759-1263
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#E53935] shrink-0" />
                  <span className="text-white/70">Setiap Hari: 09:00 - 23:00</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Samola. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#E53935] fill-[#E53935] animate-bounce" /> in Bengkulu (Prima Rasa Selaras)
          </p>
        </motion.div>
      </div>

      {/* Floating Decorations */}
      <motion.div
        className="absolute bottom-20 right-20 text-6xl opacity-10"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🍗
      </motion.div>
    </footer>
  );
};

// =============================================
// NAVIGATION COMPONENT
// =============================================
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#' },
    { name: 'Tentang', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'py-3 glass shadow-lg'
          : 'py-6 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}

            <motion.a
              href="#"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-13 h-13 rounded-xl bg-gradient-samola flex items-center justify-center p-1">
                <img src='./logo.png' />
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${isScrolled
                    ? 'text-[#4A4A5A] hover:text-[#E53935]'
                    : 'text-[#4A4A5A] hover:text-[#E53935]'
                    }`}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                </motion.a>
              ))}

              <MagneticButton
                href="https://menu.samola.id/"
                className="px-6 py-2.5 rounded-full bg-gradient-samola text-white text-sm font-bold shadow-lg"
              >
                Pesan
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            >
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 6 : 0 }}
                className="w-6 h-0.5 bg-[#1A1A2E] rounded-full"
              />
              <motion.span
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                className="w-6 h-0.5 bg-[#1A1A2E] rounded-full"
              />
              <motion.span
                animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -6 : 0 }}
                className="w-6 h-0.5 bg-[#1A1A2E] rounded-full"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-40 glass shadow-xl md:hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  className="block py-2 text-lg font-medium text-[#1A1A2E]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="https://menu.samola.id/"
                className="block w-full py-3 text-center rounded-full bg-gradient-samola text-white font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Pesan Sekarang
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// =============================================
// MAIN APP COMPONENT
// =============================================
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {/* Preloader */}
      <AnimatePresence>
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Noise Overlay for Texture */}
        <div className="noise-overlay" />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main>
          <HeroSection />
          <AboutSection />
          <MarqueeSection />
          <MenuSection />
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />
      </motion.div>
    </>
  );
}

export default App;
