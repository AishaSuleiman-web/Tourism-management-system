import Navbar from "../components/navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/footer";


function Home(){
  return (
    <div>
     <Navbar />

    <section className="hero">

      <div className="hero-content"> 
     <h1>Discover Amazing Places Around Nigeria</h1>
     <p>
      Find hotels, tour guides, and travel packages easily!
     </p>
     
     <SearchBar/>
      </div>
     </section>
  


    <section className="categories">
      <div className="category-card">
        <img src="/images/hotels.webp" alt="hotels" />
        <p>Hotel Bookings</p>
      </div>

       <div className="category-card">
       <img src="/images/Tickets.webp" alt="tickets" />
       <p>Attraction Tickets</p>
      </div>

       <div className="category-card">
        <img src="/images/tours.webp" alt="tours" />
        <p>Tour guides</p>
      </div>

       <div className="category-card">
        <img src="/images/transport.webp" alt="transport" />
        <p>Flights</p>
      </div>

       <div className="category-card">
        <img src="/images/CarRental.webp" alt="rental" />
        <p>Car Rentals</p>
      </div> 
    </section>


      <Footer />
     
    </div>
  );
};

export default Home;