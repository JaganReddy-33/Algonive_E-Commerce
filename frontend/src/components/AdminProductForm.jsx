import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const AdminProductForm = ({ productId, onSuccess }) => {
  const navigate = useNavigate();
  const isEdit = !!productId;

  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    images: [""],
    variants: [{ size: "", color: "", storage: "" }],
    description: "",
    category: "",
  });

  // Fetch product if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setForm({
          name: data.name || "",
          brand: data.brand || "",
          price: data.price || "",
          discount: data.discount || "",
          stock: data.stock || "",
          images: data.images.length ? data.images : [""],
          variants: data.variants.length
            ? data.variants
            : [{ size: "", color: "", storage: "" }],
          description: data.description || "",
          category: data.category || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load product data");
        navigate("/admin");
      }
    };

    fetchProduct();
  }, [isEdit, productId, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });

  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariantField = () =>
    setForm({
      ...form,
      variants: [...form.variants, { size: "", color: "", storage: "" }],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/products/${productId}`, form);
        toast.success("✅ Product updated successfully!");
      } else {
        await api.post("/products", form);
        toast.success("✅ Product added successfully!");
      }
      onSuccess?.();
      setForm({
        name: "",
        brand: "",
        price: "",
        discount: "",
        stock: "",
        images: [""],
        variants: [{ size: "", color: "", storage: "" }],
        description: "",
        category: "",
      });
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-3 border rounded"
          required
        />
        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full p-3 border rounded"
        />

        {/* Images */}
        <div>
          <label className="font-semibold">Images</label>
          {form.images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) => handleImageChange(i, e.target.value)}
              placeholder={`Image URL ${i + 1}`}
              className="w-full p-2 border rounded mt-2"
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            + Add Image
          </button>
        </div>

        {/* Variants */}
        <div>
          <label className="font-semibold">Variants</label>
          {form.variants.map((variant, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mt-2">
              <input
                value={variant.size}
                onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                placeholder="Size"
                className="p-2 border rounded"
              />
              <input
                value={variant.color}
                onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                placeholder="Color"
                className="p-2 border rounded"
              />
              <input
                value={variant.storage}
                onChange={(e) =>
                  handleVariantChange(i, "storage", e.target.value)
                }
                placeholder="Storage"
                className="p-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addVariantField}
            className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            + Add Variant
          </button>
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
