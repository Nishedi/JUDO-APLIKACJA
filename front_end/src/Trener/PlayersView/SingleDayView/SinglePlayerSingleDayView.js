import styles from "./SinglePlayerSingleDayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import React, {useEffect, useLayoutEffect, useState} from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../BackButton";
import {getActivityColor, getBorderColor, GetFeelingsEmoticon, getActivityTypeColor} from "../../../CommonFunction"
import { RxRadiobutton } from "react-icons/rx";

const SinglePlayerSingleDayView = () => {
    const {viewedPlayer, setViewedPlayer, supabase, globalVariable, smsList, setSmsList} = useContext(GlobalContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState(null);

    const [multiDayActivities, setMultiDayActivities] = useState([]);

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

    const changeDate = (direction) => {
        const updatedDate = new Date(viewedPlayer.currentDate);
        updatedDate.setDate(updatedDate.getDate() + direction);
        setViewedPlayer({ ...viewedPlayer, currentDate: updatedDate });
    };

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
        }else
            setActivity([]);
    }

    const getMultiDayActivity = async () => {
        const currentDate = viewedPlayer.currentDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
        const { data, error } = await supabase
            .from('aktywnosci_wielodniowe')
            .select('*')
            .eq('id_trenera', globalVariable.id)
            .eq('id_zawodnika', viewedPlayer.id)
            .lte('poczatek', currentDate)
            .gte('koniec', currentDate);
    
        if (error) {
            console.error("Błąd pobierania aktywności wielodniowych:", error);
            setMultiDayActivities([]);
            return;
        }
    
        setMultiDayActivities(data || []);
    };    


    useLayoutEffect(() => {
        getStatsDay();
        getActivity();
        getMultiDayActivity();
    }, [viewedPlayer.currentDate]);            

    useLayoutEffect(() => {
        setIsSidebarOpen(false); // Upewniamy się, że SideBar jest zamknięty po załadowaniu widoku.
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

    const handleCheckboxClick = (activity) => {
        setSmsList((prevSmsList) => {
          const exists = prevSmsList.some((a) => a.id === activity.id);
      
          if (exists) {
            return prevSmsList.filter((a) => a.id !== activity.id);
          } else {
            return [...prevSmsList, { ...activity, zadania_wykonane: true }];
          }
        });
      };

    const Activity = ({activity}) => {
        return (
        <div className={styles.activity}
            style={{
                backgroundColor: getActivityColor(activity.rodzaj_aktywności),
                borderColor: getBorderColor(activity.rodzaj_aktywności)
                }}
            >
                <div >
                    <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                        {activity.rodzaj_aktywności === "Inny" ?
                            <h3>  
                                {activity?.zadania} 
                                <span   style={{ 
                                        color: getBorderColor(activity.rodzaj_aktywności) }}
                                        
                                >
                                        {" → "}
                                        {activity.rodzaj_aktywności}
                                </span>
                                
                            </h3>
                            :
                            <h3 style={{
                                backgroundColor: "#fff",
                                borderRadius: "25px",
                                padding: "5px",
                                width: "fit-content",
                                border: "1px solid",
                                color: getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności)}}>{activity.rodzaj_aktywności}</h3>
                        }
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={smsList.some(item => item.id === activity.id)}
                            onChange={() => handleCheckboxClick(activity)}
                            />
                    </div>
                    <p onClick={() => handleActivityClick(activity)}>Godzina rozpoczęcia: <div><strong>{activity.czas_rozpoczęcia}</strong></div></p>
                    {activity.rodzaj_aktywności !== "Inny" ? 
                        <>
                            <p onClick={() => handleActivityClick(activity)}>Status: <div><strong>{activity.status}</strong></div></p>
                            <p  onClick={() => handleActivityClick(activity)}>Odczucia: 
                            <strong style={{display: 'flex', flexDirection:'row', alignItems: 'flex-start'}}>{activity?.odczucia} &nbsp;
                                <GetFeelingsEmoticon 
                                    feelingsAfter={activity?.odczucia || ""} 
                                        />
                                </strong>
                            </p>
                        </>
                        : null
                    }
                    <p onClick={() => handleActivityClick(activity)}>Komentarz: <div className={styles.comment}>
                        {activity.komentarz_zawodnika?.length > 10 
                            ? `${activity.komentarz_zawodnika.substring(0, 20)}...`  
                            : activity.komentarz_zawodnika  
                        }
                        </div>
                    </p>
                    
                </div>
                <IoIosArrowForward  onClick={() => handleActivityClick(activity)} className={styles.right_arrow} style={{ color: getBorderColor(activity.rodzaj_aktywności) }}  />
            </div>
        );
    }

    return (
        <div className={styles.background}>
            <SideBarCalendar isOpen={isSidebarOpen}/>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                    <BackButton path="/trener/playermonthview/week"/>
                </div>
                <div className = {styles.weekDay}>
                    <div>{dayNames[viewedPlayer.currentDate?.getDay()]}</div>

                    {/* <IoIosArrowBack 
                            className={styles.arrow} 
                            onClick={() => changeDate(-1)} 
                        /> */}
                    <div className={styles.date_div}>
                        <button onClick={() => changeDate(-1)} className={styles.arrowButton}>
                                <IoIosArrowBack />
                        </button>
                        <div className={styles.weekDayData}>{formatDate(viewedPlayer.currentDate)}</div>
                        <button onClick={() => changeDate(1)} className={styles.arrowButton}>
                            <IoIosArrowForward />
                        </button>

                    </div>
                    {/* <IoIosArrowForward 
                        className={styles.arrow} 
                        onClick={() => changeDate(1)} 
                    /> */}
                </div>
                <div className={styles.name}> {viewedPlayer.imie} {viewedPlayer.nazwisko} </div>

            </div>
            {/*  Aktywności WIELODNIOWE*/}
            {multiDayActivities.length > 0 && (
                <div >
                    {multiDayActivities.map((item, index) => (
                        <div key={index} className={styles.multidayRectangle} >
                            {item.nazwa}
                        </div>
                    ))}
                </div>
            )}
               

            <div onClick={() => setIsSidebarOpen(false)} className = {styles.layout}>
                    {/* Prostokąt statystyk dnia */}
                    <div className = {styles.rectangleStats} onClick={toggleStats}> {/* Statystyki dnia */}
                        <div style={{width:"100%"}}>
                           <p className = {styles.dayHeader}>STATYSTYKI DNIA</p> {/*tu sobie sprawdzę headery*/}
                            <div className = {styles.text}>
                                <p>Tętno: <div><strong>{stats && stats.tętno ? `${stats.tętno} PRbmp` : ""}</strong></div></p>
                                <p className={styles.oneline}>Samopoczucie: 
                                <strong style={{display: 'flex', flexDirection:'row', alignItems: 'flex-start'}}>{stats?.samopoczucie} &nbsp;
                                <GetFeelingsEmoticon 
                                    feelingsAfter={stats?.samopoczucie || ""} 
                                        />
                                </strong>
                                
                                </p> 
                                <p>Waga: <div><strong>{stats && stats.waga ? `${stats.waga} kg` : "----"}</strong></div></p>
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
                    <div className={styles.buttonContainer}>
                         <button onClick={()=>setSmsList([])} className={styles.button}>Wyczyść zaznaczone</button>   
                        <button onClick={()=>navigate('/trener/smssending')} className={styles.button}>Wyślij sms</button>
                        <button onClick={()=>navigate('/trener/addingactivityfirstpage')} className={styles.button}>Dodaj aktywność</button>
                    </div>
                </div>
        </div>
    );
}
export default SinglePlayerSingleDayView;