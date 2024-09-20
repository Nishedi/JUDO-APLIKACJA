import styles from './SinglePlayerWeekView.module.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../../GlobalContext';
import {useNavigate} from 'react-router-dom';


const SinglePlayerWeekView = () => {
    const {viewedPlayer, setViewedPlayer, supabase, globalVariable} = useContext(GlobalContext);
    const now = new Date();
    const navigate = useNavigate();
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
                
                <span> {getFeelingsEmoticon(feelingsAfter)}</span>
               
            </div>
        );
    };
    
    const goToSinglePlayerSingleDay = (date) => {
        setViewedPlayer({...viewedPlayer, currentDate: date});
        // console.log(viewedPlayer);
        navigate('/trener/singleplayersingleday');
    };

    const WeekDay = ({ day, date}) => {
        const activities = getActivitiesForThatDay(date);
        return (
            <div onClick={()=>goToSinglePlayerSingleDay(date)} className={styles.weekDay}>
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

    const requestForStat = async (whatToGet) => {
        if(whatToGet === 'prosba_o_kinaze') {
            const { data, error } = await supabase
            .from('zawodnicy')
            .update({ prosba_o_kinaze: "TRUE"})
            .eq('id', viewedPlayer.id)
            .eq('id_trenera', globalVariable.id)
            .select();
            if (error) {
                console.log(error);
            } 
        }
        if(whatToGet === 'prosba_o_kwas_mlekowy') {
            const { data, error } = await supabase
            .from('zawodnicy')
            .update({ prosba_o_kwas_mlekowy: "TRUE"})
            .eq('id', viewedPlayer.id)
            .eq('id_trenera', globalVariable.id)
            .select();
            if (error) {
                console.log(error);
            } 
        }

        
    }


    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.date_div}>
                    {currentWeek}
                </div>
                <div className={styles.writing_div}>
                    {viewedPlayer.imie} <br/> {viewedPlayer.nazwisko}
                </div>
            </div>
            <div  className={styles.weekDay}>
                <div>
                    <div >
                        <p>Ostatnia aktualizacja</p>
                        <div className={styles.optionalStats}>
                            <div>
                                Kinaza:
                            </div>
                            <div className={styles.singleActivityInfo}>
                                <div>
                                    {viewedPlayer.kinaza}
                                </div>      
                            </div>
                        </div> 
                        <div className={styles.optionalStats}>
                            <div>
                                Kwas mlekowy: 
                            </div>
                            <div className={styles.singleActivity}>
                                <div>
                                    {viewedPlayer.kwas_mlekowy}
                                </div>      
                            </div>
                        </div>  
                        <div className={styles.buttons}>
                            <button
                                className={styles.buttonTrening}
                                onClick={() => requestForStat('prosba_o_kinaze')}
                                >
                                Aktualizacja KINAZY
                            </button>
                            <button 
                                className={styles.buttonTrening}
                                onClick={() => requestForStat('prosba_o_kwas_mlekowy')}>
                                Aktualizacja KWASU MLEKOWEGO
                            </button>
                        </div>
                        <div className={styles.underButtons}>
                            <div className={styles.underButton}>
                                ost. akt. kinazy: <div>{viewedPlayer.ostatnia_aktualizacja_kinazy}</div>
                            </div>
                            <div className={styles.underButton}>
                                ost. akt. kwasu mlekowego:<div>{viewedPlayer.ostatnia_aktualizacja_kwasu_mlekowego}</div> 
                            </div>
                        </div>
                    </div>
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

export default SinglePlayerWeekView;
