import { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { CiEdit } from 'react-icons/ci';
import useUserStore from '../../../hooks/UserStore';

import { EditModal, PasswordModal } from '../../ui/ProfileModal';

const Profile = () => {
  const { user } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >     
      <Helmet>
        <title>Profile | TradeHub</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Profile
            </h1>
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">First Name</label>
                  <p className="text-lg text-zinc-900 dark:text-zinc-50">{user.fname}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Last Name</label>
                  <p className="text-lg text-zinc-900 dark:text-zinc-50">{user.lname}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Age</label>
                  <p className="text-lg text-zinc-900 dark:text-zinc-50">{user.age}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</label>
                  <p className="text-lg text-zinc-900 dark:text-zinc-50">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Contact Number</label>
                  <p className="text-lg text-zinc-900 dark:text-zinc-50">{user.contact_no}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Seller Page</label>
                  <p>
                    <Link to={`/seller/${user._id}`} className="text-lg text-zinc-900 dark:text-zinc-50 hover:text-green-600 dark:hover:text-green-400 cursor-pointer hover:underline transition-colors">
                      View Seller Page
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-colors"
              >
                <CiEdit className="text-lg" />
                Edit Profile
              </button>
              <button
                onClick={() => setPasswordMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                Change Password
              </button>
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