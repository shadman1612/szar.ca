import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Link } from "react-router-dom";
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { CreateService } from './pages/CreateService';
import { VolunteerApplication } from './pages/VolunteerApplication';
import { Profile } from './pages/Profile';
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import BecomeSponsor from "./pages/BecomeSponsor";
import ThankYouSponsor from "./pages/ThankYouSponsor";
import { Auth } from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <nav className="bg-white shadow-md mb-6">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between items-center py-4">
                <div className="text-xl font-semibold text-gray-800">
                  
                </div>
                <ul className="flex space-x-6 text-gray-600 text-sm font-medium">
                  <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
                  <li><Link to="/about-us" className="hover:text-blue-600 transition">About Us</Link></li>
                  <li><Link to="/contact-us" className="hover:text-blue-600 transition">Contact Us</Link></li>
                  <li><Link to="/become-a-sponsor" className="hover:text-blue-600 transition">Sponsor</Link></li>
                </ul>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/create" element={<CreateService />} />
            <Route path="/services/:serviceId/volunteer" element={<VolunteerApplication />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/become-a-sponsor" element={<BecomeSponsor />} />
            <Route path="/thank-you-sponsor" element={<ThankYouSponsor />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;