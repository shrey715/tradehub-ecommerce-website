import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { backendUrl } from '../../../main';
import { Link, useNavigate } from 'react-router';

import { CiEdit, CiTrash } from 'react-icons/ci';

import toast from 'react-hot-toast';
import Loading from '../common/Loading';
import EditListingModal from '../../ui/EditListingModal';

const MyListing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${backendUrl}/api/items/my-listings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setListings(response.data.items);
      } catch (error) {
        toast.error('Failed to fetch listings');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`${backendUrl}/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(listings.filter(item => item._id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
      console.error(error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="h-full bg-[#fafafa] dark:bg-zinc-950"
    >     
      <Helmet>
        <title>My Listings | TradeHub</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Listings
            </h1>
            <Link
              to="/item/sell"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 transition-colors"
            >
              Add New Listing
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p className="text-zinc-600 dark:text-zinc-400">
                You haven&apos;t listed any items yet
              </p>
              <Link
                to="/item/sell"
                className="mt-4 inline-flex items-center text-sm text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                Create your first listing →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden cursor-pointer shadow-sm transition-shadow hover:shadow-md"
                  onClick={() => navigate(`/item/${item._id}`)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-50">
                              {item.name}
                            </h3>
                            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                              ₹{item.price}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingListing(item);
                              }}
                              className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <CiEdit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item._id);
                              }}
                              className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-red-500"
                            >
                              <CiTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 'listed' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Stock: {item.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>  
      </div>    

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          setEditMode={() => setEditingListing(null)}
          onUpdate={(updatedItem) => {
            setListings(listings.map(item => 
              item._id === updatedItem._id ? updatedItem : item
            ));
          }}
        />
      )}
    </motion.div>
  );
};

export default MyListing;