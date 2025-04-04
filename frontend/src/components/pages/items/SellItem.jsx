import { useState } from 'react';
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Link } from 'react-router';

import axiosInstance from '../../../lib/api';
import { convertToBase64 } from "../../../lib/convert";
import toast from "react-hot-toast";

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize
);

const categories = [
  'Clothing',
  'Entertainment',
  'Electronics',
  'Food',
  'Furniture',
  'Health & Beauty',
  'Stationery',
  'Tools',
  'Other',
];

const SellItem = () => {
  const [item, setItem] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: [],
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submissionResult, setSubmissionResult] = useState(null); // 'success' or 'error'
  const [itemId, setItemId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setItem((prev) => {
      const newCategories = checked
        ? [...prev.category, value]
        : prev.category.filter((category) => category !== value);
      return { ...prev, category: newCategories };
    });
  };

  const validateStep1 = () => {
    if (!item.name) {
      toast.error("Please enter item name");
      return false;
    }
    if (!item.description) {
      toast.error("Please enter description");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!item.price || parseFloat(item.price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!item.stock || parseInt(item.stock) <= 0) {
      toast.error("Please enter a valid stock quantity");
      return false;
    }
    if (item.category.length === 0) {
      toast.error("Please select at least one category");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const resetForm = () => {
    setItem({
      name: '',
      price: '',
      description: '',
      stock: '',
      category: [],
    });
    setImage(null);
    setStep(1);
    setSubmissionResult(null);
    setItemId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    if (!image || image.length === 0) {
      toast.error("Please upload an image");
      return;
    }

    setIsLoading(true);

    try {
      const base64Image = await convertToBase64(image[0].file);
      const category = item.category.join(",");
      const formData = { ...item, image: base64Image, category };

      const response = await axiosInstance.post(`/api/items`, formData);

      if (response.data.success) {
        setSubmissionResult('success');
        setItemId(response.data.item._id);
        toast.success("Item added successfully!");
      } else {
        setSubmissionResult('error');
        toast.error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("An error occurred");
      setSubmissionResult('error');
    } finally {
      setIsLoading(false);
      setStep(3);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12"
    >
      <Helmet>
        <title>Create Listing | TradeHub</title>
      </Helmet>
      
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Create New Listing
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Sell your items to the campus community
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${
                step > 1 
                  ? 'bg-zinc-900' 
                  : 'bg-zinc-200 dark:bg-zinc-700'
              }`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${
                step > 2 
                  ? 'bg-zinc-900' 
                  : 'bg-zinc-200 dark:bg-zinc-700'
              }`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3 
                  ? submissionResult === 'success' 
                    ? 'bg-green-600 text-white' 
                    : submissionResult === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-900 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
              }`}>
                3
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 space-y-6"
                >
                  <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Basic Details</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Item Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={item.name}
                        onChange={handleInputChange}
                        placeholder="Enter a descriptive name"
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-700-500 dark:focus:ring-zinc-700-400 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Description*
                      </label>
                      <textarea
                        name="description"
                        value={item.description}
                        onChange={handleInputChange}
                        placeholder="Describe your item in detail"
                        rows="5"
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-700-500 dark:focus:ring-zinc-700-400 transition-all"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Item Image*
                      </label>
                      <FilePond 
                        files={image}
                        onupdatefiles={setImage}
                        allowMultiple={false}
                        maxFiles={1}
                        name="image"
                        labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                        imagePreviewHeight={200}
                        imageCropAspectRatio="1:1"
                        imageResizeTargetWidth={400}
                        imageResizeMode="contain"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-700-700 text-white font-medium rounded-lg shadow-sm transition duration-200"
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Pricing & Categories */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 space-y-6"
                >
                  <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">Pricing & Categories</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Price (₹)*
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">₹</span>
                        <input
                          type="number"
                          name="price"
                          value={item.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-700-500 dark:focus:ring-zinc-700-400 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Available Stock*
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={item.stock}
                        onChange={handleInputChange}
                        placeholder="Quantity available"
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-700-500 dark:focus:ring-zinc-700-400 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Categories* (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <label 
                          key={category}
                          className={`flex items-center px-4 py-3 rounded-lg border transition-all ${
                            item.category.includes(category)
                              ? 'border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm' 
                              : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                          } cursor-pointer`}
                        >
                          <div className={`w-5 h-5 mr-3 flex-shrink-0 rounded-sm border transition-colors ${
                            item.category.includes(category)
                              ? 'bg-zinc-800 border-zinc-800 dark:bg-zinc-700 dark:border-zinc-700' 
                              : 'border-zinc-300 dark:border-zinc-600'
                          }`}>
                            {item.category.includes(category) && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            value={category}
                            checked={item.category.includes(category)}
                            onChange={handleCategoryChange}
                            className="sr-only"
                          />
                          <span className={`text-sm ${
                            item.category.includes(category) 
                              ? 'font-medium text-zinc-900 dark:text-zinc-50' 
                              : 'text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium rounded-lg transition duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-700-700 disabled:bg-zinc-700-400 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : "Create Listing"}
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Result */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 py-16 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: submissionResult === 'success' ? [0, 10, -10, 0] : 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 20,
                      duration: 0.5
                    }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                      submissionResult === 'success' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}
                  >
                    {submissionResult === 'success' ? (
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 text-green-600 dark:text-green-400" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </motion.svg>
                    ) : (
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-12 w-12 text-red-600 dark:text-red-400" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </motion.svg>
                    )}
                  </motion.div>
                  
                  <h2 className={`text-2xl font-medium mb-2 ${
                    submissionResult === 'success' 
                      ? 'text-zinc-900 dark:text-zinc-50' 
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {submissionResult === 'success' 
                      ? 'Listing Created Successfully!' 
                      : 'Listing Creation Failed'}
                  </h2>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
                    {submissionResult === 'success' 
                      ? 'Your item has been successfully listed on TradeHub and is now available for others to see and purchase.' 
                      : 'There was an error creating your listing. Please try again or contact support if the problem persists.'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {submissionResult === 'success' ? (
                      <>
                        <Link
                          to="/user/my-listings"
                          className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          View My Listings
                        </Link>
                        
                        {itemId && (
                          <Link
                            to={`/item/${itemId}`}
                            className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            View Listing
                          </Link>
                        )}
                        
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          Create Another Listing
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Try Again
                        </button>
                        
                        <Link
                          to="/user/my-listings"
                          className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          Back to My Listings
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellItem;