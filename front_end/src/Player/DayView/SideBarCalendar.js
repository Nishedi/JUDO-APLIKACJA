import React from 'react';
import styles from './SideBarCalendar.module.css';
import { IoIosArrowForward } from "react-icons/io";


const SideBarCalendar = ({ isOpen, onLogOutClick, name, surname, onAddActivityClick, onAddPlayerClick }) => {

    

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.navbar}>
                    {name+" "+surname}
                </div>
                <div className={styles.navbar_elements}>
                    <div className={styles.singleNonClickableElemement}>
                        Kalendarz
                    </div>
                    <div onClick={onAddActivityClick} className={styles.singleClickableElemement}>
                        Widok dzienny
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    <div onClick={onAddPlayerClick} className={styles.singleClickableElemement}>
                        Widok tygodniowy
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.emptyElement}></div>   
                    
                    <div onClick={onAddActivityClick} className={styles.singleClickableElemement}>
                        Notatka
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    <div onClick={onAddActivityClick} className={styles.singleClickableElemement}>
                        Twój profil
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    
                    <div onClick = {onLogOutClick}
                    className={styles.singleClickableElemementv2}>
                        Wyloguj
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                </div>
        </div>
    );
}

export default SideBarCalendar;
