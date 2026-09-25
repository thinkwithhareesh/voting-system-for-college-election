import React, { createContext, useContext, useState, useEffect } from 'react';

const ElectionContext = createContext();

export const POSITIONS = [
  { id: 'president', title: 'PRESIDENT', label: 'President', step: 1 },
  { id: 'vice_president', title: 'VICE PRESIDENT', label: 'Vice President', step: 2 },
  { id: 'secretary', title: 'SECRETARY', label: 'Secretary', step: 3 },
  { id: 'joint_secretary', title: 'JOINT SECRETARY', label: 'Joint Secretary', step: 4 },
  { id: 'treasurer', title: 'TREASURER', label: 'Treasurer', step: 5 }
];

export const ElectionProvider = ({ children }) => {
  // Step: 0 = Home, 1..5 = Voting pages, 6 = Review, 7 = Success
  const [currentStep, setCurrentStep] = useState(0);
  const [electionStatus, setElectionStatus] = useState('ACTIVE');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Selections mapping position_id -> candidate Object
  const [selections, setSelections] = useState({
    president: null,
    vice_president: null,
    secretary: null,
    joint_secretary: null,
    treasurer: null
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return !!localStorage.getItem('mca_admin_token');
  });

  // Load initial candidates & election status
  const refreshData = async () => {
    setLoading(true);
    try {
      const [candRes, statusRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/election-status')
      ]);

      if (candRes.ok) {
        const candData = await candRes.json();
        setCandidates(candData);
      }
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setElectionStatus(statusData.status);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
      setError('Unable to connect to election server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Selection handler for position
  const selectCandidate = (positionId, candidate) => {
    setSelections(prev => ({
      ...prev,
      [positionId]: candidate
    }));
  };

  // Step navigation
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Reset student voting session
  const resetSession = () => {
    setSelections({
      president: null,
      vice_president: null,
      secretary: null,
      joint_secretary: null,
      treasurer: null
    });
    setCurrentStep(0);
  };

  // Submit Vote
  const submitVote = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        president_id: selections.president?.id,
        vice_president_id: selections.vice_president?.id,
        secretary_id: selections.secretary?.id,
        joint_secretary_id: selections.joint_secretary?.id,
        treasurer_id: selections.treasurer?.id
      };

      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit vote');
      }

      // Transition to success screen
      setCurrentStep(7);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSubmitting(false);
    }
  };

  // Admin Actions
  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('mca_admin_token', data.token);
        setIsAdminLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('mca_admin_token');
    setIsAdminLoggedIn(false);
  };

  const updateElectionStatus = async (status) => {
    try {
      const res = await fetch('/api/admin/election-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setElectionStatus(status);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <ElectionContext.Provider value={{
      currentStep,
      electionStatus,
      candidates,
      loading,
      submitting,
      error,
      selections,
      isAdminLoggedIn,
      selectCandidate,
      nextStep,
      prevStep,
      goToStep,
      resetSession,
      submitVote,
      refreshData,
      loginAdmin,
      logoutAdmin,
      updateElectionStatus,
      setError
    }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => useContext(ElectionContext);
