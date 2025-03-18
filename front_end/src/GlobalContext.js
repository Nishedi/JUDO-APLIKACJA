import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState(null);
  const [newPlayer, setNewPlayer] = useState(null);
  const [viewedPlayer, setViewedPlayer] = useState(null);
  const [sms, setSms] = useState(null);

  const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Załaduj dane z localStorage podczas montowania komponentu
  useEffect(() => {
    const storedGlobalVariable = localStorage.getItem('globalVariable');
    const storedNewPlayer = localStorage.getItem('newPlayer');
    const storedViewedPlayer = localStorage.getItem('viewedPlayer');
    const storedSms = localStorage.getItem('sms');
    if (storedGlobalVariable) setGlobalVariable(JSON.parse(storedGlobalVariable));
    if (storedNewPlayer) setNewPlayer(storedNewPlayer);
    if (storedViewedPlayer) {
      const player = JSON.parse(storedViewedPlayer);
      if(player.currentDate){
        player.currentDate = new Date(player.currentDate);
      }
      setViewedPlayer(player);
    };
    if (storedSms) {
      const smses = JSON.parse(storedSms);
      smses.forEach(sms => {
        sms.date = new Date(sms.date);
      });
      setSms(smses);
    }
  }, []);

  // Zapisz do localStorage za każdym razem, gdy zmienią się zmienne
  useEffect(() => {
    if (globalVariable !== null && globalVariable !== "Początkowa wartość") {
      localStorage.setItem('globalVariable', JSON.stringify(globalVariable));
    }
  }, [globalVariable]);
  
  useEffect(() => {
    if (newPlayer !== null) {
      localStorage.setItem('newPlayer', JSON.stringify(newPlayer));
    }
  }, [newPlayer]);
  
  useEffect(() => {
    if (viewedPlayer !== null) {
      localStorage.setItem('viewedPlayer', JSON.stringify(viewedPlayer));
    }
  }, [viewedPlayer]);
  useEffect(() => {
    if (sms !== null) {
      localStorage.setItem('sms', JSON.stringify(sms));
    }
  }, [sms]);
  if (globalVariable === null&&window.location.pathname!=="/") {
    return <div>Ładowanie...</div>;
  }

  return (
    <GlobalContext.Provider value={{ 
      globalVariable, setGlobalVariable,
      newPlayer, setNewPlayer,
      viewedPlayer, setViewedPlayer,
      supabase,
      sms, setSms
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
