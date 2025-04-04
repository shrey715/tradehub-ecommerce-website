import axiosInstance from '../../../lib/api';

import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router';
import { CgSpinnerTwoAlt as LoadingIcon } from 'react-icons/cg';
import { CiUser, CiMail, CiPhone, CiShoppingCart, CiDeliveryTruck, CiWarning } from 'react-icons/ci';

import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  useEffect(() => {
    const checkCartStatus = async () => {
      try {
        const res = await axiosInstance.get(`/api/cart/get-cart`);

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
    try {
      const res = await axiosInstance.post(`/api/cart/add-to-cart`, {
        item_id: item._id,
        quantity
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
    try {
      const res = await axiosInstance.post(`/api/orders/place-order`, {
        orders: [{
          item_id: item._id,
          quantity,
          amount: item.price * quantity
        }]
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
          const res = await axiosInstance.get(`/api/items/${id}`);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-8 md:py-12"
    >
      <Helmet>
        <title>{item?.name || 'Loading...'} | TradeHub</title>
      </Helmet>
      
      {!item || !item.seller ? (
        <Loading />
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4">
            {/* Breadcrumb navigation */}
            <nav className="flex mb-6 text-sm">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/item/all" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-zinc-400 dark:text-zinc-600">/</li>
                <li>
                  <Link to="/item/all" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                    All items
                  </Link>
                </li>
                <li className="text-zinc-400 dark:text-zinc-600">/</li>
                <li className="text-zinc-700 dark:text-zinc-300 truncate max-w-[150px] md:max-w-xs">
                  {item.name}
                </li>
              </ol>
            </nav>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image column */}
                <motion.div 
                  variants={childVariants}
                  className="relative h-full bg-zinc-100 dark:bg-zinc-800/30 flex items-center justify-center p-4 md:p-6 lg:p-8 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800"
                >
                  <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  {/* Virtual badge */}
                  <div className="absolute top-6 left-6 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Listed on TradeHub</span>
                  </div>
                </motion.div>

                {/* Details column */}
                <motion.div 
                  variants={childVariants}
                  className="p-6 md:p-8 space-y-6"
                >
                  {/* Name and price */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {item.name}
                      </h1>
                      <p className="text-2xl font-medium text-zinc-700 dark:text-zinc-300">
                        ₹{item.price}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {item.category.map((tag, index) => (
                        <div 
                          key={index}
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            index === 0 
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                              : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Description</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-2 py-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {item.stock > 0 ? `In Stock (${item.stock} available)` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  {/* Seller info */}
                  <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Seller Information</h2>
                      <Link 
                        to={`/seller/${item.seller.id}`} 
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View profile
                      </Link>
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                      <Link 
                        to={`/seller/${item.seller.id}`}
                        className="flex items-center gap-3 group mb-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                          <CiUser className="text-zinc-600 dark:text-zinc-400 text-lg" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                            {item.seller.name}
                          </span>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">IIIT Student</p>
                        </div>
                      </Link>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href={`mailto:${item.seller.email}`}
                          className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                        >
                          <CiMail className="text-zinc-500" />
                          <span className="truncate">{item.seller.email}</span>
                        </a>
                        
                        <a 
                          href={`tel:${item.seller.contact_no}`}
                          className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                        >
                          <CiPhone className="text-zinc-500" />
                          <span>{item.seller.contact_no}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action area */}
                  {item.stock > 0 && !userIsSeller && (
                    <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mr-3">Quantity</label>
                        <div className="flex items-center">
                          <button 
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            disabled={quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-l border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >-</button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-12 h-8 border-y border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center text-zinc-900 dark:text-zinc-50 no-spinner"
                          />
                          <button 
                            onClick={() => setQuantity(prev => Math.min(item.stock, prev + 1))}
                            disabled={quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center rounded-r border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >+</button>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddToCart}
                          disabled={loading || isInCart}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <LoadingIcon className="animate-spin" size={18} />
                          ) : (
                            <>
                              <CiShoppingCart className="text-lg" />
                              {isInCart ? 'In Cart' : 'Add to Cart'}
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={handleBuyNow}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <LoadingIcon className="animate-spin" size={18} />
                          ) : (
                            <>
                              <CiDeliveryTruck className="text-lg" />
                              Buy Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {userIsSeller && (
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex items-start gap-3">
                        <CiWarning className="text-xl text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          This is your listing. You cannot purchase your own item.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {item.stock === 0 && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30">
                      <div className="flex items-start gap-3">
                        <CiWarning className="text-xl text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-300">
                          This item is currently out of stock.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ItemPage;