import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CiShoppingCart as Cart, CiUser as User, CiShop as Shop, CiMenuBurger as Burger, CiCircleQuestion as Support } from "react-icons/ci";
import { Link, useNavigate } from 'react-router';
import Sigma from './sigma';
import PropTypes from 'prop-types';
import * as Tooltip from '@radix-ui/react-tooltip';
import useCartNumberStore from '../../hooks/CartNumberStore';
import axios from 'axios';
import { backendUrl } from '../../main';

const BurgerMenu = [
  {
    name: 'Orders',
    link: '/orders/',
  },
  {
    name: 'My Listings',
    link: '/user/my-listings',
  },
  {
    name: 'Create Listing',
    link: '/item/sell',
  },
  {
    name: 'Deliver Items',
    link: '/deliver',
  },
  {
    name: 'Logout',
    link: '/auth/logout',
  },
];

const NavLink = ({ to, title, children, notificationCount }) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Link 
          to={to}
          className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
        >
          <span className="inline-flex items-center justify-center">
            {children}
          </span>
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
                className="absolute -top-1.5 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-zinc-800 text-[11px] font-medium text-white ring-2 ring-white dark:ring-zinc-900"
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
          className="z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-zinc-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
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
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartNumber, setCartNumber } = useCartNumberStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const audioRef = useRef(new Audio('/audio/sigma-boy.mp3'));

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/cart/get-cart-count`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          },
        });
        if (response.data.success) {
          setCartNumber(response.data.count);
        }
      } catch (error) {
        console.error('Error getting cart count:', error);
      }
    };
    fetchCart();
  }, [cartNumber, setCartNumber]);

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

  // const iconVariants = {
  //   initial: { opacity: 0, rotate: -180 },
  //   animate: { opacity: 1, rotate: 0 },
  //   exit: { opacity: 0, rotate: 180 }
  // };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      exit={{ opacity: 0 }}
      className="sticky top-0 left-0 flex flex-row justify-between items-center min-h-16 h-16 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 lg:px-6 z-50"
    >
      <div className="flex items-center">
        <h1 
          onClick={handleClick}
          className="text-2xl font-title font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity cursor-pointer"
        >
          TradeHub
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <NavLink to="/item/all" title="Shop">
          <Shop className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </NavLink>
        
        <NavLink to="/user/cart" title="My Cart" notificationCount={cartNumber}>
          <Cart className="h-6 w-6 text-zinc-700 dark:text-zinc-400" />
        </NavLink>
        
        <NavLink to="/user/profile" title="My Profile">
          <User className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </NavLink>
        
        <NavLink to="/user/support" title="Chat Support">
          <Support className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </NavLink>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Burger className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-4 w-48 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg"
              >
                <ul className="py-1">
                  {BurgerMenu.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Sun className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Moon className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </button> */}
      </div>

      {isPlaying && <Sigma />}
    </motion.nav>
  );
};

export default Navbar;