import styles from "./DayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import StatsInput from "./StatsInput";
import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
//import { useState, useContext } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {GlobalContext} from "../../GlobalContext";
import { useNavigate } from 'react-router-dom';
import { getActivityColor, getBorderColor, GetFeelingsEmoticon, pickEmoticon } from "../../CommonFunction";

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

    const toggleStats = () => {
        setIsStatsOpen(!isStatsOpen);
    }

    const onReportErrorClick = () => {
        navigate('/reporterror');
    }

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
                    {activity.rodzaj_aktywności === "Inny" ?
                        <h3>  
                            {activity?.zadania} 
                            <span   style={{ color: getBorderColor(activity.rodzaj_aktywności) }}>
                                    {" → "}
                                    {activity.rodzaj_aktywności}
                            </span>
                        </h3>
                        :
                        <h3>{activity.rodzaj_aktywności}</h3>
                    }
                    <p>Godzina rozpoczęcia: <div><strong>{activity.czas_rozpoczęcia}</strong></div></p>
                    {activity.rodzaj_aktywności !== "Inny" ? 
                        <>
                            <p>Status: <div><strong>{activity.status}</strong></div></p>
                            <p> Odczucia: 
                                <strong style={{display: 'flex', flexDirection: 'row'}}>
                                    {activity.odczucia} &nbsp;
                                    <GetFeelingsEmoticon
                                        feelingsAfter={activity.odczucia}
                                    />
                                </strong>
                            </p>
                        </>
                        : null
                    }
                    <p>Komentarz: <div className={styles.comment}>
                        {activity.komentarz_trenera?.length > 10 
                            ? `${activity.komentarz_trenera.substring(0, 20)}...`  // Ogranicz do 100 znaków i dodaj "..."
                            : activity.komentarz_trenera  // Jeśli jest krótszy niż 100 znaków, wyświetl pełen tekst
                        }
                        </div>
                    </p>

                </div>
                <IoIosArrowForward  className={styles.right_arrow} style={{ color: getBorderColor(activity.rodzaj_aktywności) }}  />
            </div>
        );
    }

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
        await supabase
            .from('statystyki_zawodników')
            .update({ tętno: stats.tętno, samopoczucie: stats.samopoczucie ? stats.samopoczucie : "Neutralnie", waga: stats.waga ? stats.waga : null })
            .eq('id', stats?.id)
            .eq('id_trenera', globalVariable.id_trenera)
            .eq('id_zawodnika', globalVariable.id)
            .eq('data', formatedDate)
            .select()
    }

    const getKinazaAndKwasMlekowyNeeds = async () => {
        const { data, error } = await supabase
            .from('zawodnicy')
            .select('prosba_o_kinaze, prosba_o_kwas_mlekowy')
            .eq('id', globalVariable.id)
            .eq('id_trenera', globalVariable.id_trenera)
        if(error) {
            console.log(error);
            return;
        }
        if(data && data.length > 0) {
            setKinaza_needs(data[0].prosba_o_kinaze);
            setKwas_mlekowy_needs(data[0].prosba_o_kwas_mlekowy);
        }
    }

    const closeSidebar = () => {
        if(isSidebarOpen){
            setIsSidebarOpen(false);
        }
    }

    useLayoutEffect(() => {
        getStatsDay();
    }, []);

    useEffect(() => {
        getActivity(); 
        getKinazaAndKwasMlekowyNeeds();
    }, []);

    return (
        <div onClick={closeSidebar} className={styles.background}>
            <SideBarCalendar onReportClick={onReportErrorClick} onLogOutClick={onLogOutClick} name={globalVariable.imie} isOpen={isSidebarOpen} player={globalVariable}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    <div>
                        {dayNames[now.getDay()]}
                    </div>
                    <div className={styles.date_div}>
                        {/* <button  className={styles.arrowButton}>
                            <IoIosArrowBack />
                        </button> */}
                        {now.getDate()+" "+monthNames[now.getMonth()]}
                        {/* <button  className={styles.arrowButton}>
                            <IoIosArrowForward />
                        </button> */}
                    </div>
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
                                Wyślij
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
                                Wyślij
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
                                    <p>Tętno: <strong>{stats && stats.tętno ? `${stats.tętno} PRbmp` : "Proszę podać"}</strong> </p>
                                    <p>Samopoczucie: <strong>{stats && stats.samopoczucie?  stats.samopoczucie+" "+pickEmoticon(stats.samopoczucie):"Proszę podać"}</strong></p>
                                    <p>Waga: <strong>{stats && stats.waga ? `${stats.waga} kg` : "----"}</strong> </p>
                                </div>
                                <div className={styles.center}>
                                    <button onClick={() => setIsEditing(true)} className={styles.submitButton}>Edytuj</button>
                                </div>
                            </>
                        ) : (
                            <StatsInput onConfirmClick={onConfirmClick} stats={stats} setStats={setStats} />                            
                        )}
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