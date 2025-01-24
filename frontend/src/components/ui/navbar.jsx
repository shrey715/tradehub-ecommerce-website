import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { CiShoppingCart as Cart, CiUser as User, CiShop as Shop, CiMenuBurger as Burger } from "react-icons/ci";

import { Link } from 'react-router';

const BurgerMenu = [
  {
    name: 'My Orders',
    link: '/order/my',
  },
  {
    name: 'Sell Item',
    link: '/item/sell',
  },
  {
    name: 'Deliver Items',
    link: '/item/deliver',
  },
  {
    name: 'Logout',
    link: '/auth/logout',
  },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      exit={{ opacity: 0 }}
      className="top-0 left-0 flex flex-row justify-between items-center h-24 w-full bg-white text-zinc-900 font-sans px-5 py-2"
    >
      <div className="flex flex-row items-center">
        <h1 className="text-4xl font-title font-bold">
          <Link to="/item/all" className="text-zinc-900">TradeHub</Link>
        </h1>
      </div>
      <div className="flex flex-row items-center gap-4 relative">
        <Link to="/item/all">
          <Shop className="h-8 w-8 cursor-pointer" />
        </Link>
        <Link to="/user/cart">
          <Cart className="h-8 w-8 cursor-pointer" />
        </Link>
        <Link to="/user/profile"> 
          <User className="h-8 w-8 cursor-pointer" />
        </Link>
        <div className="relative">
          <Burger className="h-8 w-8 cursor-pointer" onClick={toggleDropdown} />
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md border border-zinc-200 shadow-md"
              >
                <ul className="py-1">
                  {BurgerMenu.map((item, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-neutral-100 cursor-pointer">
                      <Link to={item.link} className="block text-zinc-700" onClick={closeDropdown}>
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
    </motion.nav>
  );
};

export default Navbar;