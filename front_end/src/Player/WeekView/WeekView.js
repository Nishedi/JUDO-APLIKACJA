import styles from './WeekView.module.css';
import React from 'react';

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

const WeekDay = ({ day, date, training }) => {
    return (
        <div className={styles.weekDay}>
            <div>
                <p>{day}, {formatDate(date)}</p>
                <body>Trening: {training ? "Tak" : "Nie"}</body>
            </div>
        </div>
    );
};

const WeekView = () => {
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
        </div>
    );
};

export default WeekView;
