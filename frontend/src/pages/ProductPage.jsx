import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import ImageGallery from "../components/ImageGallery";
import ProductCart from "../components/ProductCart";
import Reviews from "../components/Reviews";
import Loader from "../components/Loader";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.images[0] || "");
        const rev = await api.get(`/reviews/${id}`);
        setReviews(rev.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddReview = async (newReview) => {
    try {
      const res = await api.post(`/reviews/${id}`, newReview);
      setReviews([res.data, ...reviews]);
      toast.success("Review added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    }
  };
  
  if (loading) return <Loader />;
  if (!product) return <p className="text-center text-red-500 mt-10">Product not found</p>;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
      
        <div className="md:w-1/2">
          <ImageGallery images={product.images} mainImage={mainImage} setMainImage={setMainImage} />
        </div>

        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700 mb-2">
            <span className="font-bold">{product.brand}</span> | {product.description}
          </p>

          {product.variants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {product.variants.map((v, i) => (
                <span key={i} className="border px-2 py-1 rounded text-sm bg-gray-100 cursor-pointer">
                  {v.size} | {v.color} | {v.storage}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-2">
            <span className="text-2xl font-bold text-gray-900">{formatINR(discountedPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="line-through text-gray-400">{formatINR(product.price)}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">{product.discount}% OFF</span>
              </>
            )}
          </div>

          <div className="text-gray-600 mb-2">Stock: {product.stock}</div>

          <div className="flex gap-4 sticky top-0 z-10 bg-gray-50 p-2 rounded mb-4 shadow">
            <button
              onClick={() => { addToCart(product) }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg transition-colors duration-300"
            >
              Add to Cart
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-lg transition-colors duration-300">
              Buy Now
            </button>
          </div>

          <Reviews reviews={reviews} onAddReview={handleAddReview} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
