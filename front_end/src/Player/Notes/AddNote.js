import styles from './AddNote.module.css';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaPlus } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';


// Przykładowa lista przeciwników
const opponents = [
    { name: "Piotr Wysocki", lastMeeting: "10.07.2024", balance: "5 / 1" },
    { name: "Jan Kowalski", lastMeeting: "04.05.2024", balance: "2 / 0" },
    { name: "Bartłomiej Dobrowolski", lastMeeting: "24.01.2023", balance: "1 / 3" },
];

const AddNote = () => {
    
    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                        <RxHamburgerMenu/>
                </div>
                <div className={styles.navbarText}>
                        Notatnik <br/> Przeciwnicy
                </div>
                <div className={styles.navbarButton}>
                   
                </div>

                
            </div>

                    {/* Główna sekcja */}
            <div className={styles.mainContent}>
                <div className={styles.opponentDetails}>
                    <div>
                        <h3>Piotr Kopiec</h3>
                        <p>Bilans: 5 / 1</p>
                    </div>
                <button className={styles.addNoteButton}><FaPlus/></button>
                </div>

                {/* Lista spotkań */}
                <div className={styles.matchList}>
                    <div className={styles.match}>
                        <p>01.08.2024 r.</p>
                        <span className={styles.arrowUp}>↑</span>
                    </div>
                    <div className={styles.match}>
                        <p>10.08.2022 r.</p>
                        <span className={styles.arrowDown}>↓</span>
                    </div>
                    <div className={styles.match}>
                        <p>19.12.2021 r.</p>
                        <span className={styles.arrowUp}>↑</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
