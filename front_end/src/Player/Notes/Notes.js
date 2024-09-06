import styles from './Notes.module.css';
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

const Notes = () => {
    
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
                <button className={styles.addButton}>
                    <AiOutlinePlus/>
                </button>
            </div>

                
            </div>

            {/* Przeciwnicy */}
            <div className={styles.weeklist}>
                {opponents.map((opponent, index) => (
                        <div key={index} className={styles.opponentCard}>
                            <div className={styles.opponentInfo}>
                                <div className={styles.opponentName}>{opponent.name}</div>
                                <div className={styles.opponentDetails}>
                                    Ostatnie spotkanie: {opponent.lastMeeting} <br />
                                    Bilans: {opponent.balance}
                                </div>
                            </div>
                            <IoIosArrowDown className={styles.arrowIcon} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Notes;
