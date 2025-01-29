import { useState } from 'react';
import { Helmet } from "react-helmet";

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import axios from "axios";
import { backendUrl } from "../../../main";
import { convertToBase64 } from "../../../lib/convert";

import { motion } from "framer-motion";
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
]

const SellItem = () => {
  const [item, setItem] = useState({
    name: '',
    price: '',
    description: '',
    category: [],
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || image.length === 0) {
      toast.error("Please upload an image");
      return;
    }

    if (item.category.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    if (item.price <= 0) {
      toast.error("Price must be greater than 0");
      return
    }

    if (item.stock <= 0) {
      toast.error("Stock must be greater than 0");
      return
    }

    const formData = new FormData();
    for (const key in item) {
      formData.append(key, item[key]);
    }
    formData.append("image", image[0].file); 

    try {
      setIsLoading(true);
      const base64Image = await convertToBase64(image[0].file);
      const category = item.category.join(",");
      const formData = { ...item, image: base64Image, category };

      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(`${backendUrl}/api/items`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Item added successfully!");
        setItem({
          name: '',
          price: '',
          description: '',
          category: [],
        });
        setImage(null);
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Sell | TradeHub</title>
      </Helmet>
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Create Listing
            </h1>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={item.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows="4"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
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
                    value={item.stock}
                    onChange={handleInputChange}
                    placeholder="Enter stock quantity"
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <label 
                        key={category}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          value={category}
                          checked={item.category.includes(category)}
                          onChange={handleCategoryChange}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:checked:bg-zinc-600"
                        />
                        <span className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className={"w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 rounded-md transition-colors" + (isLoading ? " cursor-not-allowed" : "")}
              >
                {isLoading ? "Listing item..." : "List Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellItem;