import axios from 'axios';
import { backendUrl } from '../../../main';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

import { Helmet } from 'react-helmet';
import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';

import toast from 'react-hot-toast';
import Loading from '../../common/loading';

import useCartStore from '../../../hooks/CartStore';

const ItemPage = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success('Item added to cart');
  };

  const handleBuyNow = () => {
    addToCart(item);
    navigate('/user/cart');
    toast.success('Item added to cart');
  };

  useEffect(() => {
    console.log('ItemPage component mounted');
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!id) {
          toast.error('Item ID not found');
          return;
        }
        
        if (token) {
          const res = await axios.get(`${backendUrl}/api/items/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if(res.data.success) {
            setItem(res.data.item);
          } else {
            toast.error('Item not found');
          }
        } else {
          toast.error('Unauthorized');
        }
      } catch (error) {
        console.error('Error fetching item:', error.message);
        toast.error('Internal server error');
      }
    };

    fetchItem();
  }, [id]);

  const seller = useMemo(() => {
    if (item && item.seller) {
      return item.seller;
    }
    return null;
  }, [item]);

  if (!item || !seller) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className='w-full h-full p-4'
    >
      <Helmet>
        <title>Buy {item.name} | TradeHub</title>
      </Helmet>
      <div className='flex flex-col md:flex-row justify-between h-full'>
        <div className='flex justify-center items-center w-full md:w-1/2 h-full'>
          <img src={`https://picsum.photos/seed/${item._id}/720`} alt={item.name} className='w-full md:h-full md:w-auto object-cover' />
        </div>
        <div className='flex flex-col justify-start items-end w-full md:w-1/2 h-full p-4 gap-3 overflow-y-scroll'>
          <div className='text-right'>
            <h1 className='text-5xl font-bold break-words'>{item.name}</h1>
            <p className='text-3xl font-semibold break-words'>&#8377;{item.price}</p>
          </div>
          <div className='flex flex-col justify-start gap-2 w-full text-xl border border-zinc-900 p-2'>
            <div className='flex justify-start gap-2 w-full text-xl'>
                <span>Item Description:</span>
                <p className="font-light break-words">{item.description}</p>
            </div>
            <div className='flex justify-start gap-2 w-full text-xl'>
                <span>Category:</span>
                <p className="font-light break-words">{item.category.join(', ')}</p>
            </div>  
          </div>
          <div className='flex flex-col justify-start gap-2 w-full text-xl border border-zinc-900 p-2'>
            <h1 className='text-2xl font-semibold text-left'>Seller Details</h1>
            <div className='flex justify-start gap-2 w-full text-xl'>
              <span>Seller:</span>
              <p className="font-light break-words">{seller.name}</p>
            </div>
            <div className='flex justify-start gap-2 w-full text-xl'>
              <span>Contact:</span>
              <p className="font-light break-words">{seller.contact_no}</p>
            </div>
            <div className='flex justify-start gap-2 w-full text-xl'>
              <span>Email:</span>
              <p className="font-light break-words">{seller.email}</p>
            </div>
          </div>
          <div className='flex justify-center items-center w-full mt-3'>
            <button onClick={handleAddToCart} className='bg-white text-zinc-900 font-semibold py-2 px-4 border border-zinc-900 hover:bg-zinc-200 transition-colors duration-75 w-1/2'>Add to Cart</button>
            <button onClick={handleBuyNow} className='bg-zinc-900 text-white font-semibold py-2 px-4 border border-zinc-900 hover:bg-zinc-700 transition-colors duration-75 w-1/2'>Buy Now</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ItemPage;