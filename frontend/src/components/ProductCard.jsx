import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // ✅ Save product reference for scroll restoration
  useLayoutEffect(() => {
    if (!window.productRefs) window.productRefs = {};
    window.productRefs[product._id] = cardRef.current;

    return () => {
      // cleanup to avoid stale refs
      if (window.productRefs) {
        delete window.productRefs[product._id];
      }
    };
  }, [product._id]);

  const discountedPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  const goToProduct = () => {
    navigate(`/product/${product._id}`, {
      state: { fromProductId: product._id },
    });
  };

  return (
    <div
      ref={cardRef}
      className="bg-white border rounded-lg shadow hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group"
    >
      <div className="relative cursor-pointer" onClick={goToProduct}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span>{formatINR(discountedPrice)}</span>
          {product.discount > 0 && (
            <span className="line-through text-gray-400 text-base">
              {formatINR(product.price)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={goToProduct}
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors duration-300"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
