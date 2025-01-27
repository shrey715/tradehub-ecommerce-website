import { Helmet } from "react-helmet";
import { Link } from "react-router";
import { motion } from "motion/react";
import { FaAngleRight, FaNodeJs, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb } from "react-icons/si";

const Home = () => {
  return (
    <motion.main 
      className="flex flex-col snap-y snap-mandatory overflow-y-scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Home | TradeHub</title>
      </Helmet>

      <section className="flex flex-col justify-center items-center bg-zinc-900 p-10 text-zinc-100 min-h-screen snap-start">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No More WhatsApp Tax on Buy-Sell Groups
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Say goodbye to the 10% transaction tax on WhatsApp Buy-Sell groups.
            Welcome to your dedicated IIIT marketplace.
          </motion.p>
        </div>
      </section>

      <section className="flex flex-col justify-center items-center bg-zinc-100 p-10 min-h-screen snap-start">
        <div className="max-w-6xl mx-auto space-y-12 text-center">
          <div className="space-y-4">
            <motion.h2 
              className="text-5xl md:text-7xl font-title font-bold text-zinc-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              TradeHub
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-zinc-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              A secure, tax-free marketplace exclusively for the IIIT community
            </motion.p>
          </div>

          <motion.div 
            className="flex flex-wrap justify-center gap-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 text-zinc-600">
              <SiMongodb size={24} /> MongoDB
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <SiExpress size={24} /> Express
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <FaReact size={24} /> React
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <FaNodeJs size={24} /> Node.js
            </div>
          </motion.div>

          <motion.div 
            className="pt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/auth/register">
              <motion.button 
                className="px-8 py-4 bg-zinc-900 text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors text-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <FaAngleRight className="inline-block ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}

export default Home;