import styles from "./DayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import StatsInput from "./StatsInput";
import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
//import { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {GlobalContext} from "../../GlobalContext";
import { useNavigate } from 'react-router-dom';

const DayView = () => {
    const hasFetched = useRef(false);  // zeby nie wysylac statystyk dwukrotnie
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [kinaza_needs, setKinaza_needs] = useState(globalVariable.prosba_o_kinaze);
    const [kwas_mlekowy_needs, setKwas_mlekowy_needs] = useState(globalVariable.prosba_o_kwas_mlekowy);
    const [kinaza, setKinaza] = useState('');
    const [kwas_mlekowy, setKwas_mlekowy] = useState('');
    const formatedDate = `${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`;
    const [activity, setActivity] = useState(null);

    const now = new Date();
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
        "Lipiec", "sierpnia", "września", "października", "listopada", "grudnia"];

    const handleActivityClick = (activity) => {
        navigate(`/player/trainingview/${activity.id}`, { state: { activity } });
    }

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

    const handleKinazaSubmit = async () => {       
        const { data, error } = await supabase
        .from('zawodnicy')
        .update({ kinaza: kinaza,
                ostatnia_aktualizacja_kinazy: formatedDate,
                prosba_o_kinaze: false
         })
        .eq('id', globalVariable.id)
        .eq('id_trenera', globalVariable.id_trenera)
        .eq('nazwisko', globalVariable.nazwisko)
        .eq('imie', globalVariable.imie)
        .select()

        if(error) {
            console.log(error);
        }

        if(data && data.length > 0) {
            setKinaza_needs(false);
            setGlobalVariable({
                ...globalVariable,
                kinaza: kinaza,
                ostatnia_aktualizacja_kinazy: formatedDate,
                prosba_o_kinaze: false
            });
        }else {
            console.log("Nie udało się zaktualizować kinazy");
        }
    }

    const handleKwasMlekowySubmit = async () => {
        const { data, error } = await supabase
        .from('zawodnicy')
        .update({ kwas_mlekowy: kwas_mlekowy,
            ostatnia_aktualizacja_kwasu_mlekowego: formatedDate,
            prosba_o_kwas_mlekowy: false
         })
        .eq('id', globalVariable.id)
        .eq('id_trenera', globalVariable.id_trenera)
        .eq('nazwisko', globalVariable.nazwisko)
        .eq('imie', globalVariable.imie)
        .select()

        if(error) {
            console.log(error);
        }

        if(data && data.length > 0) {
            setKwas_mlekowy_needs(false);
            setGlobalVariable({
                ...globalVariable,
                kwas_mlekowy: kwas_mlekowy,
                ostatnia_aktualizacja_kwasu_mlekowego: formatedDate,
                prosba_o_kwas_mlekowy: false
            });
        }else {
            console.log("Nie udało się zaktualizować kinazy");
        }
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
            // onClick={() => handleActivityClick(activity)}
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
                <IoIosArrowForward  className={styles.right_arrow} style={{ color: getBorderColor(activity.rodzaj_aktywności) }}  />
            </div>
        );
    }

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

    const getStatsDay = async () => {
        if (hasFetched.current) return; 
        hasFetched.current = true; 
        const currentDate = `${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`;
        let { data: stats, error } = await supabase
            .from('statystyki_zawodników')
            .select("*")
            .eq('data', currentDate)
            .eq('id_trenera', globalVariable.id_trenera)
            .eq('id_zawodnika', globalVariable.id);

        if (error) {
            console.error("Błąd pobierania statystyk", error);
            return;
        }
        if (stats) {
            if(stats.length > 0) {
                setStats(stats[0]);
                if(stats[0]?.tętno && stats[0]?.samopoczucie && stats[0]?.waga){
                    setIsEditing(false);
                }else{
                    setIsEditing(true);
                }
            }else{
                const { data, error } = await supabase
                    .from('statystyki_zawodników')
                    .insert([
                        { id_trenera: globalVariable.id_trenera, id_zawodnika: globalVariable.id, data: currentDate },
                    ])
                    .select();
                if (error) {
                    console.error("Błąd dodawania statystyk", error);
                    return;
                }
                setStats(data[0]);
                setIsEditing(true);
            }
        }
    };

    const onConfirmClick = async () => {
        setIsEditing(false);
        const { data, error } = await supabase
            .from('statystyki_zawodników')
            .update({ tętno: stats.tętno, samopoczucie: stats.samopoczucie, waga: stats.waga ? stats.waga : null })
            .eq('id', stats?.id)
            .eq('id_trenera', globalVariable.id_trenera)
            .eq('id_zawodnika', globalVariable.id)
            .eq('data', formatedDate)
            .select()
    }

    useLayoutEffect(() => {
        getStatsDay();
    }, []);

    useEffect(() => {
        getActivity(); 
        
    }, []);

    return (
        <div className={styles.background}>
            <SideBarCalendar onLogOutClick={onLogOutClick} name={globalVariable.imie} isOpen={isSidebarOpen} player={globalVariable}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    {dayNames[now.getDay()]}<br/> {now.getDate()+" "+monthNames[now.getMonth()]}
                </div>
                <div className={styles.name}> {globalVariable.imie} <br/> {globalVariable.nazwisko} </div>
            </div>
            {kinaza_needs ? 
            <div  className={styles.stats}>
                <div>
                    <div >
                        <p>Kinaza</p>
                        <div className={styles.buttons}>
                            <input 
                                id = "kinaza"
                                type="number" 
                                className={styles.input} 
                                placeholder={'Podaj kinazę'} 
                                value={kinaza}
                                onChange={(e) => setKinaza(e.target.value)} 
                                />  
                            <button
                                onClick={handleKinazaSubmit}
                                className={styles.buttonTrening}>
                                Aktualizuj
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            : null
            }
            {kwas_mlekowy_needs ?
            <div  className={styles.stats}>
                <div>
                    <div >
                        <p>Kwas mlekowy</p>
                        <div className={styles.buttons}>
                            <input 
                                id = "kwas mlekowy"
                                type="number" 
                                className={styles.input} 
                                placeholder={'Podaj kwas mlekowy'} 
                                value={kwas_mlekowy}
                                onChange={(e) => setKwas_mlekowy(e.target.value)} 
                                />  
                            <button
                                onClick={handleKwasMlekowySubmit}
                                className={styles.buttonTrening}>
                                Aktualizuj
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            : null        
            }
            

            <div onClick={() => setIsSidebarOpen(false)} className = {styles.layout}>
                <div className = {styles.rectangleStats} onClick={toggleStats}> {/* Statystyki dnia */}
                    <div>
                        {!isEditing? (
                            <>
                                <p className={styles.dayHeader}>STATYSTYKI DNIA</p> {/*tu sobie sprawdzę headery*/}
                                <div className={styles.text}>
                                    <p>Tętno: {stats?.tętno || "Proszę podać"}</p>
                                    <p>Samopoczucie: {stats?.samopoczucie || "Proszę podać"}</p>
                                    <p>Waga: {stats?.waga || "Proszę podać"}</p>
                                </div>
                                <button onClick={() => setIsEditing(true)} className={styles.submitButton}>Edytuj</button>
                            </>
                        ) : (
                            <StatsInput onConfirmClick={onConfirmClick} stats={stats} setStats={setStats} />                            
                        )}
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
                                    <div 
                                        key={index} 
                                        onClick={() => handleActivityClick(activit)}
                                    >
                                        <Activity
                                            activity={activit}
                                        />
                                    </div>
                                ))
                            }
                    </div> 
                </div>         
            </div>           
        </div>
    );
}
export default DayView;