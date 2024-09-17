import styles from "./SinglePlayerSingleDayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import StatsInput from "./StatsInput";
import React, {act, useEffect, useState} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
//import { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { createClient } from '@supabase/supabase-js';
import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { useNavigate } from "react-router-dom";
// Tu sie domyślam, że można by utworzyć jeden komponent
// i jakoś sparametryzować kolor, żeby nie powtarzać kodu,
// ale na razie chcę po prostu zrobić cokolwiek

const SinglePlayerSingleDayView = () => {
    const {viewedPlayer, setViewedPlayer} = useContext(GlobalContext);
    const {globalVariable} = useContext(GlobalContext);
 //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["Stycznia", "Lutego", "Marca", "Kwietnia", "Maja", "Czerwiec",
        "Lipca", "Sierpnia", "Września", "Października", "Listopada", "Grudnia"];
    const formatDate = (date) => {
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        return `${day} ${month}`;
    };

    const [activity, setActivity] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const hideSidebar = () => {
        setIsSidebarOpen(false);
    }

    const toggleStats = () => {
        setIsStatsOpen(!isStatsOpen);
    }

    const handleStatsSubmit = (newStats) => {
        setStats(newStats);
        setIsStatsOpen(false); // Zamyka panel po zatwierdzeniu
    };

    const getActivity = async () => {
        const currentDate = `${String(viewedPlayer.currentDate.getDate()).padStart(2, '0')}.${String(viewedPlayer.currentDate.getMonth() + 1).padStart(2, '0')}.${viewedPlayer.currentDate.getFullYear()}`;
        let { data: aktywnosc, error } = await supabase
            .from('aktywności')
            .select("*")
            .eq('data', currentDate)
            .eq('id_trenera', globalVariable.id)
            .eq('id_zawodnika', viewedPlayer.id);

        if (error) {
            console.error("Błąd pobierania aktywności", error);
            return;
        }

        if(aktywnosc && aktywnosc.length > 0) {
            setActivity(aktywnosc);
        }
    }

    useEffect(() => {
        getStatsDay();
        getActivity();
    }, []);

    const getActivityColor = (activity_type) => {
        switch (activity_type) {
            case 'Trening motoryczny':
                return '#FF7A68';
            case 'Biegowy':
                return '#95C6FF';
            case 'Na macie':
                return '#FFF281';
            case 'Fizjoterapia':
                return '#83FF8F';
            default:
                return '#FF7A68';
        }
    }

    const getBorderColor = (activity_type) => {
        switch (activity_type) {
            case 'Trening motoryczny':
                return '#BE0000';
            case 'Biegowy':
                return '#0056BA';
            case 'Na macie':
                return '#CCB700';
            case 'Fizjoterapia':
                return '#00C514';
            default:
                return '#BE0000';
        } 
    }
                

    const GetFeelingsEmoticon = ({feelingsAfter}) => {
        const pickEmoticon = (feelingsAfter) => {
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
                <span> {pickEmoticon(feelingsAfter)} </span>
            </div>
        );
    };

    const handleActivityClick = (activity) => {
        setViewedPlayer({...viewedPlayer, currentActivity: activity});
        navigate(`/trener/trainingview`);
    };

    const getStatsDay = async () => {
        const currentDate = `${String(viewedPlayer.currentDate.getDate()).padStart(2, '0')}.${String(viewedPlayer.currentDate.getMonth() + 1).padStart(2, '0')}.${viewedPlayer.currentDate.getFullYear()}`;
        let { data: stats, error } = await supabase
            .from('statystyki_zawodników')
            .select("*")
            .eq('data', currentDate)
            .eq('id_trenera', globalVariable.id)
            .eq('id_zawodnika', viewedPlayer.id);

        if (error) {
            console.error("Błąd pobierania statystyk", error);
            return;
        }
        if (stats) {
            if(stats.length > 0) {
                setStats(stats[0]);
            }else{
                const { data, error } = await supabase
                    .from('statystyki_zawodników')
                    .insert([
                        { id_trenera: globalVariable.id, id_zawodnika: viewedPlayer.id, data: currentDate },
                    ])
                    .select();
                if (error) {
                    console.error("Błąd dodawania statystyk", error);
                    return;
                }
                setStats(data[0]);
            }
        }
    }

    const Activity = ({activity}) => {
        return (
        <div className={styles.activity}
            onClick={() => handleActivityClick(activity)}
            style={{
                backgroundColor: getActivityColor(activity.rodzaj_aktywności),
                borderColor: getBorderColor(activity.rodzaj_aktywności)
                }}
            >
                <div>
                    <h3>{activity.rodzaj_aktywności}</h3>
                    <p>Godzina rozpoczęcia: <div>{activity.czas_rozpoczęcia}</div></p>
                    <p>Status: <div>{activity.status}</div></p>
                    <p >Odczucia: 
                        <GetFeelingsEmoticon
                            feelingsAfter={activity.odczucia}
                        />
                    </p>
                    <p>Komentarz: <div>{activity.komentarz_zawodnika}</div></p>
                </div>
                {/* <div> tu bedzie strzałka w prawo </div> */}
                <IoIosArrowForward  className={styles.right_arrow} style={{ color: getBorderColor(activity.rodzaj_aktywności) }}  />
            </div>
        );
    }

    return (
        <div className={styles.background}>
            <SideBarCalendar isOpen={isSidebarOpen}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    <div> {dayNames[viewedPlayer.currentDate.getDay()]}</div>
                    <div className={styles.weekDayData}> {formatDate(viewedPlayer.currentDate)} </div>
                </div>
                <div className={styles.name}> {viewedPlayer.imie} {viewedPlayer.nazwisko} </div>
            </div>

            <div onClick={() => setIsSidebarOpen(false)} className = {styles.layout}>
                    {/* Prostokąt statystyk dnia */}
                    
                    <div className = {styles.rectangleStats} onClick={toggleStats}> {/* Statystyki dnia */}
                        <div style={{width:"100%"}}>
                        {/* <StatsInput onSubmit={handleStatsSubmit} initialData={stats} /> */}
                            <p className = {styles.dayHeader}>STATYSTYKI DNIA</p> {/*tu sobie sprawdzę headery*/}
                            <div className = {styles.text}>
                                <p>Tętno: <div>{stats?.tętno || ""}</div></p>
                                <p className={styles.oneline}>Samopoczucie: 
                                <GetFeelingsEmoticon 
                                    feelingsAfter={stats?.samopoczucie || ""} 
                                        />
                                </p> 
                                <p>Waga: <div>{stats?.waga || ""}</div></p>
                            </div>
                            
                        </div>
                    </div>
                   
                    <div className = {styles.rectangleSActivities}>  {/*  Aktywności */}
                    <p className = {styles.dayHeader}>  AKTYWNOŚCI </p>
                        <div>
                            {activity
                                ?.sort((a, b) => {
                                    const [hoursA, minutesA] = a.czas_rozpoczęcia.split(':').map(Number);
                                    const [hoursB, minutesB] = b.czas_rozpoczęcia.split(':').map(Number);
                                    if (hoursA !== hoursB) {
                                        return hoursA - hoursB;
                                    }
                                    return minutesA - minutesB;
                                })
                                .map((activit, index) => (
                                    <Activity
                                        activity={activit}
                                    />
                                ))
                            }
                        </div>
                    </div>
            </div>
        </div>
    );
}
export default SinglePlayerSingleDayView;