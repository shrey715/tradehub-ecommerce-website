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
  const handleClose = () => {
    setEditMode(false);
  }

  const { user, setUser } = useUserStore();
  const [fname, setFname] = useState(user.fname || '');
  const [lname, setLname] = useState(user.lname || '');
  const [age, setAge] = useState(user.age || '');
  const [email, setEmail] = useState(user.email || '');
  const [contactNo, setContactNo] = useState(user.contact_no || '');

  const handleUpdate = async () => {
    const token = localStorage.getItem("jwtToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };

    const body = JSON.stringify({ fname, lname, age, email, contact_no: contactNo });

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

    if (!token) {
      toast.error("Unauthorized");
      return;
    }
    
    try {
      const res = await axios.patch(`${backendUrl}/api/user`, body, config);

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
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div 
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex flex-col justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full h-fit p-2 md:w-1/2 lg:w-1/3 flex flex-col justify-center items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <div className="flex flex-col justify-start items-center w-full h-fit p-2 gap-2 bg-white rounded-md">
            <div className="flex flex-row justify-between items-center w-full p-2 border-b border-gray-300">
              <h2 className="text-2xl font-light text-left">Edit Profile</h2>
              <span onClick={handleClose} className="text-2xl text-zinc-900 cursor-pointer">
                <CiCircleRemove size={32} />
              </span>
            </div>
            <div className="flex flex-col justify-center items-center w-full p-2 gap-2">
              <label className="text-lg font-normal text-left w-full">First Name:</label>
              <input
                type="text"
                className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
              <label className="text-lg font-normal text-left w-full">Last Name:</label>
              <input
                type="text"
                className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
              <label className="text-lg font-normal text-left w-full">Age:</label>
              <input
                type="number"
                className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <label className="text-lg font-normal text-left w-full">Email:</label>
              <input
                type="email"
                className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
              <label className="text-lg font-normal text-left w-full">Contact Number:</label>
              <input
                type="text"
                className="p-2 border-b border-zinc-600 w-full active:outline-none focus:outline-none"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
              />
              <div className="flex flex-row justify-center items-center w-full gap-2 mt-4">
                <span onClick={handleUpdate} className="flex flex-row justify-center items-center w-full gap-2 p-2 bg-zinc-900 text-white rounded-md cursor-pointer">
                  <CiEdit className="text-2xl" />
                  <span className="text-lg font-normal">Update</span>
                </span>
              </div>  
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 

EditModal.propTypes = {
  setEditMode: PropTypes.func.isRequired
};

const Profile = () => {
  const { user } = useUserStore();
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  }

  return (
    <motion.div
      className="w-full h-full p-2"
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
    >     
      <Helmet>
        <title>Profile | TradeHub</title>
      </Helmet>
      <div className="px-6 w-full h-full">
        <h2 className="text-3xl font-light text-left">Hello {user.fname}!</h2>
        <hr className="my-4 border-t border-gray-300" />
        <div className="flex flex-col justify-center items-center w-full h-full p-2 gap-2">
          <div className="flex flex-col justify-center items-center w-full md:w-2/3 lg:w-1/2 p-2 gap-2 border border-zinc-900 rounded-md">
            <label className="text-lg font-normal text-left w-full">First Name:</label>
            <span className="text-lg font-light text-left w-full px-5">{user.fname}</span>
            <label className="text-lg font-normal text-left w-full">Last Name:</label>
            <span className="text-lg font-light text-left w-full px-5">{user.lname}</span>
            <label className="text-lg font-normal text-left w-full">Age:</label>
            <span className="text-lg font-light text-left w-full px-5">{user.age}</span>
            <label className="text-lg font-normal text-left w-full">Email:</label>
            <span className="text-lg font-light text-left w-full px-5">{user.email}</span>
            <label className="text-lg font-normal text-left w-full">Contact Number:</label>
            <span className="text-lg font-light text-left w-full px-5">{user.contact_no}</span>
            <div className="flex flex-row justify-center items-center w-full gap-2 mt-4">
              <span onClick={handleEdit} className="flex flex-row justify-center items-center w-full gap-2 p-2 bg-zinc-900 text-white rounded-md cursor-pointer">
                <CiEdit className="text-2xl" />
                <span className="text-lg font-normal">Edit</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      {editMode && <EditModal setEditMode={setEditMode} />}
    </motion.div>
  );
};

export default Profile;