import { useState } from "react";
import toast from "react-hot-toast";

const Reviews = ({ reviews, onAddReview }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment || rating === 0) {
      toast.error("Please fill all fields and select a star rating");
      return;
    }
    const newReview = { name, comment, rating, date: new Date().toISOString() };
    onAddReview(newReview);
    setName("");
    setComment("");
    setRating(0);
    toast.success("Review added successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {reviews.map((r, i) => (
          <div key={i} className="border p-3 rounded shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{r.name}</span>
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    className={`w-4 h-4 fill-current ${idx < r.rating ? "text-yellow-400" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09L5.82 12 .94 7.91l6.09-.88L10 2l2.97 5.03 6.09.88-4.88 4.09 1.698 5.09z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3 bg-gray-50">
        <h3 className="font-bold text-lg">Add a Review</h3>

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setRating(idx + 1)}
              className="focus:outline-none"
            >
              <svg
                className={`w-6 h-6 ${idx < rating ? "text-yellow-400" : "text-gray-300"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 15l-5.878 3.09L5.82 12 .94 7.91l6.09-.88L10 2l2.97 5.03 6.09.88-4.88 4.09 1.698 5.09z" />
              </svg>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Reviews;
