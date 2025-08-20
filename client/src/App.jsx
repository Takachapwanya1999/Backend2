import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddListing from './pages/AddListing';
import Layout from './components/ui/Layout';
import IndexPage from './pages/IndexPage';
import SearchPage from './pages/SearchPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import BookingsPage from './pages/BookingsPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import SingleBookedPlace from './pages/SingleBookedPlace';
import ExperiencesPage from './pages/ExperiencesPage';
import ServicesPage from './pages/ServicesPage';
import AdminDashboard from './pages/AdminDashboard';
import DevPostPage from './pages/DevPostPage';

import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getItemFromLocalStorage } from './utils';
import NotFoundPage from './pages/NotFoundPage';
import { Header } from './components/ui/Header';


function App() {
  // Token setup is now handled in UserProvider or with fetch API.

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidGoogleConfig = googleClientId && googleClientId !== 'your_google_client_id_here';

  return (
    <>
      {hasValidGoogleConfig ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <UserProvider>
            <PlaceProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<IndexPage />} />
                  <Route path="/places" element={<SearchPage />} />
                  <Route path="/experiences" element={<ExperiencesPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<ProfilePage />} />
                  <Route path="/account/places" element={<PlacesPage />} />
                  <Route path="/account/places/new" element={<PlacesFormPage />} />
                  <Route path="/account/places/:id" element={<PlacesFormPage />} />
                  <Route path="/place/:id" element={<PlacePage />} />
                  <Route path="/account/bookings" element={<BookingsPage />} />
                  <Route
                    path="/account/bookings/:id"
                    element={<SingleBookedPlace />}
                  />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/dev/post" element={<DevPostPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
              <ToastContainer autoClose={2000} transition={Slide} />
            </PlaceProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      ) : (
        <UserProvider>
          <PlaceProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path="/places" element={<SearchPage />} />
                <Route path="/experiences" element={<ExperiencesPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/account/places" element={<PlacesPage />} />
                <Route path="/account/places/new" element={<PlacesFormPage />} />
                <Route path="/account/places/:id" element={<PlacesFormPage />} />
                <Route path="/place/:id" element={<PlacePage />} />
                <Route path="/account/bookings" element={<BookingsPage />} />
                <Route
                  path="/account/bookings/:id"
                  element={<SingleBookedPlace />}
                />
                 <Route
                  path="/add-user"
                  element={<AddListing/>}
                />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dev/post" element={<DevPostPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <ToastContainer autoClose={2000} transition={Slide} />
          </PlaceProvider>
        </UserProvider>
      )}
    </>
  );
}

export default App;
