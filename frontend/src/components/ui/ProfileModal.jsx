import { useState } from "react";
import useUserStore from "../../hooks/UserStore";
import PropTypes from 'prop-types';

import { AnimatePresence, motion } from "motion/react";

import { CiCircleRemove } from "react-icons/ci";

import axiosInstance from "../../lib/api";
import toast from "react-hot-toast";

const EditModal = ({ setEditMode }) => {
  const { user, setUser } = useUserStore();
  const [fname, setFname] = useState(user.fname || '');
  const [lname, setLname] = useState(user.lname || '');
  const [age, setAge] = useState(user.age || '');
  const [email, setEmail] = useState(user.email || '');
  const [contactNo, setContactNo] = useState(user.contact_no || '');

  const handleClose = () => setEditMode(false);

  const handleUpdate = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    if (!fname || !lname || !age || !email || !contactNo) {
      toast.error("Please fill in all fields");
      return;
    }

    const emailDomains = ["@research.iiit.ac.in", "@students.iiit.ac.in", "@iiit.ac.in"];
    if (!emailDomains.some(domain => email.includes(domain))) {
      toast.error("Please enter a valid IIIT email address");
      return;
    }

    if (contactNo.length !== 10) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }

    try {
      const res = await axiosInstance.patch(
        `/api/user`,
        { fname, lname, age, email, contact_no: contactNo },
      );

      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile updated successfully");
        setEditMode(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md mx-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Edit Profile</h2>
              <button
                onClick={handleClose}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <CiCircleRemove size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name</label>
                  <input
                    type="text"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name</label>
                  <input
                    type="text"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Contact Number</label>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

EditModal.propTypes = {
  setEditMode: PropTypes.func.isRequired
};

const PasswordModal = ({ setPasswordMode }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClose = () => setPasswordMode(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await axiosInstance.patch(
        `/api/user/update-password`,
        { currentPassword, newPassword },
      );

      if (res.data.success) {
        toast.success("Password updated successfully");
        setPasswordMode(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md mx-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Update Password</h2>
              <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
                <CiCircleRemove size={24} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

PasswordModal.propTypes = {
  setPasswordMode: PropTypes.func.isRequired
};

export { EditModal, PasswordModal };