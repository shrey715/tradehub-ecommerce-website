import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import './index.css';

import { Toaster } from 'react-hot-toast';

import NotFound from './components/pages/common/NotFound';
import Register from './components/pages/auth/Register';
import Login from './components/pages/auth/Login';
import Logout from './components/pages/auth/Logout';
import AuthLayout from './components/pages/auth/AuthLayout';
import CASHandler from './components/pages/auth/CASHandler';

import Home from './components/pages/home/Home';

import Protected from './hooks/Protected';
import User from './components/pages/user/User';
import Profile from './components/pages/user/Profile';
import Cart from './components/pages/user/Cart';
import Support from './components/pages/support/Support';

import ItemPage from './components/pages/items/ItemPage';
import SellItem from './components/pages/items/SellItem';
import BuyItems from './components/pages/items/BuyItems';
import DeliverItem from './components/pages/items/DeliverItems';
import ItemDeliveryPage from './components/pages/items/ItemDeliveryPage';
import MyListing from './components/pages/items/MyListing';

import Order from './components/pages/orders/Order';

import SellerProfile from './components/pages/seller/SellerProfile';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/auth/*" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
          <Route path="cas" element={<CASHandler />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/user/*"
          element={
            <Protected>
              <User />
            </Protected>
          }
        >
          <Route path="my-listings" element={<MyListing />} />
          <Route path="support" element={<Support />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route 
          path="/item/*"
          element={
            <Protected>
              <User />
            </Protected>
          }
        >
          <Route path=":id" element={<ItemPage />} />
          <Route path="all" element={<BuyItems />} />
          <Route path="sell" element={<SellItem />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="orders/*"
          element={
            <Protected>
              <User />
            </Protected>
          }
        >
          <Route path="" element={<Order />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/deliver/*" element={
          <Protected>
            <User />
          </Protected>
        }>
          <Route path="" element={<DeliverItem />} />
          <Route path=":id" element={<ItemDeliveryPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/seller/*" element={
          <Protected>
            <User />
          </Protected>
        }>
          <Route path=":id" element={<SellerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);