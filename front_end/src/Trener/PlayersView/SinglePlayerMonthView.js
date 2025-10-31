import styles from './SinglePlayerWeekView.module.css';
import React, { act, useEffect } from 'react';
import { useState, useContext } from 'react';
import { GlobalContext } from '../../GlobalContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../BackButton';
import {TreningStatusAndFeelingsAfter, getBorderColor, getActivityColor, getActivityTypeColor, getMultiDayActivityEmoji, getMultiDayActivityColor} from '../../CommonFunction';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { RxHamburgerMenu } from "react-icons/rx";
import SidebarPlayer from '../PlayersView/SidebarPlayer';


const SinglePlayerMonthView = () => {
    const { viewedPlayer, setViewedPlayer, supabase, globalVariable, setPrevViewType, prevViewDate, setPrevViewDate } = useContext(GlobalContext);
    const now = new Date();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(prevViewDate || now);
    const [weeklyActivities, setWeeklyActivities] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const viewType = useParams().viewtype;
    useEffect(() => {
        if(prevViewDate){
            setCurrentDate(prevViewDate);
            setPrevViewDate(null);
            // getPlayer();
            // getMonthDays();
            // getMultiDayActivities();
        }

    }, []);
    useEffect(() => {
        setPrevViewType(viewType);
    }, [viewType]);
    const [runningTreningsCounter, setRunningTreningsCounter] = useState(0);
    const [motorTreningsCounter, setMotorTreningsCounter] = useState(0);
    const [strengthTreningsCounter, setStrengthTreningsCounter] = useState(0);
    const [otherTreningsCounter, setOtherTreningsCounter] = useState(0);
    const [multiDayActivities, setMultiDayActivities] = useState([]);

    const dayNames = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", 
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    
    // const location = useLocation();
    const formatDate = (date) => {
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        return `${day} ${month}`;
    };

    const getMonthDateRange = (date) => {
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

    const updateMonth = (direction) => {
        const newDate = new Date(currentDate);
        if(viewType === 'month')
            newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        else if(viewType === 'year')
            newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        else if(viewType === 'week')
            newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    }

    const formatDateRange = (startDate, endDate) => {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const getMonthRanges = (currentDate) => {
        const { startOfWeek: currentWeekStart, endOfWeek: currentWeekEnd } = getMonthDateRange(currentDate);
        return {
            currentMonth: formatDateRange(currentWeekStart, currentWeekEnd),
        };
    };

    const getWeekRanges = (currentDate) => {
        const { startOfWeek: currentWeekStart, endOfWeek: currentWeekEnd } = getMonthDateRange(currentDate);
        return {
            currentWeek: formatDateRange(currentWeekStart, currentWeekEnd),
        };
    };

    const getRangeToDatabase = (date) => {
        const { startOfWeek, endOfWeek } = getMonthDateRange(date);
        return {
            startOfWeek: `${String(startOfWeek.getDate()).padStart(2, '0')}.${String(startOfWeek.getMonth() + 1).padStart(2, '0')}.${startOfWeek.getFullYear()}`,
            endOfWeek: `${String(endOfWeek.getDate()).padStart(2, '0')}.${String(endOfWeek.getMonth() + 1).padStart(2, '0')}.${endOfWeek.getFullYear()}`
        };
    };

    const convertToISO = (dateString) => {
        const [day, month, year] = dateString.split('.');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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

    const getMonthDays = async () => {
        const { startOfWeek } = getRangeToDatabase(currentDate);
        const { endOfWeek } =   getRangeToDatabase(currentDate);
        const dates = generateDateArray(startOfWeek, endOfWeek);
        let { data: aktywnosci, error } = await supabase
            .from('aktywności')
            .select('*')
            .in('data', dates)
            .eq('id_zawodnika', viewedPlayer.id)
            .eq('id_trenera', globalVariable.id)
            .order('data', { ascending: true });
        if (aktywnosci ) {
            setWeeklyActivities(
                aktywnosci.map(activity => ({
                    ...activity,
                    isChecked: true
                }))

            );
            
        }
        
    }

    const onAllActivitiesClick = () => {
        setWeeklyActivities(prevActivities =>
            prevActivities.map(activity => ({
                ...activity,
                isChecked: true
            }))
        );
    };

    const onNoneActivitiesClick = () => {
        setWeeklyActivities(prevActivities =>
            prevActivities.map(activity => ({
                ...activity,
                isChecked: false
            }))
        );
    };


    useEffect(() => {
        const aktywnosci = weeklyActivities;
        let runningTreningsCounter = 0;
        let motorTreningsCounter = 0;
        let strengthTreningsCounter = 0;
        let otherTreningsCounter = 0;
        aktywnosci.forEach(activity => {
            if (activity.isChecked === false) {
                return; // Pomijamy aktywności, które nie są zaznaczone
            }
            if(activity.rodzaj_aktywności === "Biegowy"){
                runningTreningsCounter++;
            }
            else if(activity.rodzaj_aktywności === "Motoryczny"){
                motorTreningsCounter++;
            }
            else if(activity.rodzaj_aktywności === "Na macie"){
                strengthTreningsCounter++;
            }
            else{
                otherTreningsCounter++;
            }
        }
        );
        setRunningTreningsCounter(runningTreningsCounter);
        setMotorTreningsCounter(motorTreningsCounter);
        setStrengthTreningsCounter(strengthTreningsCounter);
        setOtherTreningsCounter(otherTreningsCounter);
    }, [weeklyActivities]);


    const getPercent = (count) => {
        const total = runningTreningsCounter + motorTreningsCounter + strengthTreningsCounter + otherTreningsCounter;
        return total ? Math.round((count / total) * 100) : 0;
      };
      

    const getActivitiesForThatDay = (date) => {
        const formatedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
        return weeklyActivities.filter(activity => activity.data === formatedDate);
    };



    const getMultiDayActivities = async () => {
        const { startOfWeek, endOfWeek } = getRangeToDatabase(currentDate);
    
        const { data, error } = await supabase
            .from('aktywnosci_wielodniowe')
            .select('*')
            .eq('id_trenera', globalVariable.id)
            .eq('id_zawodnika', viewedPlayer.id)
            .lte('poczatek', convertToISO(endOfWeek))
            .gte('koniec', convertToISO(startOfWeek));
    
        if (error) {
            console.error("Błąd pobierania aktywności wielodniowych:", error);
            return;
        }
    
        setMultiDayActivities(data || []);
    };

    const hasMultiDayActivity = (date) => {
        const getLocalISO = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const localDate = getLocalISO(date);
    
        return multiDayActivities.some(activity => {
            return localDate >= activity.poczatek && localDate <= activity.koniec;
        });
    };
    
    
    
    

    const goToSinglePlayerSingleDay = (date) => {
        setPrevViewDate(currentDate);
        const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Zresetuj godzinę
        setViewedPlayer({ ...viewedPlayer, currentDate: date });
        navigate('/trener/singleplayersingleday');
    };

    const goToPlayerProfile = () => {
        setViewedPlayer({ ...viewedPlayer });
        navigate('/trener/playerprofile');
    }

    const WeekDay = ({ day, date }) => {
        const [activities, setActivities] = useState(getActivitiesForThatDay(date));
        
        const isToday = 
            date.getDate() === new Date().getDate() && 
            date.getMonth() === new Date().getMonth();

        const isMultiDay = hasMultiDayActivity(date);
        const [isChecked, setIsChecked] = useState(false);
       
        
        return (
           <>
           {(activities.length !== 0 || viewType ===  "week" || isMultiDay)&& (
                 <div 
                    onClick={() => goToSinglePlayerSingleDay(date)}
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
                                
                                {
                                    
                                    viewType === 'year' && (
                                    <>
                                    <input
                                        key={date.toISOString()}
                                        type="checkbox"
                                        className={styles.todayText}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => {
                                            const checked = e.target.checked;
                                            setIsChecked(!checked);
                                            setWeeklyActivities(prevActivities =>
                                                prevActivities.map(a =>
                                                    a.data === `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
                                                        ? { ...a, isChecked: !checked }
                                                        : a
                                                )
                                            );
                                        }}
                                        checked={false}
                                    />
                                    <input
                                        key={date.toISOString()+1}
                                        type="checkbox"
                                        className={styles.todayText}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => {
                                            const checked = e.target.checked;
                                            setIsChecked(!checked);
                                            setWeeklyActivities(prevActivities =>
                                                prevActivities.map(a =>
                                                    a.data === `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
                                                        ? { ...a, isChecked: !checked }
                                                        : a
                                                )
                                            );
                                        }}
                                        checked={true}
                                    />
                                
                                    </>
                                    
                                    )
                                }
                                {isToday && <span className={styles.todayText}>dzisiaj</span>}
                                </p>
                                
                            <div>
                             {activities.sort((a, b) => {
                                 const [hoursA, minutesA] = a.czas_rozpoczęcia.split(':').map(Number);
                                 const [hoursB, minutesB] = b.czas_rozpoczęcia.split(':').map(Number);
                                 return (hoursA - hoursB) || (minutesA - minutesB);
                             }).map((activity, index) => (
                                 <div className={styles.singleActivityInfo} key={index}>
                                    
                                     <div className={styles.activityType}  style={{
                                                //backgroundColor: getActivityColor(activity.rodzaj_aktywności),
                                                color: getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności),
                                                borderRadius: '5px',
                                                fontWeight: 'bold',
                                                }}>
                                         {activity.rodzaj_aktywności === "Inny" ?
                                             <div>{activity.zadania}</div> 
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
                                         {
                                            viewType === 'year' && (
                                                <input
                                                    type="checkbox"
                                                    className={styles.todayText}
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                    checked={weeklyActivities.some((a) => a.id === activity.id && a.isChecked)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setWeeklyActivities((prevActivities) =>
                                                            prevActivities.map((a) =>
                                                                a.id === activity.id ? { ...a, isChecked } : a
                                                            )
                                                        );
                                                    }}
                                                />
                                            )
                                        }
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>


           )}
           
           </>
        );
    };

    const getPlayer = async () => {
        const { data, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id', viewedPlayer.id)
            .eq('id_trenera', globalVariable.id);
        if (error) {
            console.log(error);
        }
        if (data && data.length !== 0) {
            setViewedPlayer(data[0]);
        }
    }

    useEffect(() => {
        getPlayer();
        getMonthDays();
        getMultiDayActivities();
    }, [viewType]);

    useEffect(() => {
        getMonthDays();
        getMultiDayActivities();
    }, [currentDate]);

    // useEffect(() => {
    //     setCurrentDate(now);
    // }, [viewType]);

    const { currentMonth } = getMonthRanges(currentDate);
    const { currentWeek } = getWeekRanges(currentDate);

    let daysOfWeek;

    switch (viewType) {
        case "week":
            daysOfWeek = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(currentDate);
                const startOfWeek = getMonthDateRange(date).startOfWeek;
                startOfWeek.setDate(startOfWeek.getDate() + i);
                return new Date(startOfWeek);
            });
            break;

        default:
            daysOfWeek = Array.from(
                { length: (new Date(currentDate.getFullYear(), 11, 31) - new Date(currentDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24) + 1 },
                (_, i) => {
                    const date = new Date(currentDate.getFullYear(), 0, 1);
                    date.setDate(date.getDate() + i);
                    return date;
                }
            );
            break;
    }

    
        

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const requestForStat = async (whatToGet) => {
        const updates = { prosba_o_kinaze: "TRUE", prosba_o_kwas_mlekowy: "TRUE" };
        if (updates[whatToGet]) {
            const { data, error } = await supabase
                .from('zawodnicy')
                .update({ [whatToGet]: updates[whatToGet] })
                .eq('id', viewedPlayer.id)
                .eq('id_trenera', globalVariable.id)
                .select();
            if (error) {
                console.log(error);
            }
        }
    }

    const onStatsClick = () => {
        setViewedPlayer({ ...viewedPlayer });
        navigate('/trener/playerstats');
    }

    const onNotesClick = () => {
        setViewedPlayer({ ...viewedPlayer });
        navigate('/trener/playernotes');
    }

    

    const closeSidebar = () => {
        if(isSidebarOpen){
            setIsSidebarOpen(false);
        }
    }

    return (
        <div onClick={closeSidebar} className={styles.background}>
            <SidebarPlayer 
                isOpen={isSidebarOpen} 
                onProfileClick={goToPlayerProfile} 
                name={viewedPlayer.imie} 
                surname={viewedPlayer.nazwisko} 
                onStatsClick={onStatsClick} 
                onNotesClick={onNotesClick}
                viewType={viewType}
                navigate={navigate}
            />
            <div className={styles.navbar}>
            <div className={styles.backAndDate}>
                <BackButton path="/trener/playerview" />
                <div >
                    {viewedPlayer.imie} {viewedPlayer.nazwisko}
                </div>
                <RxHamburgerMenu onClick={toggleSidebar} className={styles.burger} />
            </div>
            <div className={styles.date_div}>
                    <button onClick={() => updateMonth('prev')} className={styles.arrowButton}>
                        <IoIosArrowBack />
                    </button>
                    {viewType === 'month' ? currentMonth : viewType === 'year' ? currentDate.getFullYear() : viewType === 'week' ? currentWeek : null}
                    <button onClick={() => updateMonth('next')} className={styles.arrowButton}>
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>
            {
                
                <div className={styles.weekDay}>
                    <div>
                        <div>
                            {viewType === 'week' &&
                            <>
                            <p>Ostatnia aktualizacja</p>
                            <div className={styles.optionalStats}>
                                <div>Kinaza:</div>
                                <div className={styles.singleActivityInfo}>
                                    <strong>{viewedPlayer.kinaza} </strong>
                                    {viewedPlayer.ostatnia_aktualizacja_kinazy &&
                                    <div>({viewedPlayer.ostatnia_aktualizacja_kinazy.split(".")[0]}.{viewedPlayer.ostatnia_aktualizacja_kinazy.split(".")[1]})</div>}
                                </div>
                                <button className={styles.buttonTrening} onClick={() => requestForStat('prosba_o_kinaze')}>
                                    Aktualizuj
                                </button>
                            </div>
                            <div className={styles.optionalStats}>
                                <div 
                                    style={{whiteSpace: 'nowrap'}}>
                                    Kwas mlekowy:
                                </div>
                                <div className={styles.singleActivityInfo}>
                                    <div><strong>{viewedPlayer.kwas_mlekowy}</strong></div>
                                    {viewedPlayer.ostatnia_aktualizacja_kwasu_mlekowego &&
                                        <div>({viewedPlayer.ostatnia_aktualizacja_kwasu_mlekowego.split(".")[0]}.{viewedPlayer.ostatnia_aktualizacja_kwasu_mlekowego.split(".")[1]})</div>
                                            }
                                </div>
                                <button className={styles.buttonTrening} onClick={() => requestForStat('prosba_o_kwas_mlekowy')}>
                                    Aktualizuj
                                </button>
                            </div>
                            </>
                            }

                            <div>
                                <p>Podsumowanie treningów:</p>
                            </div>
                            <div>
                            <div className={styles.optionalStats}>
                                <div className={styles.statGroup}>
                                    <div className={styles.statLabel}>
                                        🏃 Biegowe:
                                        <span className={styles.statNumber}>
                                            {runningTreningsCounter} ({getPercent(runningTreningsCounter)}%)
                                        </span>
                                    </div>
                                    <div className={styles.statLabel}>
                                        🏋️ Motoryczne:
                                        <span className={styles.statNumber}>
                                            {motorTreningsCounter} ({getPercent(motorTreningsCounter)}%)
                                        </span>
                                    </div>
                                    <div className={styles.statLabel}>
                                        🥋 Na macie:
                                        <span className={styles.statNumber}>
                                            {strengthTreningsCounter} ({getPercent(strengthTreningsCounter)}%)
                                        </span>
                                    </div>
                                    <div className={styles.statLabel}>
                                        ❓ Inne:
                                        <span className={styles.statNumber}>
                                            {otherTreningsCounter} ({getPercent(otherTreningsCounter)}%)
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.selectButtons}>
                                    <button className={styles.buttonStats} onClick={onAllActivitiesClick}>
                                        Zaznacz wszystkie 
                                    </button>
                                    <button className={styles.buttonStats} onClick={onNoneActivitiesClick}>
                                        odznacz wszystkie 
                                    </button>
                                </div>
                                
                            </div>

                            </div>
                            <div className={styles.buttonStatsOpacity}>
                                <button className={styles.buttonStats} onClick={() => navigate("/trener/playerstats")}>
                                    Statystyki
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>

            }
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

export default SinglePlayerMonthView;
