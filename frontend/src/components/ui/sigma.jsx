import { motion } from "framer-motion";

const Sigma = () => {
  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      >
        <img src="/video/sigma-boy.gif" alt="Sigma GIF" className="max-w-full max-h-full" />
      </motion.div>
  );
};

export default Sigma;