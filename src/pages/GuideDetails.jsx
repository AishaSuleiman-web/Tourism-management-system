import { useParams, useNavigate } from "react-router-dom";
import guides from "../data/guides";

export default function GuideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const guide = guides.find((g) => g.id === Number(id));

  if (!guide) return <h2 style={{ padding: "20px" }}>Guide not found</h2>;

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>{guide.name}</h1>

      <img
        src={guide.image}
        alt={guide.name}
        style={{
          width: "100%",
          borderRadius: "12px",
          marginTop: "10px",
        }}
      />

      <div style={{ marginTop: "15px" }}>
        <p><b>📍 Location:</b> {guide.location}</p>
        <p><b>💰 Price:</b> ₦{guide.price}</p>
      </div>

      <p
        style={{
          fontStyle: "italic",
          color: "gray",
          marginTop: "10px",
          lineHeight: "1.5",
        }}
      >
        {guide.story}
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h2>🧭 Book This Experience</h2>

      {/* Date */}
      <label>Date:</label>
      <br />
      <input
        type="date"
        style={{
          padding: "8px",
          width: "100%",
          marginTop: "5px",
          marginBottom: "15px",
        }}
      />

      {/* Group Size */}
      <label>Group Size:</label>
      <br />
      <select
        style={{
          padding: "8px",
          width: "100%",
          marginTop: "5px",
          marginBottom: "15px",
        }}
      >
        <option>1 Person</option>
        <option>2 People</option>
        <option>3 People</option>
        <option>4+ People</option>
      </select>

      {/* Duration */}
      <label>Duration:</label>
      <br />
      <select
        style={{
          padding: "8px",
          width: "100%",
          marginTop: "5px",
          marginBottom: "20px",
        }}
      >
        <option>1 Day</option>
        <option>2 Days</option>
        <option>3 Days</option>
      </select>

      {/* Button */}
      <button
        onClick={() => navigate("/confirmation")}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#1e7e34")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#28a745")
        }
      >
        Book Now
      </button>
    </div>
  );
}