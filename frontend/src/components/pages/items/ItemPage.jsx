import axios from 'axios';
import { backendUrl } from '../../../main';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { CgSpinnerTwoAlt as LoadingIcon } from 'react-icons/cg';

import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import toast from 'react-hot-toast';
import Loading from '../../common/loading';

const ItemPage = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (quantity > item.stock) {
      toast.error('Quantity exceeds stock');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('jwtToken');
    try {
      const res = await axios.post(`${backendUrl}/api/cart/add-to-cart`, {
        item_id: item._id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success('Item added to cart');
      } else {
        toast.error('Error: ' + res.data.message);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
      toast.error('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (quantity > item.stock) {
      toast.error('Quantity exceeds stock');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('jwtToken');
    try {
      const res = await axios.post(`${backendUrl}/api/orders/place-order`, {
        orders: [{
          item_id: item._id,
          quantity,
          amount: item.price * quantity
        }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success('Order placed successfully');
        navigate('/orders');
      } else {
        toast.error('Error: ' + res.data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error.message);
      toast.error('Internal server error');
    } finally {
      setLoading(false);
    }
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
            toast.error('Error: ' + res.data.message);
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

  if (!item || !item.seller) {
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
            <div className='flex justify-start gap-2 w-full text-xl'>
                <span>Stock:</span>
                <p className="font-light break-words">{item.stock}</p>
            </div>
          </div>
          <div className='flex flex-col justify-start gap-2 w-full text-xl border border-zinc-900 p-2'>
            <h1 className='text-2xl font-semibold text-left'>Seller Details</h1>
            <div className='flex justify-start gap-2 w-full text-xl'>
              <span>Seller:</span>
              <p className="font-light break-words">{item.seller.name}</p>
            </div>
            <div className='flex justify-start gap-2 w-full text-xl'>
              <span>Contact:</span>
              <p className="font-light break-words">{item.seller.contact_no}</p>
            </div>
            <div className='flex justify-start gap-2 w-full text-xl'>
              <span>Email:</span>
              <p className="font-light break-words">{item.seller.email}</p>
            </div>
          </div>
          <div className='flex flex-col justify-start gap-2 w-full text-xl border border-zinc-900 p-2'>
            <label htmlFor="quantity" className='text-xl font-semibold'>Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max={item.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className='border border-zinc-900 p-2'
            />
          </div>
          {item.stock === 0 ? (
            <div className='flex justify-center items-center w-full mt-3'>
              <p className='text-red-600 text-xl font-semibold'>Currently Unavailable</p>
            </div>
          ) : (
            <div className='flex justify-center items-center w-full mt-3'>
              <button onClick={handleAddToCart} className='bg-white text-zinc-900 font-semibold py-2 px-4 border border-zinc-900 hover:bg-zinc-200 transition-colors duration-75 w-1/2'>
                {loading ? <LoadingIcon className='animate-spin' size={24} /> : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} className='bg-zinc-900 text-white font-semibold py-2 px-4 border border-zinc-900 hover:bg-zinc-700 transition-colors duration-75 w-1/2'>
                {loading ? <LoadingIcon className='animate-spin' size={24} /> : 'Buy Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ItemPage;