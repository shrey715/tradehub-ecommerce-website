import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { CiShoppingCart as Cart, CiUser as User, CiShop as Shop, CiMenuBurger as Burger, CiCircleQuestion as Support } from "react-icons/ci";

import { Link, useNavigate } from 'react-router';

import Sigma from './sigma';

const BurgerMenu = [
  {
    name: 'Orders',
    link: '/orders/',
  },
  {
    name: 'Sell Item',
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

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const audioRef = useRef(new Audio('/audio/sigma-boy.mp3'));

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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      exit={{ opacity: 0 }}
      className="sticky top-0 left-0 flex flex-row justify-between items-center h-16 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 lg:px-6 z-50"
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
        <Link 
          to="/item/all"
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Shop className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </Link>
        <Link 
          to="/user/cart"
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Cart className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </Link>
        <Link 
          to="/user/profile"
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <User className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </Link>
        <Link
          to="/user/support/"
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Support className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
        </Link>
        
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
                className="absolute top-full right-0 mt-2 w-48 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg"
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
      </div>

      {isPlaying && <Sigma />}
    </motion.nav>
  );
};

export default Navbar;