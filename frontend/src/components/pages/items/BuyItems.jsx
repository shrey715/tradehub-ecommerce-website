import { Helmet } from 'react-helmet';
import { motion } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

import useItemStore from '../../../hooks/ItemStore';

import axios from 'axios';
import { backendUrl } from '../../../main';
import toast from 'react-hot-toast';

import { CiSearch } from 'react-icons/ci';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg transition-all duration-200"
      onClick={() => navigate(`/item/${item._id}`)}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 line-clamp-2">{item.name}</h2>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">₹{item.price}</p>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Seller: {item.seller_name}
        </p>
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
                            selectedCategories.some((cat) => item.category.includes(cat.toLowerCase()));

      return searchMatch && categoryMatch;
    });
  }, [search, selectedCategories, items]);

  useEffect(() => {
    setFilteredItems(filteredItems);
  }, [filteredItems, setFilteredItems]);

  return (
    <div className="sticky top-4 space-y-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mb-6">
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-2">
        <CiSearch className="text-xl text-zinc-500 dark:text-zinc-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
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
    console.log('BuyItems component mounted');
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const res = await axios.get(`${backendUrl}/api/items/all`, {
            headers: { Authorization: `Bearer ${token}` }
          });

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
  };

  return (
    <motion.div 
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>Buy Items | TradeHub</title>
      </Helmet>
      <div className="max-w-7xl mx-auto p-6">
        <FilterSection setFilteredItems={setFilteredItems} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
              No items found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BuyItems;