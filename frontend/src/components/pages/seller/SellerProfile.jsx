import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { useParams } from "react-router";
import { Helmet } from "react-helmet";

import axios from "axios";
import { FaStar } from "react-icons/fa";
import { backendUrl } from "../../../main";

import toast from "react-hot-toast";
import Loading from "../../common/loading";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, review: "" });
  const [sellerStats, setSellerStats] = useState({ totalSales: 0, completedOrders: 0, recentOrders: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [sellerRes, reviewsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/user/seller/${id}`, { headers }),
          axios.get(`${backendUrl}/api/reviews/${id}?page=${currentPage}`, { headers })
        ]);

        setSeller(sellerRes.data.seller);
        setSellerStats({
          totalSales: sellerRes.data.stats.totalSales,
          completedOrders: sellerRes.data.stats.completedOrders,
          recentOrders: sellerRes.data.recentOrders
        });
        setReviews(reviewsRes.data.data.reviews);
        setAvgRating(reviewsRes.data.data.averageRating);
        setTotalPages(reviewsRes.data.data.pagination.pages);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch seller data");
      } finally {      
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${backendUrl}/api/reviews/add-review`,
        {
          reviewee_id: id,
          ...newReview
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const [sellerRes, reviewsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/user/seller/${id}`, { 
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/api/reviews/${id}?page=1`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSeller(sellerRes.data.seller);
      setReviews(reviewsRes.data.data.reviews);
      setAvgRating(reviewsRes.data.data.averageRating);
      setCurrentPage(1);
      setNewReview({ rating: 5, review: "" });
      
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <motion.div
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      exit={{ x: '100vw' }}
      className="min-h-full bg-[#fafafa] dark:bg-zinc-950"
    >     
      <Helmet>
        <title>{`${seller?.fname}'s Profile | TradeHub`}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {seller?.fname} {seller?.lname}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating)
                        ? "text-yellow-400"
                        : "text-zinc-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                ({avgRating.toFixed(1)})
              </span>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <p>Email: {seller?.email}</p>
              <p>Contact: {seller?.contact_no}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Total Sales</span>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                ₹{sellerStats.totalSales.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Orders Completed</span>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {sellerStats.completedOrders}
              </p>
            </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitReview} className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Write a Review</h2>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
              >
                <FaStar
                  className={`w-6 h-6 ${
                    i < newReview.rating ? "text-yellow-400" : "text-zinc-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={newReview.review}
            onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
            placeholder="Write your review..."
            className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent"
            rows={4}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 
                    rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {review.reviewer_id.fname} {review.reviewer_id.lname}
                    </p>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400" : "text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-zinc-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{review.review}</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="text-zinc-600 dark:text-zinc-400">No reviews found</p>
            )}

          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>    
  );
};

export default SellerProfile;