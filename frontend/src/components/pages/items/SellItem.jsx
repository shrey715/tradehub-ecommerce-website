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
    }
  };

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="w-full h-full p-2"
    >
      <Helmet>
        <title>Sell | TradeHub</title>
      </Helmet>
      <div className="px-6 w-full h-full">
        <h2 className="text-3xl font-light text-left">Sell Item</h2>
        <hr className="my-4 border-t border-gray-300" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full md:w-3/4 lg:w-1/2 mx-auto pb-10">
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
          />
          <label className="font-sans font-normal text-zinc-900">Item Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleInputChange}
            placeholder="Item Name"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <label className="font-sans font-normal text-zinc-900">Price</label>
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <label className="font-sans font-normal text-zinc-900">Description</label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <label className="font-sans font-normal text-zinc-900">Stock</label>
          <input
            type="number"
            name="stock"
            value={item.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <label className="font-sans font-normal text-zinc-900">Categories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 font-sans font-light text-zinc-900">
                <input
                  type="checkbox"
                  value={category}
                  checked={item.category.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors font-sans font-normal"
          >
            Submit
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SellItem;