import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import YourRides from './pages/YourRides';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/yourRides" element={<YourRides />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;