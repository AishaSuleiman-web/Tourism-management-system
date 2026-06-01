import { Link } from "react-router-dom";
import guides from "../data/guides";

export default function Guides() {
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🌍 Explore Tour Guides</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {guides.map((guide) => (
          <Link
            key={guide.id}
            to={`/guide/${guide.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "12px",
                height: "360px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.3s",
                cursor: "pointer",
                backgroundColor: "white",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* IMAGE */}
              <img
                src={guide.image}
                alt={guide.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              {/* TEXT */}
              <div>
                <h3 style={{ margin: "8px 0 4px 0" }}>{guide.name}</h3>
                <p style={{ color: "gray", margin: "0" }}>
                  {guide.location}
                </p>
                <p style={{ fontSize: "12px", margin: "4px 0" }}>
                  {guide.experience}
                </p>
                <p style={{ fontWeight: "bold" }}>₦{guide.price}</p>
              </div>

              {/* BUTTON */}
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#0077ff",
                  color: "white",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#005fd1")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0077ff")
                }
              >
                View Guide
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}