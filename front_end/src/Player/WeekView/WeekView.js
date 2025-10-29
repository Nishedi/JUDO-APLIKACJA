import styles from './WeekView.module.css';
import React, {useContext, useEffect, useState} from 'react';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate, useParams } from 'react-router-dom';
import {TreningStatusAndFeelingsAfter, getActivityTypeColor, getMultiDayActivityEmoji} from '../../CommonFunction';
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
    const  viewType  = useParams().viewtype;
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const [multiDayActivities, setMultiDayActivities] = useState([]);

    const formatDate = (date) => {
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        return `${day} ${month}`;
    };
    const getWeekDateRange = (date) => {
        const startOfWeek = new Date(date);
        if(viewType !== 'week')
            startOfWeek.setDate(1);
        const endOfWeek = new Date(startOfWeek);
        if(viewType === 'month') 
            endOfWeek.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        else if(viewType === 'year'){
            startOfWeek.setMonth(0);
            startOfWeek.setDate(1);
            endOfWeek.setMonth(11);
            endOfWeek.setDate(31);
        }
        else if(viewType === 'week'){
            const dayOfWeek = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            
            endOfWeek.setDate(startOfWeek.getDate() + 6);
        }
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

    const convertToISO = (dateString) => {
        const [day, month, year] = dateString.split('.');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };
    
    const getMultiDayActivities = async () => {
        const { startOfWeek, endOfWeek } = getRangeToDatabase(currentDate);
    
        const { data, error } = await supabase
            .from('aktywnosci_wielodniowe')
            .select('*')
            .eq('id_trenera', globalVariable.id_trenera)
            .eq('id_zawodnika', globalVariable.id)
            .lte('poczatek', convertToISO(endOfWeek))
            .gte('koniec', convertToISO(startOfWeek));
    
        if (!error && data) {
            setMultiDayActivities(data);
        }
    };
    

    
    const hasMultiDayActivity = (date) => {
        const getLocalISO = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const localDate = getLocalISO(date);
    
        return multiDayActivities.some(activity => {
            return localDate >= activity.poczatek && localDate <= activity.koniec;
        });
    };

    const goToSingleDay = (date) => {
        // if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
        //     navigate("/player/dayview");
        // } else {
        //     const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
        //     setGlobalVariable({ ...globalVariable, date: formattedDate });
        //     navigate("/player/anotherdayview");
        // }
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
        
        setGlobalVariable({ ...globalVariable, date: formattedDate}); // oba formaty dostępne
        navigate("/player/dayview");
    }

    const WeekDay = ({ day, date}) => {
        const activities = getActivitiesForThatDay(date);
        // Sprawdzenie, czy dzień jest dzisiejszy
        const isToday = date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth();
        
        const isMultiDay = hasMultiDayActivity(date);
        
        return (
            <>
                    {(activities.length !== 0 || viewType === 'week' || isMultiDay) &&
                    <div 
                        onClick={()=>goToSingleDay(date)} 
                        className={`
                            ${styles.weekDay} 
                            ${isToday ? styles.todayBorder : ''}  // Dodanie klasy ramki dla dzisiejszego dnia
                        `}                
                    >
                    <div>
                        {multiDayActivities
                            .filter(activity => {
                                const getLocalISO = (d) =>
                                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                const localDate = getLocalISO(date);
                                return localDate >= activity.poczatek && localDate <= activity.koniec;
                                
                            })
                            .map((activity, idx) => (
                                <div
                                    key={idx}
                                    className={styles.multiDayName}
                                    style={{
                                        color: '#9E9E9E'
                                    }}
                                    >
                                    {getMultiDayActivityEmoji(activity.rodzaj_aktywnosci)} {activity.nazwa}
                                </div>
                            ))}
                        

                        <p>
                            <span style={{ textTransform: 'uppercase' }}>{day}</span>, {formatDate(date)} 
                            {isToday ?  <span className={styles.todayText}>dzisiaj</span> : null}
                        </p>

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
                                        <div className={styles.activityType}  style={{
                                            //backgroundColor: getActivityColor(activity.rodzaj_aktywności),
                                            color: getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności),
                                            borderRadius: '5px',
                                            fontWeight: 'bold',
                                            }}>
                                            {activity.rodzaj_aktywności === "Inny" ?
                                                <span> {activity.zadania}
                                                </span>
                                                :
                                                <span> {activity.rodzaj_aktywności} </span>
                                            }
                                        </div>
                                        <div className={styles.singleActivity}>
                                            
                                            {activity.rodzaj_aktywności!=="Inny" &&
                                                <div className={styles.emojiAndTime}>
                                                    <div className={styles.emojiContainer}>
                                                        <TreningStatusAndFeelingsAfter 
                                                            treningStatus={activity.status}
                                                            feelingsAfter={activity.odczucia}
                                                        />
                                                    </div>
                                                </div>
                                            }   
                                            <div className={styles.timeText}>
                                                {activity.czas_rozpoczęcia}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            
            
            }
            
            </>
        );
    };
    useEffect(() => {
        getWeekDays();
    }
    , [viewType]);

    const updateWeek = (direction) => {
        const newDate = new Date(currentDate);
        if(viewType === 'month')
            newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        else if(viewType === 'year')
            newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        else if(viewType === 'week')
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    }

    useEffect(() => {
        getWeekDays();
        getMultiDayActivities();
    }, [currentDate]);

    const { currentWeek } = getWeekRanges(currentDate);
    
    let daysOfWeek;

    switch (viewType) {
        case "week":
            daysOfWeek = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentDate);
                const startOfWeek = getWeekDateRange(date).startOfWeek;
                startOfWeek.setDate(startOfWeek.getDate() + i);
                return new Date(startOfWeek);
            });
            break;

        default:
            daysOfWeek = Array.from(
                { length: (new Date(currentDate.getFullYear(), 11, 31) - new Date(currentDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24) + 1 },
                (_, i) => {
                    // const date = new Date(currentDate.getFullYear(), 0, 1);
                    // date.setDate(date.getDate() + i);
                    // return date;
                    return new Date(currentDate.getFullYear(), 0, 1 + i);

                }
            );
            break;
    }
    
    const onLogOutClick = () => {
        setGlobalVariable(null);
        localStorage.clear();
        navigate('/');
    }

    const closeSidebar = () => {
        if(isSidebarOpen){
            setIsSidebarOpen(false);
        }
    }

    const onReportErrorClick = () => {
        navigate('/reporterror');
    }

    return (
        <div onClick={closeSidebar} className={styles.background}>
            <SideBarCalendar onReportClick={onReportErrorClick} onLogOutClick={onLogOutClick} name={globalVariable.imie} isOpen={isSidebarOpen} player={globalVariable} viewType={viewType} navigate={navigate}/>
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
                            {viewType === 'month' ? currentWeek : viewType === 'year' ? currentDate.getFullYear() : viewType === 'week' ? currentWeek : null}
                    
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
