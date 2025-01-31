import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CiCircleRemove } from 'react-icons/ci';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import axiosInstance from '../../lib/api';
import PropTypes from 'prop-types';

import toast from 'react-hot-toast';
import { convertToBase64 } from '../../lib/convert';

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageResize
);

const categories = [
  'Clothing', 'Entertainment', 'Electronics', 'Food', 
  'Furniture', 'Health & Beauty', 'Stationery', 'Tools', 'Other',
];

const EditListingModal = ({ listing, setEditMode, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: listing.name,
    price: listing.price,
    description: listing.description,
    stock: listing.stock,
    category: listing.category
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setEditMode(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      category: checked 
        ? [...prev.category, value]
        : prev.category.filter(cat => cat !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.price <= 0 || formData.stock <= 0) {
      toast.error("Price and stock must be greater than 0");
      return;
    }
  
    setIsLoading(true);
  
    try {
      let imageData = null;
      if (image && image[0]) {
        imageData = await convertToBase64(image[0].file);
      }
  
      const categoryString = formData.category.join(',');
  
      const updateData = {
        ...formData,
        category: categoryString,
        ...(imageData && { image: imageData })
      };
      
      const response = await axiosInstance.patch(
        `/api/items/${listing._id}`,
        updateData,
      );
  
      if (response.data.success) {
        toast.success('Listing updated successfully');
        onUpdate(response.data.item);
        handleClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Edit Listing
              </h2>
              <button
                onClick={handleClose}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <CiCircleRemove size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="space-y-4">
                <FilePond 
                  files={image}
                  onupdatefiles={setImage}
                  allowMultiple={false}
                  maxFiles={1}
                  name="image"
                  labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                  imagePreviewHeight={window.innerWidth < 640 ? 150 : 200}
                  imageCropAspectRatio="1:1"
                  imageResizeTargetWidth={400}
                  imageResizeMode="contain"
                  className="max-w-full"
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Categories
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <label key={category} className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={category}
                          checked={formData.category.includes(category)}
                          onChange={handleCategoryChange}
                          className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                        />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Listing'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

EditListingModal.propTypes = {
  listing: PropTypes.object.isRequired,
  setEditMode: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default EditListingModal;