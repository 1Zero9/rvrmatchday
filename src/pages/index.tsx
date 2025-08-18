import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

export default function Home() {
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const carouselImages = [
    {
      src: "/images/homepg-image1.jpg",
      alt: "Football Action 1",
      title: "Join Our Football Family",
      subtitle: "Where Champions Are Made"
    },
    {
      src: "/images/homepg-image2.jpg", 
      alt: "Football Action 2",
      title: "Training Excellence",
      subtitle: "Developing Skills & Character"
    },
    {
      src: "/images/homepg-image3.jpg",
      alt: "Football Action 3", 
      title: "Community Spirit",
      subtitle: "Building Friendships Through Football"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const audiences = [
    {
      title: "Join Our Club",
      description: "Register your child for football training and matches",
      icon: "⚽",
      color: "bg-white",
      textColor: "text-gray-900",
      descriptionColor: "text-gray-700",
      href: "/join",
      cta: "Register Now"
    },
    {
      title: "Members Portal", 
      description: "Access your team info, match schedules, and club updates",
      icon: "🏆",
      color: "bg-white",
      textColor: "text-gray-900",
      descriptionColor: "text-gray-700",
      href: "/members/login",
      cta: "Member Login"
    },
    {
      title: "Kids Zone",
      description: "Fun games, achievements, and football challenges for young players",
      icon: "🎮",
      color: "bg-white",
      textColor: "text-gray-900",
      descriptionColor: "text-gray-700",
      href: "/kids",
      cta: "Play Now!"
    }
  ];

  const quickStats = [
    { label: "Active Players", value: "150+", icon: "👥" },
    { label: "Teams", value: "12", icon: "⚽" },
    { label: "Years Active", value: "15+", icon: "📅" },
    { label: "Trophies Won", value: "25", icon: "🏆" }
  ];

  return (
    <Layout currentSection="public">
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image.src})` }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            key={currentSlide}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display mb-6 drop-shadow-lg">
              RIVERVALLEY RANGERS AFC
            </h1>
            <h2 className="text-2xl md:text-3xl mb-4 drop-shadow-md">
              {carouselImages[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
              {carouselImages[currentSlide].subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/join"
                className="bg-accent-pink hover:bg-accent-pink/90 text-white px-8 py-4 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Join the Club
              </Link>
              <Link 
                href="/about"
                className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-xl font-bold transition-all shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
        >
          →
        </button>
      </section>

      {/* Audience Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display text-gray-900 mb-6">
              Choose Your Experience
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Whether you&apos;re joining us for the first time, a current member, or one of our young stars, 
              we have something special designed just for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {audiences.map((audience, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`${audience.color} rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="text-4xl mb-4">{audience.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${audience.textColor}`}>
                  {audience.title}
                </h3>
                <p className={`mb-6 ${audience.descriptionColor}`}>
                  {audience.description}
                </p>
                <Link
                  href={audience.href}
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  {audience.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-lg p-6 shadow-md"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1 text-gray-900">{stat.value}</div>
                <div className="text-gray-700">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display text-gray-900 mb-4">
              Latest News
            </h2>
            <p className="text-gray-700">Stay up to date with club announcements and match results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sample news cards - you'll populate these from your database */}
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: item * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Sample News Title</h3>
                  <p className="text-gray-700 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit&hellip;
                  </p>
                  <Link href="#" className="text-blue-700 hover:text-blue-800 font-semibold hover:underline">
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/news"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md"
            >
              View All News
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
