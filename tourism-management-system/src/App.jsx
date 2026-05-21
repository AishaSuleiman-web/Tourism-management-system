import {BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About"
import NotFound from "./pages/NotFound";
import Footer from "./components/footer";
import Navbar from "./components/navbar";

 function App(){
  return (
    <BrowserRouter>
    <div className="app">

      <Navbar/>

      <main className="main-content">

        <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
      </Routes>

      </main>

      <Footer/>
      
    </div>
      
    </BrowserRouter>
  );
}

export default App;