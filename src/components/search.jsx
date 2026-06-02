import React, { useState } from "react";

function SearchBar() {
  const [search, setSearch] = useState("");

  const items = ["React", "JavaScript", "Python", "C++"];

  const filteredItems = items.filter(item=> item.toLowerCase().includes(search.toLowerCase()));

  return(
    <div>
      <input type="text" 
      placeholder="Search..." 
      value= {search} 
      onChange= { (e) => setSearch(e.target.value)}
      />

      {/* <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default SearchBar;