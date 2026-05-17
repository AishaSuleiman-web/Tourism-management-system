import React from "react";

const hotels = [
  {
    id: 1,
    name: "Eko Hotel",
    location: "Lagos",
    price: 50000,
  },
  {
    id: 2,
    name: "Transcorp Hilton",
    location: "Abuja",
    price: 70000,
  },
];

function Hotels() {
  return (
    <div>
      <h1>Hotels</h1>

      {hotels.map((hotel) => (
        <div key={hotel.id}>
          <h3>{hotel.name}</h3>
          <p>{hotel.location}</p>
          <p>₦{hotel.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Hotels;
