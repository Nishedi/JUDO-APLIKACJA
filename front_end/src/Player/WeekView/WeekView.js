import styles from './WeekView.module.css';
import React, {useContext, useEffect, useState} from 'react';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';
import {TreningStatusAndFeelingsAfter} from '../../CommonFunction';
import SideBarCalendar from "./../DayView/SideBarCalendar";
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const WeekView = () => {
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [currentDate, setCurrentDate] = useState(new Date());
    const dayNames = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", 
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
   const [weeklyActivities, setWeeklyActivities] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

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

    const generateDateArray = (startDateStr, endDateStr) => {
        const [startDay, startMonth, startYear] = startDateStr.split('.').map(Number);
        const [endDay, endMonth, endYear] = endDateStr.split('.').map(Number);
    
        const startDate = new Date(startYear, startMonth - 1, startDay); // Miesiące są zero-indeksowane
        const endDate = new Date(endYear, endMonth - 1, endDay);
        
        const dates = [];
    
        // Wypełnianie tablicy datami
        while (startDate <= endDate) {
            const formattedDate = `${String(startDate.getDate()).padStart(2, '0')}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${startDate.getFullYear()}`;
            dates.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1); // Przejdź do następnego dnia
        }
    
        return dates;
    };

    const getWeekDays = async () => {
        const date = currentDate;
        const { startOfWeek, endOfWeek } = getRangeToDatabase(date);
        const dates = generateDateArray(startOfWeek, endOfWeek);
        let { data: aktywnosci} = await supabase
        .from('aktywności')
        .select('*')
        .in('data', dates)
        .eq('id_zawodnika', globalVariable.id)
        .eq('id_trenera', globalVariable.id_trenera)
        .order('data', { ascending: true });
        if (aktywnosci && aktywnosci.length !== 0) {
            setWeeklyActivities(aktywnosci);
        }else{
            if(aktywnosci.length === 0){
                setWeeklyActivities([]);
            }
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
        // Sprawdzenie, czy dzień jest dzisiejszy
        const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth();
        
        return (
            <div onClick={()=>goToSingleDay(date)} 
                className={`${styles.weekDay} ${isToday ? styles.todayBorder : ''}`}  // Dodanie klasy ramki dla dzisiejszego dnia
            >
                <div>
                    <p>{day}, {formatDate(date)} {isToday ?  <span className={styles.todayText}>dzisiaj</span> : null}</p>
                    <div>
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

    const updateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    };

    useEffect(() => {
        getWeekDays();
    }, [currentDate]);

    const { currentWeek } = getWeekRanges(currentDate);
    
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        const startOfWeek = getWeekDateRange(date).startOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + i);
        return startOfWeek;
    });
    
    const onLogOutClick = () => {
        setGlobalVariable(null);
        navigate('/');
    }


    return (
        <div className={styles.background}>
            <SideBarCalendar onLogOutClick={onLogOutClick} name={globalVariable.imie} isOpen={isSidebarOpen} player={globalVariable}/>
                <div className={styles.navbar}>
                    <div className={styles.burgerAndDate}>
                            <RxHamburgerMenu onClick={toggleSidebar}/>
                        {/*  onClick={goToPlayerProfile} */}
                        <div className={styles.writing_div}>
                            {globalVariable.imie} {globalVariable.nazwisko}
                        </div>
                        <div style={{margin:"0px 20px"}}></div>
                    </div>
                    <div className={styles.date_div}>
                            <button  onClick={() => updateWeek('prev')} className={styles.arrowButton}>
                                <IoIosArrowBack />
                            </button>
                            {currentWeek}
                            <button onClick={() => updateWeek('next')} className={styles.arrowButton}>
                                <IoIosArrowForward />
                            </button>
                        </div>
                
                </div>

            {/* Dni poszczególne */}
            <div 
                className={styles.weeklist}
                onClick={toggleSidebar}
            >
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
