import React, { useState } from 'react';
import axios from 'axios';

const UploadProduct = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(''); // State for category
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !description || !price || !image || !category) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('product_name', productName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('category', category); // Add category to form data

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/uploadProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setProductName('');
      setDescription('');
      setPrice('');
      setImage(null);
      setCategory(''); // Reset category
    } catch (err) {
      setError('Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center' }}>Upload Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="productName" style={{ display: 'block', marginBottom: '5px' }}>Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px' }}>Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
  <option value="">Select Category</option>

  {/* Home & Kitchen Categories */}
  <option value="Kitchen Appliances">Kitchen Appliances</option>
  <option value="Furniture">Furniture</option>
  <option value="Lighting">Lighting</option>
  <option value="Home Décor">Home Décor</option>
  <option value="Bedding">Bedding</option>
  <option value="Storage & Organization">Storage & Organization</option>
  <option value="Cleaning">Cleaning</option>
  <option value="Outdoor">Outdoor</option>

  {/* Fashion Categories */}
  <option value="Footwear">Footwear</option>
  <option value="Jeans">Jeans</option>
  <option value="Top">Top</option>
  <option value="Kurti">Kurti</option>
  <option value="Men">Men</option>
  <option value="Accessories">Accessories</option>
  <option value="Winterwear">Winterwear</option>

  {/* Product Categories (General) */}
  <option value="Electronics">Electronics</option>
  <option value="Mobiles">Mobiles</option>
  <option value="Laptops">Laptops</option>
  <option value="TV & Home Entertainment">TV & Home Entertainment</option>
  <option value="Audio">Audio</option>
  <option value="Cameras">Cameras</option>
  <option value="Computer Peripherals">Computer Peripherals</option>
  <option value="Smart Technology">Smart Technology</option>
  <option value="Musical Instruments">Musical Instruments</option>
  <option value="Office & Stationery">Office & Stationery</option>


          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Product Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            required
            style={{ padding: '3px' }}
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>Product uploaded successfully!</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: 'none',
            backgroundColor: '#4caf50',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px',
            marginTop: '10px',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
};

export default UploadProduct;
