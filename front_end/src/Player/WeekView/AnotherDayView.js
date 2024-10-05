import styles from "../DayView/DayView.module.css";
import SideBarCalendar from "../DayView/SideBarCalendar";
import React, {useState, useContext, useEffect} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import {GlobalContext} from "../../GlobalContext";
import { useNavigate } from 'react-router-dom';
import { getActivityColor, getBorderColor, GetFeelingsEmoticon } from "../../CommonFunction";

const AnotherDayView = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const navigate = useNavigate();
    const formatedDate = globalVariable.date;
    const [activity, setActivity] = useState(null);
    const viewedDate = globalVariable.date.split('.');
    const now = new Date();
    now.setDate(viewedDate[0]);
    now.setMonth(viewedDate[1] - 1);
    now.setFullYear(viewedDate[2]);
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
        "Lipiec", "sierpnia", "września", "października", "listopada", "grudnia"];

    const handleActivityClick = (activity) => {
        navigate(`/player/trainingview/${activity.id}`, { state: { activity } });
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const onLogOutClick = () => {
        setGlobalVariable(null);
        navigate('/');
    }

    const getActivity = async () => {
        const { data: aktywnosc, error } = await supabase
                .from('aktywności')
                .select("*")
                .eq('data', formatedDate)
                .eq('id_trenera', globalVariable.id_trenera)
                .eq('id_zawodnika', globalVariable.id);
                
            if (error) {
                console.error("Błąd pobierania aktywności", error);
                return;
            }
            
            if(aktywnosc && aktywnosc.length > 0) {
                setActivity(aktywnosc);
            }    
    }
    
    const Activity = ({activity}) => {
        return (
        <div className={styles.activity}
            style={{
                backgroundColor: getActivityColor(activity.rodzaj_aktywności),
                borderColor: getBorderColor(activity.rodzaj_aktywności)
                }}
            >
                <div>
                    <h3>{activity.rodzaj_aktywności}</h3>
                    <p>Godzina rozpoczęcia: <div><strong>{activity.czas_rozpoczęcia}</strong></div></p>
                    <p>Status: <div><strong>{activity.status}</strong></div></p>
                    <p>Czas trwania treningu: <div><strong>{activity.czas_trwania}</strong></div></p>
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

    useEffect(() => {
        getActivity(); 
        
    }, []);

    const closeSidebar = () => {
        if(isSidebarOpen){
            setIsSidebarOpen(false);
        }
    }

    return (
        <div onClick={closeSidebar} className={styles.background}>
            <SideBarCalendar onLogOutClick={onLogOutClick} name={globalVariable.imie} isOpen={isSidebarOpen} player={globalVariable}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    <div>
                        {dayNames[now.getDay()]}
                    </div>
                    <div className={styles.date}>
                        {now.getDate()+" "+monthNames[now.getMonth()]}
                    </div>
                </div>
                <div className={styles.name}> {globalVariable.imie} <br/> {globalVariable.nazwisko} </div>
            </div>
            <div onClick={() => setIsSidebarOpen(false)} className = {styles.layout}>
                <div className = {styles.rectangleSActivities}>  {/*  Aktywności */}
                    <p className = {styles.dayHeader}>  AKTYWNOŚCI </p>
                    <div>
                        {activity === null ? 
                            <div className={styles.emptyActivities}>Brak aktywności</div> :
                            (
                            activity
                                ?.sort((a, b) => {
                                    const [hoursA, minutesA] = a.czas_rozpoczęcia.split(':').map(Number);
                                    const [hoursB, minutesB] = b.czas_rozpoczęcia.split(':').map(Number);
                                    if (hoursA !== hoursB) {
                                        return hoursA - hoursB;
                                    }
                                    return minutesA - minutesB;
                                })
                                .map((activit, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => handleActivityClick(activit)}
                                    >
                                        <Activity
                                            activity={activit}
                                        />
                                    </div>
                                ))
                            )
                        }   
                    </div> 
                </div>         
            </div>           
        </div>
    );
}
export default AnotherDayView;