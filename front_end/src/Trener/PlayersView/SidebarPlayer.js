import React from 'react';
import styles from './SideBar.module.css';
import { IoIosArrowForward } from "react-icons/io";


const SidebarPlayer = ({ isOpen, onProfileClick, name, surname, onStatsClick, onNotesClick, onMonthViewClick, isMonthView}) => {

    
// DODAC ZEBY SIE ZAMYKALO PO KLIKNIECIU NA NAVBAR SIDEBARU
    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.navbar}>
                    
                </div>
                <div className={styles.navbar_elements}>
                    <div className={styles.singleNonClickableElemement}>
                        {name+" "+surname}
                    </div>
                    <div onClick={onMonthViewClick} className={styles.singleClickableElemement}>
                        {isMonthView ? "Widok tygodniowy" : "Widok miesięczny"}
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    <div onClick={onProfileClick} className={styles.singleClickableElemement}>
                        Profil zawodnika
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    <div onClick={onStatsClick} className={styles.singleClickableElemement}>
                        Statystyki zawodnika
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    <div onClick={onNotesClick} className={styles.singleClickableElemement}>
                        Notatki zawodnika
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                </div>                
        </div>
    );
}

export default SidebarPlayer;
