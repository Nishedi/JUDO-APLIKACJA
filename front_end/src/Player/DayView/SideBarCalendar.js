import React from 'react';
import styles from './SideBarCalendar.module.css';
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const SideBarCalendar = ({ isOpen, onLogOutClick, player, onReportClick, viewType, navigate }) => {

   // const navigate = useNavigate(); // Użycie useNavigate do nawigacji

    // Funkcje do obsługi przekierowania na odpowiednie strony
    const handleDailyViewClick = () => {
        navigate('/player/dayview'); // Przekierowanie do widoku dziennego
    };

    const handleWeeklyViewClick = () => {
        navigate('/player/weekview'); // Przekierowanie do widoku tygodniowego
    };

    const handleNoteClick = () => {
        navigate('/player/notes'); // Przekierowanie do notatki
    };

    const handleProfileClick = () => {
        navigate('/player/userprofile'); // Przekierowanie do profilu
    };


    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.navbar}>
                    {player.imie+" "+player.nazwisko}
                </div>
                <div className={styles.navbar_elements}>
                    <div className={styles.singleNonClickableElemement}>
                        Kalendarz
                    </div>
                    {viewType!==undefined &&
                        <>
                            <div onClick={()=>navigate("/player/dayview")} className={styles.singleClickableElemement}>
                                {"Widok dzienny"}
                                <IoIosArrowForward className={styles.right_arrow} />
                            </div>
                            <div className={styles.line}></div>
                        </>    
                        }                    
                    {viewType!=="week" &&
                    <>
                        <div onClick={()=>navigate("/player/weekview/week")} className={styles.singleClickableElemement}>
                            {"Widok tygodniowy"}
                            <IoIosArrowForward className={styles.right_arrow} />
                        </div>
                        <div className={styles.line}></div>
                    </>
                    }
                    {viewType!=="month" &&
                    <>
                        <div onClick={()=>navigate("/player/weekview/month")} className={styles.singleClickableElemement}>
                            {"Widok miesięczny"}
                            <IoIosArrowForward className={styles.right_arrow} />
                        </div>
                        <div className={styles.line}></div>
                    </>
                    }

                    {viewType!=="year" &&
                    <>
                        <div onClick={()=>navigate("/player/weekview/year")} className={styles.singleClickableElemement}>
                            {"Widok roczny"}
                            <IoIosArrowForward className={styles.right_arrow} />
                        </div>
                        <div className={styles.line}></div>
                    </>
                    }
                    <div onClick={()=>navigate("/player/addingactivityfirstpage/player")} className={styles.singleClickableElemement}>
                        Dodaj aktywność
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>

                    <div className={styles.emptyElement}></div>   
                    
                    <div onClick={handleNoteClick} className={styles.singleClickableElemement}>
                        Notatka
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    
                    <div onClick={handleProfileClick} className={styles.singleClickableElemement}>
                        Twój profil
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    
                    <div onClick = {onLogOutClick}
                        className={styles.singleClickableElemementv2}>
                        Wyloguj
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.emptyElement}></div>  
                    <div onClick = {onReportClick}
                    className={styles.singleClickableElemementv3}>
                        Zgłoś błąd
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                </div>
        </div>
    );
}

export default SideBarCalendar;
