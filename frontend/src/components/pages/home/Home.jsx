import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router";
import { motion } from "motion/react";
import { FaAngleRight, FaNodeJs, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb } from "react-icons/si";

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = useMemo(() => ['hero', 'features', 'join'], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sections.length]);

  useEffect(() => {
    const element = document.getElementById(sections[currentSection]);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSection, sections]);

  return (
    <motion.main 
      className="flex flex-col snap-y snap-mandatory overflow-y-scroll relative h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>TradeHub | IIIT Marketplace</title>
      </Helmet>

      <section id="hero" className="flex flex-col justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 sm:px-6 md:px-10 py-20 text-zinc-100 min-h-screen snap-start relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10 text-center">
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-title font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            TradeHub
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-400 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The Official IIIT Marketplace
          </motion.p>
        </div>
      </section>

      <section id="features" className="flex flex-col justify-center items-center bg-gradient-to-br from-zinc-100 to-white px-4 sm:px-6 md:px-10 py-20 min-h-screen snap-start relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div 
            className="space-y-6 sm:space-y-8"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">Meet Your Assistant</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-600">
                Say hello to Nagu the Froggie, your friendly marketplace guide. From finding the perfect item to handling transactions, Nagu&apos;s got you covered.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                className="p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold text-zinc-900">No Fees</h3>
                <p className="text-zinc-600">Zero transaction costs, always.</p>
              </motion.div>
              <motion.div 
                className="p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold text-zinc-900">Secure</h3>
                <p className="text-zinc-600">Safe and verified transactions.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="relative mt-8 md:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-3xl" />
            <img 
              src="/images/frog.png" 
              alt="Nagu" 
              className="w-48 h-48 sm:w-64 sm:h-64 mx-auto relative z-10 drop-shadow-2xl" 
            />
          </motion.div>
        </div>
      </section>

      <section id="join" className="flex flex-col justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 sm:px-6 md:px-10 py-20 min-h-screen snap-start relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 text-center relative z-10">
          <motion.div 
            className="space-y-6 sm:space-y-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Start Trading Today</h2>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Join the IIIT marketplace community. Buy, sell, and trade with your peers.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/auth/register"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-all font-medium text-base sm:text-lg shadow-lg"
              >
                Get Started
                <FaAngleRight className="text-xl" />
              </Link>
            </motion.div>

            <div className="pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 items-center">
              <motion.div 
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <SiMongodb className="text-xl sm:text-2xl" /> 
                <span className="text-sm sm:text-base">MongoDB</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <SiExpress className="text-xl sm:text-2xl" /> 
                <span className="text-sm sm:text-base">Express</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <FaReact className="text-xl sm:text-2xl" /> 
                <span className="text-sm sm:text-base">React</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <FaNodeJs className="text-xl sm:text-2xl" /> 
                <span className="text-sm sm:text-base">Node.js</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 sm:gap-2 z-50">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => setCurrentSection(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-emerald-500 scale-150' 
                : 'bg-zinc-400 hover:bg-emerald-400 hover:scale-125'
            }`}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>

      <footer className="fixed bottom-0 w-full py-2 sm:py-4 text-center text-xs sm:text-sm text-zinc-500 z-50">
        Made by Shreyas Deb
      </footer>
    </motion.main>
  );
};

export default Home;