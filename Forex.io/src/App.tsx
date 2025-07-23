import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavigationBar from './pages/NavigationBar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketPage';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignUpPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute>
              <NavigationBar />
              <DashboardPage />
            </PrivateRoute>} />

            <Route path="/markets" element={<PrivateRoute>
              <NavigationBar />
              <MarketsPage />
            </PrivateRoute>} />

            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;