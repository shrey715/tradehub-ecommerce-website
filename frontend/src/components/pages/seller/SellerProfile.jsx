import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet";
import { CiUser, CiStar, CiMail, CiPhone, CiShoppingCart, CiShop } from "react-icons/ci";
import axiosInstance from "../../../lib/api";
import toast from "react-hot-toast";
import Loading from "../common/Loading";
import PropTypes from "prop-types";

const StarRating = ({ rating, size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <CiStar
          key={i}
          className={`${sizeClasses[size]} ${
            i < Math.round(rating)
              ? "text-amber-400 dark:text-amber-300 fill-amber-400 dark:fill-amber-300"
              : "text-zinc-300 dark:text-zinc-600"
          }`}
        />
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"])
};

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
    const fetchData = async () => {
      try {
        const [sellerRes, reviewsRes] = await Promise.all([
          axiosInstance.get(`/api/user/seller/${id}`),
          axiosInstance.get(`/api/reviews/${id}?page=${currentPage}`)
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
      await axiosInstance.post(
        `/api/reviews/add-review`,
        {
          reviewee_id: id,
          ...newReview
        });

      const [sellerRes, reviewsRes] = await Promise.all([
        axiosInstance.get(`/api/user/seller/${id}`),
        axiosInstance.get(`/api/reviews/${id}?page=1`)
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8"
    >     
      <Helmet>
        <title>{`${seller?.fname}'s Profile | TradeHub`}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Seller Profile</h1>
          <Link
            to="/item/all"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1"
          >
            <span>Back to Items</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Seller Info Column */}
          <div className="md:col-span-1 space-y-6">
            {/* Seller Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <CiUser className="w-10 h-10 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {seller.fname} {seller.lname}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <StarRating rating={avgRating} size="sm" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      ({avgRating.toFixed(1)})
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <CiMail className="text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Email</p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-50 truncate">{seller.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <CiPhone className="text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Contact</p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-50">{seller.contact_no}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Stats */}
              <div className="border-t border-zinc-200 dark:border-zinc-800">
                <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                  <div className="p-4 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Sales</p>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      ₹{sellerStats.totalSales.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Orders</p>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {sellerStats.completedOrders}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sales Card */}
            {sellerStats.recentOrders.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-5">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-4">
                  Recent Sales
                </h3>
                <div className="space-y-4">
                  {sellerStats.recentOrders.slice(0, 3).map((order, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                        <CiShoppingCart className="w-6 h-6 m-2 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                          {order.item_id.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            ₹{order.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Write a Review Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Write a Review
                </h2>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                          className="p-1 focus:outline-none"
                        >
                          <CiStar
                            className={`w-6 h-6 ${
                              i < newReview.rating 
                                ? "text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" 
                                : "text-zinc-300 dark:text-zinc-600"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                        {newReview.rating}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.review}
                      onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                      placeholder="Share your experience with this seller..."
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newReview.review}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Reviews
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={avgRating} />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review._id} className="pb-5 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                              <CiUser className="text-zinc-500 dark:text-zinc-400" />
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                                {review.reviewer_id.fname} {review.reviewer_id.lname}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <StarRating rating={review.rating} size="sm" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 pl-13">
                          {review.review}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CiShop className="w-8 h-8 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <h3 className="text-zinc-900 dark:text-zinc-50 font-medium">
                        No reviews yet
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Be the first to leave a review for this seller
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 flex justify-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`min-w-[2rem] h-8 flex items-center justify-center rounded-md text-sm ${
                        currentPage === i + 1
                          ? 'bg-zinc-900 dark:bg-zinc-700 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerProfile;