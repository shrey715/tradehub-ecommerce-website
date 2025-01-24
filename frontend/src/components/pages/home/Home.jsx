import { Helmet } from "react-helmet";

import { Link } from "react-router";

import { motion } from "motion/react";

import { FaAngleRight } from "react-icons/fa";

const Home = () => {
    return (
      <motion.main 
        className="flex flex-col lg:flex-row h-full snap-y snap-mandatory overflow-y-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Helmet>
          <title>Home | TradeHub</title>
        </Helmet>
        <section className="flex flex-col justify-center items-center lg:w-1/2 bg-zinc-900 p-10 font-rubik text-zinc-100 font-bold text-6xl h-screen snap-start">
          <span className="md:w-2/3 lg:w-3/4 text-center lg:text-left text-5xl md:text-7xl">
            Tired of being spammed on Whatsapp with a million messages on Buy-Sell-Rent?
          </span>
        </section>
        <section className="flex flex-col justify-center items-center lg:w-1/2 bg-zinc-200 p-10 text-zinc-900 h-screen snap-start">
          <div className="md:w-2/3 lg:w-3/4 text-center lg:text-right">
            <span className="font-cursive text-4xl md:text-5xl mb-4 block">
              Presenting to you
            </span>
            <span className="font-title text-7xl md:text-8xl mb-4 block">
              TradeHub
            </span>
            <span className="font-sans text-2xl lg:text-3xl mb-8 block">
              A DASS Initiative
            </span>
            <div className="flex justify-center lg:justify-end space-x-4 text-lg md:text-xl lg:text-2xl">
              <Link to="/user/profile">
                <motion.button 
                  className="px-4 py-2 bg-zinc-900 text-zinc-100 rounded-md hover:bg-zinc-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue <FaAngleRight className="inline-block" />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </motion.main>
    );
}

export default Home;