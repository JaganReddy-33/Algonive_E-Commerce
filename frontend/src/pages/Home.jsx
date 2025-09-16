import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Sync page & search from URL when component loads
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryPage = parseInt(queryParams.get("page")) || 1;
    const querySearch = queryParams.get("search") || "";

    setPage(queryPage);
    setSearch(querySearch);
  }, [location.search]);

  const fetchProducts = async (activePage, activeSearch) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/products?search=${activeSearch}&page=${activePage}&limit=12`
      );
      setProducts(data.products);
      setPages(data.pages);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch products when page/search changes
  useEffect(() => {
    if (page !== null) {
      fetchProducts(page, search);
    }
  }, [page, search]);

  // ✅ Smooth scroll back to product after navigation
  useLayoutEffect(() => {
    if (location.state?.fromProductId && window.productRefs) {
      const productEl = window.productRefs[location.state.fromProductId];
      if (productEl) {
        productEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // ✅ Clear state so it doesn’t re-trigger on refresh
        navigate(location.pathname + location.search, { replace: true });
      }
    }
  }, [products, location.state, navigate, location.pathname, location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    // ✅ Search always starts from page 1
    navigate(`/?search=${search}&page=1`);
  };

  const handlePageChange = (newPage) => {
    // ✅ Keep search term & set correct page in URL
    navigate(`/?search=${search}&page=${newPage}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* 🛒 Responsive Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
        {products.map((product) => (
          <div key={product._id} className="relative">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {pages}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(page + 1, pages))}
          disabled={page === pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
