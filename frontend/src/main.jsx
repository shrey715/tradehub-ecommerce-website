import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import './index.css';

import { Toaster } from 'react-hot-toast';
import NotFound from './components/common/NotFound';
import { AuthLayout, Login, Register, Logout } from './components/pages/auth/Auth';
import Home from './components/pages/home/Home';

import Protected from './hooks/Protected';
import User from './components/pages/user/User';
import Profile from './components/pages/user/Profile';
import Cart from './components/pages/user/Cart';

import ItemPage from './components/pages/items/ItemPage';
import SellItem from './components/pages/items/SellItem';
import BuyItems from './components/pages/items/BuyItems';

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
          path="order/*"
          element={
            <Protected>
              <User />
            </Protected>
          }
        >
          <Route path="my" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
