import React from "react";

const ImageGallery = ({ images = [], mainImage, setMainImage }) => {
  if (!images || images.length === 0) return <p>No Images</p>;

  return (
    <div className="flex flex-col">
      {/* Main Image */}
      <div className="border rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
        <img
          src={mainImage || images[0]}
          alt="Product"
          className="w-full max-h-[400px] object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`border rounded-lg cursor-pointer p-1 flex-shrink-0 ${
              img === mainImage ? "border-blue-600" : "border-gray-300"
            }`}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="h-20 w-20 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
