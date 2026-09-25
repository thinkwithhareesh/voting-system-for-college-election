import React, { useState } from 'react';
import { ElectionProvider, useElection } from './context/ElectionContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VotingWizard } from './pages/VotingWizard';
import { ReviewPage } from './pages/ReviewPage';
import { SuccessPage } from './pages/SuccessPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Footer } from './components/Footer';

const MainApp = () => {
  const { currentStep, isAdminLoggedIn } = useElection();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setShowDashboard(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  if (showDashboard && isAdminLoggedIn) {
    return <AdminDashboard onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-transparent text-[#294238]">
      <Header onOpenAdminLogin={handleAdminClick} />

      <main className="flex-grow">
        {currentStep === 0 && <Hero />}
        {currentStep >= 1 && currentStep <= 5 && <VotingWizard />}
        {currentStep === 6 && <ReviewPage />}
        {currentStep === 7 && <SuccessPage />}
      </main>

      <Footer />

      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminLoginOpen(false);
          setShowDashboard(true);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ElectionProvider>
      <MainApp />
    </ElectionProvider>
  );
}
