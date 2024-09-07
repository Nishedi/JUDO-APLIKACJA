import styles from './SinglePlayerWeekView.module.css';
import React from 'react';
import { createClient } from '@supabase/supabase-js';

const now = new Date();
const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
const monthNames = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwiec",
    "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];

const formatDate = (date) => {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
};

const getWeekDateRange = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return { startOfWeek, endOfWeek };
};

const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const getWeekRanges = (currentDate) => {
    const { startOfWeek: currentWeekStart, endOfWeek: currentWeekEnd } = getWeekDateRange(currentDate);

    return {
        currentWeek: formatDateRange(currentWeekStart, currentWeekEnd),
    };
};

const getWeekDays = async () => {
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    let { data: aktywnosci, error } = await supabase
    .from('aktywności')
    .select('*')
    .gte('data', '06.09.2024')
    .lte('data', '06.09.2024')
    .order('data', { ascending: true });
    if (aktywnosci && aktywnosci.length !== 0) {
        console.log(aktywnosci);
    }
}

const WeekDay = ({ day, date, training }) => {
    return (
        <div className={styles.weekDay}>
            <div>
                <p>{day}, {formatDate(date)}</p>
                <p>Trening: {training ? "Tak" : "Nie"}</p>
                
            </div>
            
        </div>
        
    );
};

const SinglePlayerWeekView = () => {
    const now = new Date();
    const { currentWeek } = getWeekRanges(now);

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        const startOfWeek = getWeekDateRange(date).startOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + i);
        return startOfWeek;
    });

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.date_div}>
                    {currentWeek}
                </div>
                <div className={styles.writing_div}>
                    Konrad Pempera
                </div>
            </div>

            {/* Dni poszczególne */}
            <div className={styles.weeklist}>
                {daysOfWeek.map((date, index) => (
                    <WeekDay
                        key={index}
                        day={dayNames[date.getDay()]}
                        date={date}
                        training={index % 2 === 0}  // Dodajemy trening co drugi dzień
                    />
                ))}
                
            </div>
            <button onClick={getWeekDays}> XXX</button>
        </div>
    );
};

export default SinglePlayerWeekView;
