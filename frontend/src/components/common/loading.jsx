import { motion } from 'framer-motion';
import { CgSpinnerTwoAlt } from "react-icons/cg";

import { Helmet } from 'react-helmet';

const Loading = () => {
    return (
        <motion.div 
            className="fixed inset-0 top-0 left-0 flex flex-col justify-center items-center text-center w-screen h-screen p-8 gap-5 bg-white bg-opacity-75 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Helmet>
                <title>Loading... | TradeHub</title>
            </Helmet>
            <CgSpinnerTwoAlt className="text-5xl text-zinc-900 animate-spin" />
            <h1 className="text-3xl font-bold">
                Loading...
            </h1>
            <p className="text-lg text-zinc-900">
                Please wait while we fetch the data.
            </p>
        </motion.div>
    );
}

export default Loading;