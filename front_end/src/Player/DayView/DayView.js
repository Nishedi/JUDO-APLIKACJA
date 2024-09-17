import styles from "./DayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import StatsInput from "./StatsInput";
import React, {useState, useContext} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
//import { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {GlobalContext} from "../../GlobalContext";
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Tu sie domyślam, że można by utworzyć jeden komponent
// i jakoś sparametryzować kolor, żeby nie powtarzać kodu,
// ale na razie chcę po prostu zrobić cokolwiek

const Activity = ({title, wykonany, odczucia, komentarz, color, borderColor}) => {
    return (
    <div className={styles.activity} 
        style={{
            backgroundColor: color,
            borderColor: borderColor
            }}
    >
            <div>
                <h3>{title}</h3>
                <p>Wykonany: {wykonany}</p>
                <p>Odczucia: {odczucia}</p>
                <p>Komentarz: {komentarz}</p>
            </div>
            {/* <div> tu bedzie strzałka w prawo </div> */}
            <IoIosArrowForward  className={styles.right_arrow} style={{ color: borderColor }}  />
        </div>
    );
}


const DayView = () => {
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        tetne: "",
        samopoczucie: "",
        zakwaszenie: "",
        kinaza: "",
        komentarz: ""
    });
    const [kinaza_needs, setKinaza_needs] = useState(globalVariable.prosba_o_kinaze);
    const [kwas_mlekowy_needs, setKwas_mlekowy_needs] = useState(globalVariable.prosba_o_kwas_mlekowy);
    const [kinaza, setKinaza] = useState('');
    const [kwas_mlekowy, setKwas_mlekowy] = useState('');
    const formatedDate = `${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`;

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
            console.log(data);
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
            console.log(data);
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

    return (
        <div className={styles.background}>
            <SideBarCalendar onLogOutClick={onLogOutClick} name={globalVariable.imie} isOpen={isSidebarOpen} player={globalVariable}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    <div > Poniedziałek </div>
                    <div className={styles.weekDayData}> 12 sierpnia </div>
                </div>
                <div className={styles.name}> {globalVariable.imie + " " + globalVariable.nazwisko} </div>
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
                           <Activity
                                title="Trening motoryczny"
                                wykonany="tak"
                                odczucia="Zle"
                                komentarz="brak"
                                color="#FF7A68"
                                borderColor="#BE0000"
                           />
                            <Activity
                                title="Trening biegowy"
                                wykonany="tak"
                                odczucia="Zle"
                                komentarz="brak"
                                color="#95C6FF"
                                borderColor="#0056BA"
                               
                           />
                            <Activity
                                title="Trening mata"
                                wykonany="tak"
                                odczucia="Zle"
                                komentarz="brak"
                                color="#FFF281"
                                borderColor="#CCB700"
                           />
                            <Activity
                                title="Fizjoterapia"
                                wykonany="tak"
                                odczucia="Zle"
                                komentarz="brak"
                                color="#83FF8F"
                                borderColor="#00C514"
                           />    

                        </div>
                        

                    </div>

            </div>
            
        </div>
    );
}
export default DayView;