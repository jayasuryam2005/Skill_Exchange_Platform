import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyProfilePage from './pages/profile/MyProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import UserProfilePage from './pages/profile/UserProfilePage';
import MatchesPage from './pages/MatchesPage';
import SearchPage from './pages/SearchPage';
import RequestsPage from './pages/RequestsPage';
import SessionsPage from './pages/SessionsPage';
import ChatPage from './pages/ChatPage';
import SchedulePage from './pages/SchedulePage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="matches" element={<MatchesPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="requests" element={<RequestsPage />} />
              <Route path="sessions" element={<SessionsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="profile" element={<MyProfilePage />} />
              <Route path="profile/edit" element={<EditProfilePage />} />
              <Route path="user/:id" element={<UserProfilePage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
