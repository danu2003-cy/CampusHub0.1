import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

/**
 * Root component establishing the global layout (Navbar, Sidebar)
 * and providing the routing context.
 */
function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <AppRoutes />
        </main>
      </div>
      <Footer />
      <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
    </div>
  );
}

export default App;
