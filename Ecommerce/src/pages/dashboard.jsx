import React, { useState, useEffect } from "react";
import QRCode from 'react-qr-code';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRCode, setShowQRCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "All" 
    ? products.filter((product) => product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    : products.filter((product) => 
        product.category === selectedCategory && product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const addToWishlist = (product) => {
    if (!wishlist.some((item) => item._id === product._id)) {
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      showNotification(`${product.productName} added to Wishlist!`);
    }
  };

  const addToCart = (product) => {
    if (!cart.some((item) => item._id === product._id)) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      showNotification(`${product.productName} added to Cart!`);
    }
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleLogin = () => {
    localStorage.setItem("token", "your_token_value");
    setIsLoggedIn(true);
    alert("Login functionality to be implemented.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleProceedToPayment = () => {
    const totalAmount = cart.reduce((total, product) => total + product.price, 0);
    const finalAmount = totalAmount.toFixed(2);
    const upiPaymentUrl = `upi://pay?pa=merchant@okhdfcbank&pn=merchant&am=${finalAmount}&cu=INR`;

    setShowCartModal(false);
    setShowQRCode(upiPaymentUrl);
  };

  const categories = ["All", "Footwear", "Jeans", "Top", "Kurti", "Accessories", "Winterwear"];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "0" }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, width: "100%", padding: "15px 20px", backgroundColor: "#ff4757", color: "white", zIndex: 1000,
        display: "flex", justifyContent: "space-between", alignItems: "center", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>SmartShop</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginRight: '6%' }}>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 12px", fontSize: "14px", borderRadius: "5px", border: "1px solid #fff", outline: "none", width: "200px"
            }}
          />
          {isLoggedIn ? (
            <button style={{
              backgroundColor: "#ff6b81", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", transition: "0.3s"
            }} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button style={{
              backgroundColor: "#1e90ff", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", transition: "0.3s"
            }}>
              <a href="/login" style={{ color: "white" }}>Login</a>
            </button>
          )}

          <div style={{
            position: "relative", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center"
          }} onClick={() => setShowWishlistModal(true)}>
            🧡 <span style={{
              position: "absolute", top: "-8px", right: "-8px", backgroundColor: "red", color: "white", fontSize: "12px", padding: "2px 6px", borderRadius: "50%"
            }}>{wishlist.length}</span>
          </div>

          <div style={{
            position: "relative", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center"
          }} onClick={() => setShowCartModal(true)}>
            🛒 <span style={{
              position: "absolute", top: "-8px", right: "-8px", backgroundColor: "red", color: "white", fontSize: "12px", padding: "2px 6px", borderRadius: "50%"
            }}>{cart.length}</span>
          </div>
        </div>
      </nav>
      <div style={{ marginTop: "80px", padding: "20px" }}>
  <h2 style={{ fontSize: "28px", marginBottom: "20px", color: "#333" }}>Recommended for You</h2>
  <div style={{
    display: "flex", overflowX: "auto", gap: "20px", paddingBottom: "20px",
  }}>
    {products.slice(0, 10).reverse().map((product) => (
      <div key={product._id} style={{
        backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px", textAlign: "center", flexShrink: 0, width: "250px", height: "380px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        overflow: "hidden", transition: "transform 0.3s ease"
      }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <img src={product.imageUrl} alt={product.productName} style={{
          width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }} />
        <h4>{product.productName}</h4>
        
        <h3>{product.price} ₹</h3>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => addToCart(product)}
            style={{
              backgroundColor: "#ff6b81", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer"
            }}>
            Add to Cart
          </button>
          <button
            onClick={() => addToWishlist(product)}
            style={{
              backgroundColor: "#ff914d", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer"
            }}>
            Add to Wishlist
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
<hr/>
<div style={{ marginTop: "-40px", padding: "20px", backgroundColor: "#f4f7f9" }}>
  {/* Segmented Control for Categories */}
  <h2 style={{ fontSize: "32px", marginBottom: "30px", color: "#333", fontWeight: "600" }}>Product Catalogue</h2>

  <div style={{
    display: "flex", overflowX: "auto", marginBottom: "30px", borderBottom: "2px solid #ddd", paddingBottom: "10px", position: "relative"
  }}>
    {categories.map((category) => (
      <div
        key={category}
        onClick={() => setSelectedCategory(category)}
        style={{
          padding: "12px 30px", cursor: "pointer", fontSize: "16px", fontWeight: selectedCategory === category ? "bold" : "normal",
          color: selectedCategory === category ? "#ff4757" : "#555", borderBottom: selectedCategory === category ? "3px solid #ff4757" : "none", 
          transition: "all 0.3s ease", whiteSpace: "nowrap", marginRight: "20px", textTransform: "uppercase"
        }}
      >
        {category}
      </div>
    ))}
  </div>

  {/* Product List */}
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "30px" }}>
    {filteredProducts.map((product) => (
      <div key={product._id} style={{
        backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        padding: "20px", textAlign: "center", transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer", 
        height: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative"
      }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>

        <img src={product.imageUrl} alt={product.productName} style={{
          width: "100%", height: "250px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px"
        }} />
        
        <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#333", marginTop: "10px" }}>{product.productName}</h3>
        <p style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}>Rs. {product.price}</p>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "10px" }}>
          <button onClick={() => addToCart(product)} style={{
            backgroundColor: "#1e90ff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", 
            cursor: "pointer", transition: "background-color 0.3s", fontWeight: "600", width: "100%",
            textAlign: "center"
          }}>
            Add to Cart
          </button>
          
          <button onClick={() => addToWishlist(product)} style={{
            backgroundColor: "#ff4757", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", 
            cursor: "pointer", transition: "background-color 0.3s", fontWeight: "600", width: "100%", 
            textAlign: "center"
          }}>
            Add to Wishlist
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

   
      {showWishlistModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeIn 0.5s"
        }}>
          <div style={{
            backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "90%", maxWidth: "400px", position: "relative", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
          }}>
            <button style={{
              position: "absolute", top: "10px", right: "10px", background: "none", border: "none", fontSize: "18px", cursor: "pointer"
            }} onClick={() => setShowWishlistModal(false)}>
              ×
            </button>
            <h2 style={{ marginBottom: "20px" }}>Wishlist</h2>
            {wishlist.length > 0 ? (
              wishlist.map((item) => (
                <div key={item._id} style={{ marginBottom: "15px" }}>
                  <strong>{item.productName}</strong>
                  <button style={{
                    backgroundColor: "#dc3545", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer",
                    marginLeft: "10px"
                  }} onClick={() => removeFromWishlist(item._id)}>
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div>No items in wishlist.</div>
            )}
          </div>
        </div>
      )}
      {/* Cart Modal */}
      {showCartModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000, animation: "fadeIn 0.5s"
        }}>
          <div style={{
            backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "90%", maxWidth: "400px", position: "relative", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
          }}>
            <button style={{
              position: "absolute", top: "10px", right: "10px", background: "none", border: "none", fontSize: "18px", cursor: "pointer"
            }} onClick={() => setShowCartModal(false)}>
              ×
            </button>
            <h2 style={{ marginBottom: "20px" }}>Cart</h2>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item._id} style={{ marginBottom: "15px" }}>
                  <strong>{item.productName}</strong>
                  <button style={{
                    backgroundColor: "#dc3545", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer",
                    marginLeft: "10px", transition: "background-color 0.3s"
                  }} onClick={() => removeFromCart(item._id)}>
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div>No items in cart.</div>
            )}
            <button style={{
              backgroundColor: "#007bff", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "20px"
            }} onClick={handleProceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
      {showQRCode && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000, animation: "fadeIn 0.5s"
        }}>
          <div style={{
            backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "90%", maxWidth: "400px", position: "relative", textAlign: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
          }}>
            <button style={{
              position: "absolute", top: "10px", right: "10px", background: "none", border: "none", fontSize: "18px", cursor: "pointer"
            }} onClick={() => setShowQRCode("")}>
              ×
            </button>

            <h2 style={{ marginBottom: "20px", color: "#ff4757" }}>Scan to Pay</h2>
            <QRCode value={showQRCode} size={200} />
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && <div style={{
        position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#28a745", color: "white",
        padding: "10px 20px", borderRadius: "4px", zIndex: 2000, transition: "opacity 0.5s", animation: "fadeIn 0.3s"
      }}>{notification}</div>}
    </div>
  );
};


export default Dashboard;
