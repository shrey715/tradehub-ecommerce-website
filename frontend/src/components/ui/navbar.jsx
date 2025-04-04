import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CiShoppingCart, CiUser, CiShop, CiCircleQuestion, CiMenuBurger, CiDeliveryTruck, CiLogout } from "react-icons/ci";
import { Link, useNavigate, useLocation } from 'react-router';
import Sigma from './sigma';
import PropTypes from 'prop-types';
import * as Tooltip from '@radix-ui/react-tooltip';
import useCartNumberStore from '../../hooks/CartNumberStore';
import axiosInstance from '../../lib/api';

const BurgerMenu = [
  {
    name: 'Orders',
    link: '/orders/',
    icon: <CiShoppingCart className="h-4 w-4" />
  },
  {
    name: 'My Listings',
    link: '/user/my-listings',
    icon: <CiShop className="h-4 w-4" />
  },
  {
    name: 'Create Listing',
    link: '/item/sell',
    icon: <CiUser className="h-4 w-4" />
  },
  {
    name: 'Deliver Items',
    link: '/deliver',
    icon: <CiDeliveryTruck className="h-4 w-4" />
  },
  {
    name: 'Logout',
    link: '/auth/logout',
    icon: <CiLogout className="h-4 w-4" />
  },
];

const NavLink = ({ to, title, children, notificationCount, isActive }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Link 
          to={to}
          className={`relative flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 ${
            isActive 
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' 
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            className="inline-flex items-center justify-center"
          >
            {children}
          </motion.span>
          {isActive && (
            <motion.span 
              layoutId="activeIndicator"
              className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ x: '-50%' }}
            />
          )}
          <AnimatePresence>
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                  mass: 1
                }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white ring-2 ring-white dark:ring-zinc-900"
              >
                <motion.span
                  key={notificationCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-xs font-medium text-zinc-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          sideOffset={5}
        >
          {title}
          <Tooltip.Arrow className="fill-current" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  notificationCount: PropTypes.number,
  isActive: PropTypes.bool,
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartNumber, setCartNumber } = useCartNumberStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(new Audio('/audio/sigma-boy.mp3'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get(`/api/cart/get-cart-count`);
        if (response.data.success) {
          setCartNumber(response.data.count);
        }
      } catch (error) {
        console.error('Error getting cart count:', error);
      }
    };
    fetchCart();
  }, [setCartNumber]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let clickTimeout = null;

  const handleSingleClick = () => {
    navigate('/item/all');
  };

  const handleDoubleClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleClick = () => {
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      handleDoubleClick();
    } else {
      clickTimeout = setTimeout(() => {
        handleSingleClick();
        clickTimeout = null;
      }, 300);
    }
  };

  // Check if a nav link is active
  const isNavActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`sticky top-0 left-0 w-full z-40 backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800 shadow-sm' 
          : 'bg-white/90 dark:bg-zinc-900/90'
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-6">
        <motion.div 
          className="flex items-center"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          <motion.h1 
            onClick={handleClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-2xl font-title font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            TradeHub
          </motion.h1>
        </motion.div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <motion.div
            className="flex items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-full p-1.5 gap-1.5 border border-zinc-100 dark:border-zinc-700/50 shadow-sm"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <NavLink 
              to="/item/all" 
              title="Browse Items" 
              isActive={isNavActive('/item/all')}
            >
              <CiShop className="h-5 w-5 md:h-5 md:w-5" />
            </NavLink>
            
            <NavLink 
              to="/user/cart" 
              title="My Cart" 
              notificationCount={cartNumber}
              isActive={isNavActive('/user/cart')}
            >
              <CiShoppingCart className="h-5 w-5 md:h-5 md:w-5" />
            </NavLink>
            
            <NavLink 
              to="/user/profile" 
              title="My Profile"
              isActive={isNavActive('/user/profile')}
            >
              <CiUser className="h-5 w-5 md:h-5 md:w-5" />
            </NavLink>
            
            <NavLink 
              to="/user/support" 
              title="Chat Support"
              isActive={isNavActive('/user/support')}
            >
              <CiCircleQuestion className="h-5 w-5 md:h-5 md:w-5" />
            </NavLink>
          </motion.div>
          
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={toggleDropdown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-full transition-all duration-150 border ${
                isDropdownOpen 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 shadow-sm' 
                  : 'bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-100 dark:border-zinc-700/50'
              }`}
            >
              <CiMenuBurger className="h-5 w-5 md:h-5 md:w-5" />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 w-56 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="p-1.5">
                    {BurgerMenu.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="overflow-hidden"
                      >
                        <Link
                          to={item.link}
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {isPlaying && <Sigma />}
    </motion.nav>
  );
};

export default Navbar;