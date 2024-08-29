import styles from './WeekView.module.css';
import React from 'react';
import { useState } from 'react';

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
        // Get the start of the week (Monday)
        const startOfWeek = new Date(date);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
        startOfWeek.setDate(diff);
        
        // End of the week (Sunday)
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
    

    // const weeklyDays = dayNames.map(day => (
    //     <div key={day} className={styles.weekDay}>
    //         {day}
    //     </div>
    // ));


    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        const startOfWeek = getWeekDateRange(date).startOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + i);
        return startOfWeek;
    });


    const weekDay = ({day, date, training}) => {
        return (
        <div className={styles.weekDay}>
                <div>
                    <h3>Dzień: {day}</h3>
                    <h3>Data: {date}</h3>
                    <p>Trening: {training}</p>
                </div>
            </div>
        );
    }

    const WeekView = () => {
        const now = new Date();
        const { currentWeek } = getWeekRanges(now);
    
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
                    <weekDay
                    day = {dayNames[0]}
                    date = {daysOfWeek[0]}
                    training = {true}
                    />
                    <weekDay
                    day = {dayNames[1]}
                    date = {daysOfWeek[1]}
                    training = {false}
                    />
                    <weekDay
                    day = {dayNames[2]}
                    date = {daysOfWeek[2]}
                    training = {true}
                    />
                </div>
            </div>
        );
    }
    
    export default WeekView;