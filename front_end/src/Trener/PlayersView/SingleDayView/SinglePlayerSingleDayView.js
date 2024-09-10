import styles from "./SinglePlayerSingleDayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import StatsInput from "./StatsInput";
import React, {useEffect, useState} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
//import { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { createClient } from '@supabase/supabase-js';
import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";
// Tu sie domyślam, że można by utworzyć jeden komponent
// i jakoś sparametryzować kolor, żeby nie powtarzać kodu,
// ale na razie chcę po prostu zrobić cokolwiek

const SinglePlayerSingleDayView = () => {
    const {viewedPlayer} = useContext(GlobalContext);
    const {globalVariable} = useContext(GlobalContext);
 //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const [stats, setStats] = useState({
        tetne: "",
        samopoczucie: "",
        zakwaszenie: "",
        kinaza: "",
        komentarz: ""
    });

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
                <span> {pickEmoticon(feelingsAfter)} {feelingsAfter}</span>
            </div>
        );
    };

    const Activity = ({title, wykonany, odczucia, komentarz, godzina_rozpoczecia}) => {
        return (
        <div className={styles.activity}
            style={{
                backgroundColor: getActivityColor(title),
                borderColor: getBorderColor(title)
                }}
            >
                <div>
                    <h3>{title}</h3>
                    <p>Godzina rozpoczęcia: <div>{godzina_rozpoczecia}</div></p>
                    <p>Status: <div>{wykonany}</div></p>
                    <p>Odczucia: 
                        <GetFeelingsEmoticon
                            feelingsAfter={odczucia}
                        />
                    </p>
                    <p>Komentarz: <div>{komentarz}</div></p>
                </div>
                {/* <div> tu bedzie strzałka w prawo </div> */}
                <IoIosArrowForward  className={styles.right_arrow} style={{ color: getBorderColor(title) }}  />
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
                        <div >
                        {/* <StatsInput onSubmit={handleStatsSubmit} initialData={stats} /> */}
                            <p className = {styles.dayHeader}>STATYSTYKI DNIA</p> {/*tu sobie sprawdzę headery*/}
                            
                                <div className = {styles.text}>
                                    <p>Tętno: {stats.tetno || "kc Kondi"}</p>
                                    <p>Samopoczucie: {stats.samopoczucie || "kc Konradzio"}</p>
                                    <p>Zakwaszenie: {stats.zakwaszenie || "kc Kondik"}</p>
                                    <p>Kinaza: {stats.kinaza || "kc Kondziś"}</p>
                                </div>
                            
                        </div>
                        <IoIosArrowDown className={styles.down_arrow} />
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
                                        title={activit.rodzaj_aktywności}
                                        wykonany={activit.status}
                                        odczucia={activit.odczucia}
                                        komentarz={activit.komentarz_zawodnika}
                                        godzina_rozpoczecia={activit.czas_rozpoczęcia}
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