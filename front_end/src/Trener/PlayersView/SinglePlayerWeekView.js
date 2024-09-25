import styles from './SinglePlayerWeekView.module.css';
import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../BackButton';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const SinglePlayerWeekView = () => {
    const { viewedPlayer, setViewedPlayer, supabase, globalVariable } = useContext(GlobalContext);
    const now = new Date();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(now);
    const [weeklyActivities, setWeeklyActivities] = useState([]);

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

    const updateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentDate(newDate);
    }

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
        const { startOfWeek } = getRangeToDatabase(currentDate);
        const { endOfWeek } = getRangeToDatabase(currentDate);
    
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
        return weeklyActivities.filter(activity => activity.data === formatedDate);
    };

    const TreningStatusAndFeelingsAfter = ({ treningStatus, feelingsAfter }) => {
        const getStatusEmoticon = (treningStatus) => {
            switch (treningStatus) {
                case 'Nierozpoczęty': return '⏳';
                case 'Zrealizowany': return '✅';
                case 'Niezrealizowany': return '❌';
                default: return '🤷';
            }
        };
        const getFeelingsEmoticon = (feelingsAfter) => {
            switch (feelingsAfter) {
                case 'Bardzo źle': return '😢';
                case 'Źle': return '😕';
                case 'Neutralnie': return '😐';
                case 'Dobrze': return '🙂';
                case 'Bardzo dobrze': return '😁';
                default: return '😐';
            }
        };

        return (
            <div>
                <span>{getStatusEmoticon(treningStatus)}</span>
                <span> {getFeelingsEmoticon(feelingsAfter)}</span>
            </div>
        );
    };

    const goToSinglePlayerSingleDay = (date) => {
        setViewedPlayer({ ...viewedPlayer, currentDate: date });
        navigate('/trener/singleplayersingleday');
    };

    const goToPlayerProfile = () => {
        setViewedPlayer({ ...viewedPlayer });
        navigate('/trener/playerprofile');
    }

    const WeekDay = ({ day, date }) => {
        const activities = getActivitiesForThatDay(date);
        return (
            <div onClick={() => goToSinglePlayerSingleDay(date)} className={styles.weekDay}>
                <div>
                    <p>{day}, {formatDate(date)} {date.getDate()===new Date().getDate() && date.getMonth() === new Date().getMonth() ? "(Dzisiaj)":null}</p>
                    <div>
                        {activities.sort((a, b) => {
                            const [hoursA, minutesA] = a.czas_rozpoczęcia.split(':').map(Number);
                            const [hoursB, minutesB] = b.czas_rozpoczęcia.split(':').map(Number);
                            return (hoursA - hoursB) || (minutesA - minutesB);
                        }).map((activity, index) => (
                            <div className={styles.singleActivityInfo} key={index}>
                                <div>{activity.rodzaj_aktywności}</div>
                                <div className={styles.singleActivity}>
                                    <div>{activity.czas_rozpoczęcia}</div>
                                    <TreningStatusAndFeelingsAfter
                                        treningStatus={activity.status}
                                        feelingsAfter={activity.odczucia}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
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

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                
                <div className={styles.backAndDate}>
                    <BackButton path="/trener/playerview"/>
                    <div onClick={goToPlayerProfile} className={styles.writing_div}>
                        {viewedPlayer.imie} {viewedPlayer.nazwisko}
                    </div>
                    <div style={{margin:"0px 20px"}}></div>
                </div>
                <div className={styles.date_div}>
                        <button onClick={() => updateWeek('prev')} className={styles.arrowButton}>
                            <IoIosArrowBack />
                        </button>
                        {currentWeek}
                        <button onClick={() => updateWeek('next')} className={styles.arrowButton}>
                            <IoIosArrowForward />
                        </button>
                    </div>
               
            </div>
            <div className={styles.weekDay}>
                <div>
                    <div>
                        <p>Ostatnia aktualizacja</p>
                        <div className={styles.optionalStats}>
                            <div>Kinaza:</div>
                            <div className={styles.singleActivityInfo}>
                                <div>{viewedPlayer.kinaza}</div>
                            </div>
                        </div>
                        <div className={styles.optionalStats}>
                            <div>Kwas mlekowy:</div>
                            <div className={styles.singleActivity}>
                                <div>{viewedPlayer.kwas_mlekowy}</div>
                            </div>
                        </div>
                        <div className={styles.buttons}>
                            <button className={styles.buttonTrening} onClick={() => requestForStat('prosba_o_kinaze')}>
                                Aktualizacja KINAZY
                            </button>
                            <button className={styles.buttonTrening} onClick={() => requestForStat('prosba_o_kwas_mlekowy')}>
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
