import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import AdminProductForm from "../components/AdminProductForm";

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const productRefs = useRef({}); // to scroll back after edit

  const navigate = useNavigate();

  // ✅ Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await api.get("/admin");
        setAdminData(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Access denied");
      }
    };
    fetchAdmin();
  }, [navigate]);

  // ✅ Fetch products with pagination (16 per page for Admin)
  const fetchProducts = async (pageNum = 1) => {
    try {
      const res = await api.get(`/products?page=${pageNum}&limit=16`);
      const productList = Array.isArray(res.data)
        ? res.data
        : res.data.products;

      setProducts(productList || []);
      setPages(res.data.pages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // ✅ After edit success → close popup + scroll to product
  const handleEditSuccess = () => {
    const editedId = editingProductId;
    setEditingProductId(null); // close modal
    fetchProducts(page).then(() => {
      if (productRefs.current[editedId]) {
        productRefs.current[editedId].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  // ✅ Lock background scroll when popup open
  useEffect(() => {
    if (editingProductId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editingProductId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow-md">
          <h2 className="text-xl font-bold">⚠️ {error}</h2>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">👑 Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">
        Welcome, <span className="font-semibold">{adminData.name}</span> (
        {adminData.email})
      </p>

      {/* ✅ Add Product Form at top */}
      <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>
      <AdminProductForm onSuccess={() => fetchProducts(page)} />

      {/* ✅ Product List with 4 × 4 grid */}
      <h2 className="text-2xl font-bold mt-8 mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              ref={(el) => (productRefs.current[product._id] = el)}
              className="border p-4 rounded shadow hover:shadow-lg"
            >
              {/* ✅ Clicking image → product page */}
              <img
                src={product.images?.[0] || ""}
                alt={product.name}
                className="w-full h-48 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              />
              <h2 className="font-bold mt-2">{product.name}</h2>
              <p className="text-gray-700">
                <span className="font-semibold">{product.brand}</span> •{" "}
                {product.description}
              </p>
              <p className="mt-1 font-bold">₹{product.price}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditingProductId(product._id)}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await api.delete(`/products/${product._id}`);
                      toast.success("✅ Product deleted!");
                      fetchProducts(page);
                    } catch (err) {
                      toast.error(err.response?.data?.message || err.message);
                    }
                  }}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products yet.</p>
        )}
      </div>

      {/* ✅ Pagination controls */}
      {pages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <span className="px-4 py-2 font-semibold">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* ✅ Popup Modal for Editing */}
      {editingProductId && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          style={{ overflowY: "auto" }}
        >
          <div
            className="relative bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setEditingProductId(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">✏️ Edit Product</h2>

            <AdminProductForm
              productId={editingProductId}
              onSuccess={handleEditSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
