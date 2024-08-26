import styles from "./DayView.module.css";
import SideBarCalendar from "./SideBarCalendar";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useContext } from "react";
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }


    const hideSidebar = () => {
        setIsSidebarOpen(false);
    }

    return (
        <div className={styles.background}>
             <SideBarCalendar isOpen={isSidebarOpen}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar} className={styles.burger}>
                <RxHamburgerMenu/>
                </div>
                <div className = {styles.weekDay}> 
                    <div >
                        Poniedziałek
                    </div>
                    <div className={styles.weekDayData}>
                        12 sierpnia
                    </div>
                </div>
                
                <div className={styles.name}>
                    Piotr Kopiec
                </div>
                
                {/* <div onClick={toggleSidebar}>
                    <RxHamburgerMenu className={styles.burger}/>
                </div>
                <div className="left_navbar">
                    <div className={styles.writing_div}>
                        Twoi ZAWODNICY
                    </div>
                    <div className={styles.date_div}>
                        {now.getDate()+" "+monthNames[now.getMonth()]+", "+dayNames[now.getDay()]}
                    </div>
                </div>   */}
            </div>

            <div onClick={hideSidebar} className = {styles.layout}>

                    <div className = {styles.rectangleStats}> {/* Statystyki dnia */}
                            <div>
                            <p className = {styles.dayHeader}>STATYSTYKI DNIA</p> {/*tu sobie sprawdzę headery*/}
                            <div className = {styles.text}>
                                <p> Tętno: 100 </p>
                                <p> Samopoczucie: złe </p>
                                <p> Zakwaszenie: TAK/NIE(przycisk!!!) </p>
                                <p> Kinaza: idk co to jest</p>
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