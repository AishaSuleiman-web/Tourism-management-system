import { BrowserRouter, Routes, Route } from "react-router-dom";
import Guides from "./pages/Guides";
import GuideDetails from "./pages/GuideDetails";
import Confirmation from "./pages/Confirmation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Guides />} />
        <Route path="/guide/:id" element={<GuideDetails />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}