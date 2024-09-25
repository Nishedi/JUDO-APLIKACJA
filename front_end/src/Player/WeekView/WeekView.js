import styles from './WeekView.module.css';
import React, {useContext, useEffect, useState} from 'react';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';
import {TreningStatusAndFeelingsAfter} from '../../CommonFunction';



const WeekView = () => {
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const navigate = useNavigate();

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
        const date = new Date();
        const { startOfWeek, endOfWeek } = getRangeToDatabase(date);
        let { data: aktywnosci, error } = await supabase
        .from('aktywności')
        .select('*')
        .gte('data', startOfWeek)
        .lte('data', endOfWeek)
        .eq('id_zawodnika', globalVariable.id)
        .eq('id_trenera', globalVariable.id_trenera)
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
    
    const goToSingleDay = (date) => {
        if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            navigate("/player/dayview");
        } else {
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
            setGlobalVariable({ ...globalVariable, date: formattedDate });
            navigate("/player/anotherdayview");
        }
    }

    const WeekDay = ({ day, date}) => {
        const activities = getActivitiesForThatDay(date);
        return (
            <div onClick={()=>goToSingleDay(date)} className={styles.weekDay}>
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
            <div className={styles.navbar}>
                <div className={styles.date_div}>
                    {currentWeek}
                </div>
                <div className={styles.writing_div}>
                    {globalVariable.imie} <br/> {globalVariable.nazwisko}
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
        </div>
    );
};

export default WeekView;
