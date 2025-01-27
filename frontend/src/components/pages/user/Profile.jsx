import { Helmet } from "react-helmet";
import { useState } from "react";
import useUserStore from "../../../hooks/UserStore";
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from "motion/react";
import { CiEdit, CiCircleRemove } from "react-icons/ci";
import axios from "axios";
import { backendUrl } from "../../../main";
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
      const res = await axios.patch(
        `${backendUrl}/api/user`,
        { fname, lname, age, email, contact_no: contactNo },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
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

const Profile = () => {
  const { user } = useUserStore();
  const [editMode, setEditMode] = useState(false);

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="min-h-screen bg-[#fafafa] dark:bg-zinc-950"
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
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-md transition-colors"
              >
                <CiEdit className="text-lg" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {editMode && <EditModal setEditMode={setEditMode} />}
    </motion.div>
  );
};

export default Profile;