import styles from "./SinglePlayerSingleDayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import React, {useLayoutEffect, useState} from "react";
import {IoIosArrowForward } from "react-icons/io";
import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../BackButton";
import {getActivityColor, getBorderColor, GetFeelingsEmoticon} from "../../../CommonFunction"

const SinglePlayerSingleDayView = () => {
    const {viewedPlayer, setViewedPlayer, supabase, globalVariable} = useContext(GlobalContext);
 //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);

    const dayNames = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", 
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    
        const formatDate = (date) => {
            let day, month;  // Zdefiniowanie zmiennych przed blokiem if
        
            if(date){
                day = date.getDate();  // Przypisanie wartości do zmiennych
                month = monthNames[date.getMonth()];
            } else {
                return null;  // Jeśli date jest undefined lub null, zwracamy null
            }
        
            return `${day} ${month}`;  // Użycie zmiennych poza blokiem if
        };


    const [activity, setActivity] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const toggleStats = () => {
        setIsStatsOpen(!isStatsOpen);
    }

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

    useLayoutEffect(() => {
        getStatsDay();
        getActivity();
    }, []);                

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
                    if(error.code === "23505") {
                        return;
                    }
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
                    <p>Godzina rozpoczęcia: <div><strong>{activity.czas_rozpoczęcia}</strong></div></p>
                    <p>Status: <div><strong>{activity.status}</strong></div></p>
                    {/* <div 
                        className={styles.line} style={{
                        backgroundColor: getBorderColor(activity.rodzaj_aktywności)}}>
                    </div> */}
                    <p>Czas trwania treningu: <div><strong>{activity.czas_trwania}</strong></div> </p>
                    <p >Odczucia: 
                        <GetFeelingsEmoticon
                            feelingsAfter={activity.odczucia}
                        />
                    </p>
                    <p>Komentarz: <div>{activity.komentarz_zawodnika}</div></p>
                </div>
                <IoIosArrowForward  className={styles.right_arrow} style={{ color: getBorderColor(activity.rodzaj_aktywności) }}  />
            </div>
        );
    }

    return (
        <div className={styles.background}>
            <SideBarCalendar isOpen={isSidebarOpen}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <BackButton path="/trener/singleplayerweekview"/>
                </div>
                <div className = {styles.weekDay}> 
                    <div> {dayNames[viewedPlayer.currentDate?.getDay()]}</div>
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
                                <p>Tętno: <div><strong>{stats?.tętno || ""}</strong></div></p>
                                <p className={styles.oneline}>Samopoczucie: 
                                <GetFeelingsEmoticon 
                                    feelingsAfter={stats?.samopoczucie || ""} 
                                        />
                                </p> 
                                <p>Waga: <div><strong>{stats?.waga || ""}</strong></div></p>
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