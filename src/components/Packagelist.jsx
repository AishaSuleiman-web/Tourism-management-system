import data from "../data/packages.json";

function PackageList({ addToCart }) {
  return (
    <div className="package-container">
      {data.map((pkg) => (
        <div key={pkg.id} className="card">
          <img src={pkg.image} alt={pkg.name} />

          <div className="card-content">
            <h3>{pkg.destination}</h3>
            <p>{pkg.duration}</p>
            <p>₦{pkg.price}</p>
            <p>{pkg.inclusions}</p>

            <button onClick={() => addToCart(pkg)}>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PackageList;