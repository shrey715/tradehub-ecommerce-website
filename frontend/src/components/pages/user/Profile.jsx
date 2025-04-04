import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { CiEdit, CiUser, CiMail, CiPhone, CiCalendar, CiLink, CiLock } from 'react-icons/ci';
import useUserStore from '../../../hooks/UserStore';

import { EditModal, PasswordModal } from '../../ui/ProfileModal';

const Profile = () => {
  const { user } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-50 dark:bg-zinc-950 min-h-screen py-8"
    >     
      <Helmet>
        <title>Profile | TradeHub</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            My Profile
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your account information
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-7">
          {/* User info card */}
          <div className="md:col-span-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  Personal Information
                </h2>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <CiEdit className="text-lg" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <CiUser className="text-lg" />
                    First Name
                  </div>
                  <p className="text-base text-zinc-900 dark:text-zinc-50">{user.fname}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <CiUser className="text-lg" />
                    Last Name
                  </div>
                  <p className="text-base text-zinc-900 dark:text-zinc-50">{user.lname}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <CiCalendar className="text-lg" />
                    Age
                  </div>
                  <p className="text-base text-zinc-900 dark:text-zinc-50">{user.age}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <CiMail className="text-lg" />
                    Email
                  </div>
                  <p className="text-base text-zinc-900 dark:text-zinc-50 break-all">{user.email}</p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <CiPhone className="text-lg" />
                    Contact Number
                  </div>
                  <p className="text-base text-zinc-900 dark:text-zinc-50">{user.contact_no}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                    <CiLink className="text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                    Seller Profile
                  </h3>
                </div>
                
                <Link 
                  to={`/seller/${user._id}`} 
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  View
                </Link>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Check your seller profile page, including your listings and reviews
              </p>
            </div>
          </div>

          {/* Account settings */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="p-4">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-4">
                  Account Settings
                </h3>
                
                <button
                  onClick={() => setPasswordMode(true)}
                  className="w-full flex items-center justify-between p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <CiLock className="text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Change Password
                    </span>
                  </div>
                  <span className="text-zinc-400">&rsaquo;</span>
                </button>
              </div>
            </div>
            
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Active Account
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Your account is in good standing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editMode && <EditModal setEditMode={setEditMode} />}
      {passwordMode && <PasswordModal setPasswordMode={setPasswordMode} />}
    </motion.div>
  );
};

export default Profile;