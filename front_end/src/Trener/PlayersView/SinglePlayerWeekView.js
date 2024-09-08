import styles from './SinglePlayerWeekView.module.css';
import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../../GlobalContext';


const SinglePlayerWeekView = () => {
    const {viewedPlayer, setViewedPlayer} = useContext(GlobalContext);
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const now = new Date();
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwiec",
        "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];
    const [weeklyActivities, setWeeklyActivities] = useState([]);
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

    const getRangeToDatabase = (date) => {
        const { startOfWeek, endOfWeek } = getWeekDateRange(date);

        return {
            startOfWeek: `${String(startOfWeek.getDate()).padStart(2, '0')}.${String(startOfWeek.getMonth() + 1).padStart(2, '0')}.${startOfWeek.getFullYear()}`,
            endOfWeek: `${String(endOfWeek.getDate()).padStart(2, '0')}.${String(endOfWeek.getMonth() + 1).padStart(2, '0')}.${endOfWeek.getFullYear()}`
        };
    };


    const getWeekDays = async () => {
        const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
        const supabase = createClient(supabaseUrl, supabaseKey)
        const date = new Date();
        const { startOfWeek, endOfWeek } = getRangeToDatabase(date);
        let { data: aktywnosci, error } = await supabase
        .from('aktywności')
        .select('*')
        .gte('data', startOfWeek)
        .lte('data', endOfWeek)
        .eq('id_zawodnika', viewedPlayer.id)
        .eq('id_trenera', globalVariable.id)
        .order('data', { ascending: true });
        if (aktywnosci && aktywnosci.length !== 0) {
            setWeeklyActivities(aktywnosci);
        }
    }

    const getActivitiesForThatDay = (date) => {
        const formatedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
        const activitiesNumber = weeklyActivities.filter((activity) => {
            return activity.data === formatedDate;
        });
        return activitiesNumber;
    };

    const TreningStatusAndFeelingsAfter = ({ treningStatus, feelingsAfter }) => {
        const getStatusEmoticon = (treningStatus) => {
            switch (treningStatus) {
                case 'Nierozpoczęty':
                    return '⏳';  // Emotikona oczekiwania
                case 'Zrealizowany':
                    return '✅';  // Emotikona wykonania
                case 'Niezrealizowany':
                    return '❌';  // Emotikona niewykonania
                default:
                    return '🤷';  // Emotikona na wypadek nieznanego statusu
            }
        };
        const getFeelingsEmoticon = (feelingsAfter) => {
            switch (feelingsAfter) {
                case 'Bardzo źle':
                    return '😢';  // Bardzo źle
                case 'Źle':
                    return '😕';  // Źle
                case 'Neutralnie':
                    return '😐';  // Neutralnie
                case 'Dobrze':
                    return '🙂';  // Dobrze
                case 'Bardzo dobrze':
                    return '😁';  // Bardzo dobrze
                default:
                    return '😐';  // Brak emotikony, jeśli nie ma odczuć
            }
        };
    
        return (
            <div>
                <span>{getStatusEmoticon(treningStatus)}</span> {/* Emotikona statusu */}
                
                <span> {getFeelingsEmoticon(feelingsAfter)} {feelingsAfter}</span>
               
            </div>
        );
    };
    

    const WeekDay = ({ day, date}) => {
        const activities = getActivitiesForThatDay(date);
        return (
            <div className={styles.weekDay}>
                <div>
                    <p>{day}, {formatDate(date)}</p>
                    <div >
                        {activities
                            .sort((a, b) => {
                                const [hoursA, minutesA] = a.czas_rozpoczęcia.split(':').map(Number);
                                const [hoursB, minutesB] = b.czas_rozpoczęcia.split(':').map(Number);
                                if (hoursA !== hoursB) {
                                    return hoursA - hoursB;
                                }
                                return minutesA - minutesB;
                            })
                            .map((activity, index) => (
                                <div className={styles.singleActivityInfo} key={index}>
                                    <div>
                                        {activity.rodzaj_aktywności}
                                    </div>
                                    <div className={styles.singleActivity}>
                                        <div>
                                            {activity.czas_rozpoczęcia}
                                        </div>
                                        <TreningStatusAndFeelingsAfter 
                                            treningStatus={activity.status}
                                            feelingsAfter={activity.odczucia}
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    };
    useEffect(() => {
        getWeekDays();
    }
    , []);
    const { currentWeek } = getWeekRanges(now);

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        const startOfWeek = getWeekDateRange(date).startOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + i);
        return startOfWeek;
    });

    return (
        <div className={styles.background}>
            {console.log(viewedPlayer)}
            <div className={styles.navbar}>
                <div className={styles.date_div}>
                    {currentWeek}
                </div>
                <div className={styles.writing_div}>
                    {viewedPlayer.imie} {viewedPlayer.nazwisko}
                </div>
            </div>

            {/* Dni poszczególne */}
            <div className={styles.weeklist}>
                {daysOfWeek.map((date, index) => (
                    <WeekDay
                        key={index}
                        day={dayNames[date.getDay()]}
                        date={date}
                    />
                ))}
                
            </div>
            <button > XXX</button>
        </div>
    );
};

export default SinglePlayerWeekView;
