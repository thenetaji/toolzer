import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import Contact from "./pages/Contact.jsx";
import API from "./pages/Api.jsx";
import About from "./pages/About.jsx";
import ToolsPage from "./pages/Tools.jsx";
import Loader from "./components/Loader";
import NotFound from "./pages/404";

// Navigation wrapper component to handle loading states
function NavigationHandler({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location.pathname);
  
  useEffect(() => {
    // Only show loader if location actually changed
    if (location.pathname !== prevLocation) {
      setIsLoading(true);
      // Simulate a minimum loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevLocation(location.pathname);
      }, 1200); // Show loader for at least 1.2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);
  
  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/api" element={<API />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/docs" element={<p>Coming soon</p>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col dark:bg-gray-950 transition-colors duration-300">
        <Header />
        <NavigationHandler>
          <main className="flex-1 p-4">
            <AppRoutes />
          </main>
        </NavigationHandler>
        <Footer />
      </div>
    </Router>
  );
}

export default App;