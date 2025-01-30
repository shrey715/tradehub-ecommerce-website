import axios from 'axios';
import { backendUrl } from '../../../main';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router';
import { CgSpinnerTwoAlt as LoadingIcon } from 'react-icons/cg';

import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

import toast from 'react-hot-toast';
import Loading from '../common/Loading';

import useUserStore from '../../../hooks/UserStore';
import useCartNumberStore from '../../../hooks/CartNumberStore';

const ItemPage = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [ userIsSeller, setUserIsSeller ] = useState(false);
  const { setCartNumber } = useCartNumberStore();

  useEffect(() => {
    const checkCartStatus = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const res = await axios.get(`${backendUrl}/api/cart/get-cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          const cartItem = res.data.cart.items.find(i => i._id === id);
          setIsInCart(!!cartItem);
        }
      } catch (error) {
        console.error('Error checking cart status:', error);
      }
    };

    if (id) checkCartStatus();
  }, [id]);

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
        setCartNumber((prev) => prev + 1);
        setIsInCart(true);
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

            if (user && user._id === res.data.item.seller.id) {
              setUserIsSeller(true);
            }
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
  }, [id, user]);

  if (!item || !item.seller) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >
      <Helmet>
        <title>{item?.name || 'Loading...'} | TradeHub</title>
      </Helmet>
      
      {!item || !item.seller ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <div className="sticky top-6">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full aspect-square object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {item.name}
                </h1>
                <p className="text-2xl font-medium text-zinc-900 dark:text-zinc-50">
                  ₹{item.price}
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Description</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Category</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.category.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Stock</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.stock}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
                <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Seller Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Name</span>
                    <Link 
                      to={`/seller/${item.seller.id}`}
                      className="font-medium text-zinc-900 dark:text-zinc-50 hover:text-green-600 
                                dark:hover:text-green-400 transition-colors cursor-pointer
                                hover:underline flex items-center gap-1"
                    >
                      {item.seller.name}
                    </Link>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Contact</span>
                    <a 
                      href={`tel:${item.seller.contact_no}`}
                      className="font-medium text-zinc-900 dark:text-zinc-50 hover:text-green-600 
                                dark:hover:text-green-400 transition-colors cursor-pointer
                                hover:underline flex items-center gap-1"
                      title="Click to call"
                    >
                      {item.seller.contact_no}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-500 dark:text-zinc-400">Email</span>
                    <a
                      href={`mailto:${item.seller.email}`}
                      className="font-medium text-zinc-900 dark:text-zinc-50 hover:text-green-600 
                                dark:hover:text-green-400 transition-colors cursor-pointer
                                hover:underline flex items-center gap-1"
                      title="Click to email"
                    >
                      {item.seller.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Quantity
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-zinc-200 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800"
                  />
                </label>
              </div>

              {item.stock === 0 ? (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4">
                  <p className="text-center text-red-700 dark:text-red-400 font-medium">
                    Currently Unavailable
                  </p>
                </div>
              ) : userIsSeller ? (
                <button
                  disabled
                  className="w-full px-4 py-2 rounded-md bg-zinc-100 text-zinc-500 
                            dark:bg-zinc-800 dark:text-zinc-400 cursor-not-allowed"
                >
                  You can&apos;t buy your own item
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={loading || isInCart}
                    className={`flex-1 inline-flex justify-center items-center px-4 py-2 rounded-md transition-colors ${
                      isInCart 
                        ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                        : 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {loading ? <LoadingIcon className="animate-spin" size={20} /> : 
                    isInCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={loading}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                  >
                    {loading ? <LoadingIcon className="animate-spin" size={20} /> : 'Buy Now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemPage;