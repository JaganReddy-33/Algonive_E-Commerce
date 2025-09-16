import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true" || false,
  });

  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  // ✅ Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ User auth
  const login = (token, isAdmin) => {
    setUser({ token, isAdmin });
    localStorage.setItem("token", token);
    localStorage.setItem("isAdmin", isAdmin);
  };

  const logout = () => {
    setUser({ token: null, isAdmin: false });
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
  };

  // ✅ Add item to cart
  const addToCart = (product) => {
  setCart((prev) => {
    const exists = prev.find((p) => p._id === product._id);

    if (exists) {
      // update qty
      return prev.map((p) =>
        p._id === product._id ? { ...p, qty: p.qty + 1 } : p
      );
    } else {
      // add new product
      return [...prev, { ...product, qty: 1 }];
    }
  });

  // ✅ toast AFTER state update decision
  const exists = cart.find((p) => p._id === product._id);
  if (exists) {
    toast.success("Quantity updated 🛒");
  } else {
    toast.success("Added to cart 🛍️");
  }
};


  // ✅ Remove item completely
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p._id !== productId));
    toast.success("❌ Item removed");
  };

  // ✅ Update item quantity (+ / -)
  const updateCartQty = (productId, qty) => {
    if (qty < 1) return; // prevent 0 or negative
    setCart((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, qty } : p
      )
    );
  };

  return (
    <AppContext.Provider
      value={{ user, login, logout, cart, addToCart, removeFromCart, updateCartQty }}
    >
      {children}
    </AppContext.Provider>
  );
};
