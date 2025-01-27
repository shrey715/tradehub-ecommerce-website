import { Helmet } from 'react-helmet';
import { motion } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

import useItemStore from '../../../hooks/ItemStore';
import Item from '../../../../../backend/src/models/Item';

import axios from 'axios';
import { backendUrl } from '../../../main';
import toast from 'react-hot-toast';

import { CiSearch } from 'react-icons/ci';
import Loading from '../../common/loading';

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
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className='flex flex-col justify-start items-center w-full h-fit p-0 bg-white text-zinc-900 border border-zinc-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer'
      onClick={() => navigate(`/item/${item._id}`)}
    >
      <img src={`https://picsum.photos/seed/${item._id}/200/300`} alt={item.name} className='w-full h-64 object-cover' />
      <div className='flex flex-row justify-between items-center w-full h-fit gap-2 px-4 pt-2'>
        <h2 className='text-lg font-normal break-words'>{item.name}</h2>
        <h3 className='text-lg font-semibold'>&#8377;{item.price}</h3>
      </div>
      <div className='flex flex-row justify-start items-center w-full h-fit gap-2 px-4 pb-2'>
        <span className='text-lg font-light'>Seller:</span>
        <p className='text-lg font-normal break-words'>{item.seller_name}</p>
      </div>
    </motion.div>
  );
}

ItemCard.propTypes = {
  item: Item.isRequired,
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 w-full">
        <CiSearch className="text-2xl" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 border border-zinc-900 p-2">
        <span className="text-lg font-normal">Categories:</span>
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`cursor-pointer p-2 border border-zinc-900 ${
              selectedCategories.includes(category)
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-900'
            }`}
          >
            {category}
          </div>
        ))}
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
      className='w-full h-full p-2'
    >
      <Helmet>
        <title>Items | TradeHub</title>
      </Helmet>
      <div className="flex flex-col justify-start px-6 w-full h-full gap-5">
        <FilterSection setFilteredItems={setFilteredItems} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}    
        </div>  
        {filteredItems.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full h-full gap-4">
            <h1 className="text-4xl font-bold">No items found</h1>
            <p className="text-lg font-normal">Either try changing the search query or category or wait for items to be put up for sale.</p>
          </div>
        )}      
      </div>
    </motion.div>
  )
}

export default BuyItems;