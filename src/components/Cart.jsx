import { useNavigate } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Cart</h2>

      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <h4>{item.destination}</h4>
          <p>₦{item.price}</p>

          <button onClick={() => removeFromCart(index)}>
            Remove
          </button>
        </div>
      ))}

      <h3 style={{ textAlign: "center" }}>Total: ₦{total}</h3>

      <button onClick={() => navigate("/payment")}>
        Checkout
      </button>
    </div>
  );
}

export default Cart;