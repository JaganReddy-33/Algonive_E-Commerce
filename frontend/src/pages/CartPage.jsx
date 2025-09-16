import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateCartQty } = useContext(AppContext);
  const navigate = useNavigate();

  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          🛒 Your Cart is Empty
        </h2>
        <p className="text-gray-500">
          Looks like you haven’t added anything yet.
        </p>
      </div>
    );
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">🛍️ Your Shopping Cart</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center sm:justify-between border rounded-lg p-4 shadow-sm bg-white"
            >
              {/* Image - clickable */}
              <img
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded mb-3 sm:mb-0 cursor-pointer hover:opacity-80 transition"
                onClick={() => navigate(`/product/${item._id}`)}
              />

              {/* Details */}
              <div className="flex-1 sm:ml-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>

                {/* Quantity controls */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      if (item.qty > 1) {
                        updateCartQty(item._id, item.qty - 1);
                        toast.success("➖ Quantity decreased");
                      }
                    }}
                  >
                    -
                  </button>
                  <span className="px-3 font-semibold">{item.qty}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      updateCartQty(item._id, item.qty + 1);
                      toast.success("➕ Quantity increased");
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <p className="text-green-600 font-semibold mt-2">
                  {formatINR(item.price * item.qty)}
                </p>
              </div>

              {/* Remove button */}
              <button
                className="mt-3 sm:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  removeFromCart(item._id);
                  toast.success("❌ Item removed");
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="border rounded-lg p-6 shadow-sm bg-white h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Items ({cart.length})</span>
            <span>{formatINR(total)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
