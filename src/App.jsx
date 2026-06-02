import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import PackageList from "./components/PackageList";
import Cart from "./components/Cart";
import Payment from "./components/Payment";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <div>
      <h1>Tourist Travel Packages</h1>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PackageList addToCart={addToCart} />} />

        <Route
          path="/cart"
          element={
            <Cart cart={cart} removeFromCart={removeFromCart} />
          }
        />

        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;