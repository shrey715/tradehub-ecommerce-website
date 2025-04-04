import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaAngleRight, FaNodeJs, FaReact, FaArrowDown } from "react-icons/fa";
import { SiExpress, SiMongodb, SiTailwindcss } from "react-icons/si";

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = useMemo(() => ['hero', 'features', 'join'], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 8000);
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

      {/* Hero Section */}
      <section 
        id="hero" 
        className="flex flex-col justify-center items-center bg-zinc-900 px-5 sm:px-6 md:px-10 py-20 text-zinc-100 min-h-screen snap-start relative overflow-hidden"
      >
        {/* Background grid animation */}
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
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Floating gradient blobs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/20 blur-[80px]"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-zinc-400/10 blur-[100px]"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 20, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10 text-center">
          <div className="flex flex-col items-center gap-6">
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-title font-bold tracking-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100">
                TradeHub
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              The seamless marketplace for IIIT students to buy, sell, and exchange goods on campus
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-8 items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/auth/register"
                className="px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg font-medium shadow-lg shadow-zinc-900/20 hover:shadow-zinc-900/30 flex items-center justify-center transition-all duration-300"
              >
                <span>Get Started</span>
                <FaAngleRight className="ml-2 text-sm" />
              </Link>

              <Link
                to="/item/all"
                className="px-8 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-white rounded-lg transition-colors flex items-center justify-center"
              >
                Browse Items
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-5 h-10 rounded-full border-2 border-zinc-500 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <button 
            onClick={() => setCurrentSection(1)}
            className="mt-2 text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Scroll</span>
            <FaArrowDown className="text-[10px]" />
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className="flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-900 px-5 sm:px-6 md:px-10 py-24 min-h-screen snap-start relative"
      >
        {/* Background subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "url('/backgrounds/grid.svg')" }} 
        />
        
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mx-auto mb-12 md:mb-20">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              A Better Way to Trade
            </motion.h2>
            <motion.p 
              className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              TradeHub simplifies campus commerce with secure transactions, zero fees, and a friendly interface
            </motion.p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div 
              className="space-y-8 md:col-span-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div 
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700/50"
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 mb-4 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Zero Fees</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">No commission or transaction costs ever - keep all your profits.</p>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700/50"
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ delay: 0.05 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 mb-4 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Secure</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">Verified campus users only with secure face-to-face transactions.</p>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700/50"
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 mb-4 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Smart</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">AI-assisted listing descriptions and intelligent search features.</p>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-700/50"
                  whileHover={{ y: -5, scale: 1.01 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 mb-4 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 20.25h-15a1.5 1.5 0 001.5-1.5v-10.5a1.5 1.5 0 011.5-1.5h14.25" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Simple</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">Post your item in seconds with our streamlined listing process.</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-6 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl rounded-3xl" />
                <div className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700/70 rounded-3xl p-6 md:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
                      <img 
                        src="/images/frog.png" 
                        alt="Nagu" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Nagu</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Assistant</p>
                    </div>
                  </div>
                  
                  <p className="p-4 bg-green-50 dark:bg-green-900/10 rounded-t-xl rounded-br-xl rounded-bl-sm text-zinc-700 dark:text-zinc-300 text-sm mb-4 border border-green-100 dark:border-green-900/20">
                    Ribbit! I am Nagu, your TradeHub assistant! 🐸 How can I help you find or sell items today?
                  </p>

                  <div className="text-right">
                    <p className="inline-block p-4 bg-indigo-600 text-white rounded-t-xl rounded-bl-xl rounded-br-sm text-sm">
                      I want to sell my old textbooks
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <span className="text-xs">Photo</span>
                    </div>
                    
                    <button className="px-4 py-2 bg-zinc-800 text-white text-sm rounded-full">
                      Send
                    </button>
                  </div>
                </div>

                <motion.div
                  className="absolute -bottom-6 -right-6 w-24 h-24 z-[-1]"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <img 
                    src="/images/frog.png" 
                    alt="Nagu" 
                    className="w-full h-full object-contain drop-shadow-xl" 
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section 
        id="join" 
        className="flex flex-col justify-center items-center bg-zinc-900 px-5 sm:px-6 md:px-10 py-24 min-h-screen snap-start relative overflow-hidden"
      >
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
            backgroundSize: '40px 40px'
          }}
        />

        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 text-center relative z-10">
          <motion.div 
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Join the TradeHub Community</h2>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
              Connect with fellow IIIT students to buy, sell, and trade with ease. Start making smarter transactions today.
            </p>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-block"
            >
              <Link 
                to="/auth/register"
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-900 hover:from-white hover:to-white rounded-lg shadow-lg shadow-zinc-900/30 hover:shadow-zinc-900/40 font-medium text-base sm:text-lg transition-all duration-300"
              >
                Create Your Account
                <FaAngleRight className="text-lg" />
              </Link>
            </motion.div>

            <div className="pt-16 grid grid-cols-2 md:grid-cols-5 gap-6 items-center max-w-3xl mx-auto">
              <motion.div 
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <SiMongodb className="text-2xl sm:text-3xl" /> 
                <span className="text-xs sm:text-sm">MongoDB</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <SiExpress className="text-2xl sm:text-3xl" /> 
                <span className="text-xs sm:text-sm">Express</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <FaReact className="text-2xl sm:text-3xl" /> 
                <span className="text-xs sm:text-sm">React</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <FaNodeJs className="text-2xl sm:text-3xl" /> 
                <span className="text-xs sm:text-sm">Node.js</span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors col-span-2 md:col-span-1"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <SiTailwindcss className="text-2xl sm:text-3xl" /> 
                <span className="text-xs sm:text-sm">Tailwind</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Star pattern decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 3 + Math.random() * 5, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </section>

      {/* Floating navigation dots */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => setCurrentSection(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-white scale-125' 
                : 'bg-zinc-500 hover:bg-zinc-300 hover:scale-110'
            }`}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>

      <footer className="fixed bottom-0 w-full py-3 sm:py-4 text-center text-xs sm:text-sm text-zinc-500 z-50 backdrop-blur-sm bg-black/10">
        Made with ❤️ by Shreyas Deb
      </footer>
    </motion.main>
  );
};

export default Home;