import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const ProductCart = ({ product }) => {
  const { addToCart } = useContext(AppContext);
  const [localStock, setLocalStock] = useState(product.stock);

  const handleAddToCart = () => {
    if (localStock === 0) {
      toast.error(`${product.name} is out of stock ❌`);
      return;
    }

    addToCart(product);
    setLocalStock(localStock - 1); // decrease stock in UI
    toast.success(`${product.name} added to cart! 🛒`);
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <p className="text-xl font-bold">${product.price}</p>
      <p className="text-sm text-gray-600">
        Stock: {localStock > 0 ? localStock : "Out of stock"}
      </p>
      <button 
        className={`py-2 px-4 rounded w-full ${
          localStock === 0 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
        onClick={handleAddToCart}
        disabled={localStock === 0}
      >
        {localStock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCart;
