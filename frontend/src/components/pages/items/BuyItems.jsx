import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

import useItemStore from '../../../hooks/ItemStore';

import axiosInstance from '../../../lib/api';
import toast from 'react-hot-toast';

import { CiSearch, CiFilter, CiShoppingCart } from 'react-icons/ci';
import Loading from '../common/Loading';

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

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-md cursor-pointer transition-all duration-300"
      onClick={() => navigate(`/item/${item._id}`)}
    >
      <div className="aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800/30">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
            {item.name}
          </h2>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap ml-2">₹{item.price}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            By {item.seller_name}
          </p>
          
          <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white transition-all duration-200">
            <CiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    seller_name: PropTypes.string.isRequired,
    seller_id: PropTypes.string.isRequired
  }).isRequired
};

const FilterSection = ({ setFilteredItems }) => {
  const { items } = useItemStore();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category];
      return newCategories;
    });
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.price.toString().includes(search) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.seller_name.toLowerCase().includes(search.toLowerCase());
      const categoryMatch = selectedCategories.length === 0 || 
                            selectedCategories.some((cat) => 
                              item.category.map(c => c.toLowerCase()).includes(cat.toLowerCase())
                            );

      return searchMatch && categoryMatch;
    });
  }, [search, selectedCategories, items]);

  useEffect(() => {
    setFilteredItems(filteredItems);
  }, [filteredItems, setFilteredItems]);

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md p-3 mb-4 -mx-6 px-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 py-2 px-4 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm font-medium"
          >
            <CiFilter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Mobile filter panel */}
      {isMobileFilterOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden mb-6 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden"
        >
          <h3 className="font-medium text-sm mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-4 space-y-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <div>
          <h3 className="font-medium text-sm mb-3">Search</h3>
          <div className="relative">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-sm mb-3">Categories</h3>
          <div className="space-y-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex w-full items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                }`}
              >
                <span className={`mr-2 w-2 h-2 rounded-full ${
                  selectedCategories.includes(category)
                    ? 'bg-indigo-500 dark:bg-indigo-400' 
                    : 'bg-zinc-300 dark:bg-zinc-600'
                }`} />
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

FilterSection.propTypes = {
  setFilteredItems: PropTypes.func.isRequired,
};

const BuyItems = () => {
  const { setItems } = useItemStore();
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const res = await axiosInstance.get('/api/items/all');

          if (res.data.success) {
            setItems(res.data.items);
            setFilteredItems(res.data.items);
          } else {
            toast.error('Items not found');
          }
        } else {
          toast.error('Unauthorized');
        }
      } catch (error) {
        console.error('Error fetching items:', error.message);
        toast.error('Internal server error');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [setItems]);

  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950 min-h-screen"
    >
      <Helmet>
        <title>Browse Items | TradeHub</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">Browse Items</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">Discover unique items from your campus community</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter column */}
          <div className="lg:w-1/4 space-y-4">
            <FilterSection setFilteredItems={setFilteredItems} />
          </div>
          
          {/* Items grid column */}
          <div className="lg:w-3/4">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="w-16 h-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <CiSearch className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  No items found
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
                  Try adjusting your filters or search criteria to find what you&apos;re looking for
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BuyItems;