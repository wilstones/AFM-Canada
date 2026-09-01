import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Events from './pages/Events';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import JoinUs from './pages/JoinUs';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('afm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
   <Router basename="/AFM-Canada">
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
		  <Route path="/join-us" element={<JoinUs />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
