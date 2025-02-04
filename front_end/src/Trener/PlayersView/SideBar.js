import React from 'react';
import styles from './SideBar.module.css';
import { IoIosArrowForward } from "react-icons/io";


const Sidebar = ({ isOpen, onLogOutClick, name, surname, onAddActivityClick, onAddPlayerClick, goToProfile, onReportErrorClick, onTestowaniePowiadomienClick }) => {

    
// DODAC ZEBY SIE ZAMYKALO PO KLIKNIECIU NA NAVBAR SIDEBARU
    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.navbar}>
                    {name+" "+surname}
                </div>
                <div className={styles.navbar_elements}>
                    <div className={styles.singleNonClickableElemement}>
                        Zawodnicy
                    </div>
                    <div onClick={onAddActivityClick} className={styles.singleClickableElemement}>
                        Dodaj aktywność
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.line}></div>
                    <div onClick={onAddPlayerClick} className={styles.singleClickableElemement}>
                        Dodaj zawodnika
                        <IoIosArrowForward className={styles.right_arrow} />
                    </div>
                    <div className={styles.emptyElement}></div>
                    <div onClick={goToProfile} className={styles.singleClickableElemement}>
                        Twój profil
                        <IoIosArrowForward className={styles.right_arrow} />    
                    </div>
                    <div className={styles.line}></div>
                    <div onClick = {onLogOutClick}
                    className={styles.singleClickableElemementv2}>
                        Wyloguj
                        {/* <IoIosArrowForward className={styles.right_arrow} /> */}
                    </div>
                    <div className={styles.emptyElement}></div>
                    <div
                        onClick={onReportErrorClick}
                        className={styles.singleClickableElemementv3}>
                        Zgłoś błąd
                        {/* <IoIosArrowForward className={styles.right_arrow} /> */}
                    </div>
                    {name === "konradekAdmin" &&
                    <>
                     <div className={styles.line}></div>
                        <div
                            onClick={onTestowaniePowiadomienClick}
                            className={styles.singleClickableElemementv3}>
                            Sekcja testowa powiadomień
                            {/* <IoIosArrowForward className={styles.right_arrow} /> */}
                        </div>
                    </>
                    }

                </div>
                
        </div>
    );
}

export default Sidebar;
