import styles from "./DayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import StatsInput from "./StatsInput";
import React, {useState} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
//import { useState, useContext } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

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
 //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);   
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [stats, setStats] = useState({
        tetne: "",
        samopoczucie: "",
        zakwaszenie: "",
        kinaza: "",
        komentarz: ""
    });

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


    return (
        <div className={styles.background}>
            <SideBarCalendar isOpen={isSidebarOpen}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                    <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    <div > Poniedziałek </div>
                    <div className={styles.weekDayData}> 12 sierpnia </div>
                </div>
                <div className={styles.name}> Piotr Kopiec </div>
            </div>

            <div onClick={() => setIsSidebarOpen(false)} className = {styles.layout}>
                    {/* Prostokąt statystyk dnia */}
                    <div className = {styles.rectangleStats} onClick={toggleStats}> {/* Statystyki dnia */}
                        <div>
                            <p className = {styles.dayHeader}>STATYSTYKI DNIA</p> {/*tu sobie sprawdzę headery*/}
                            {/* Renderuj treść w zależności od stanu isStatsOpen */}
                            {!isStatsOpen ? (
                                <div className = {styles.text}>
                                    <p>Tętno: {stats.tetno || "kc Kondi"}</p>
                                    <p>Samopoczucie: {stats.samopoczucie || "kc Konradzio"}</p>
                                    <p>Zakwaszenie: {stats.zakwaszenie || "kc Kondik"}</p>
                                    <p>Kinaza: {stats.kinaza || "kc Kondziś"}</p>
                                </div>
                            ) : (
                                <StatsInput onSubmit={handleStatsSubmit} initialData={stats} />
                            )}
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