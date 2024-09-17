import React, { createContext, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState('Początkowa wartość');
  const [newPlayer, setNewPlayer] = useState(null);
  const [viewedPlayer, setViewedPlayer] = useState(null);
  const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
  const supabase = createClient(supabaseUrl, supabaseKey)
  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable,
      newPlayer, setNewPlayer,
      viewedPlayer, setViewedPlayer,
      supabase }}>
      {children}
    </GlobalContext.Provider>
  );
};
