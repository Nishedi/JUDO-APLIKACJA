import React from "react";
import styles from "./StatsInput.module.css";
import {getMoodFromEmoticon} from "../../CommonFunction"

const StatsInput = ({ onConfirmClick, stats, setStats }) => {
    const pickEmoticon = (feelingsAfter) => {
        switch (feelingsAfter) {
            case 'Bardzo źle':
                return '😢';  // Bardzo źle
            case 'Źle':
                return '🙁';  // Źle
            case 'Neutralnie':
                return '😐';  // Neutralnie
            case 'Dobrze':
                return '🙂';  // Dobrze
            case 'Bardzo dobrze':
                return '😊';  // Bardzo dobrze
            default:
                return '😐';  // Brak emotikony, jeśli nie ma odczuć
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStats(prevStats => ({
            ...prevStats,
            [name]: value
        }));
    };

    const collectAndSubmit = () => {
        let samopoczucie = "Neutralnie";
        if (stats?.samopoczucie){
            samopoczucie = stats.samopoczucie;
        }
        setStats(prevStats => ({
            ...prevStats,
            samopoczucie: samopoczucie
        }));
        onConfirmClick();
    };

    const setMoodFromEmoticon = (feelingsAfter) => {
        switch (feelingsAfter) {
            case '😢':
                setStats(prevStats => ({
                    ...prevStats,
                    samopoczucie: 'Bardzo źle'
                }));
                break; 
            case '🙁':
                setStats(prevStats => ({
                    ...prevStats,
                    samopoczucie: 'Źle'
                }));
                break;
            case '😐':
                setStats(prevStats => ({
                    ...prevStats,
                    samopoczucie: 'Neutralnie'
                }));
                break;
            case '🙂':
                setStats(prevStats => ({
                    ...prevStats,
                    samopoczucie: 'Dobrze'
                }));
                break;
            case '😊':
                setStats(prevStats => ({
                    ...prevStats,
                    samopoczucie: 'Bardzo dobrze'
                })); 
                break;
            default:
                setStats(prevStats => ({
                    ...prevStats,
                    samopoczucie: 'Neutralnie'
                }));
        }
    };

    return (
        <div className={styles.statsInput}>
            <div className={styles.statsInputTitle}>
                <p>Statystyki dnia</p>
                <p>Edycja</p>
            </div>
                <div  className={styles.rows}>
                    {/* Tętno */}
                    <div className={styles.statsInputContentElement}>
                        <p>Tętno</p>
                        <select 
                            name="tętno"
                            value={stats?.tętno || ""} // Upewniamy się, że value nie jest null
                            onChange={handleChange}
                            className={styles.selectElement}
                        >
                            {Array.from({ length: 181 }, (_, i) => (
                                <option key={i} value={i + 30}>
                                    {i + 30}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.statsInputContentElement2}>
                        <p>Waga</p>
                        <input 
                            type="number" 
                            name="waga" 
                            value={stats?.waga || ""} // Dodajemy domyślną wartość dla wagi
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div>
                    {/* Samopoczucie */}
                    <div className={styles.statsInputContentElement}>
                        <p style={{display: 'flex', justifyContent: 'center'}}>Samopoczucie</p>
                        <div className={styles.emojiContainer}>
                            {['😢', '🙁', '😐', '🙂', '😊'].map((emoji, index) => (
                                <label key={index} className={styles.emojiLabel}>
                                    <input
                                        type="radio"
                                        name="mood"
                                        value={emoji}
                                        checked={emoji === pickEmoticon(stats?.samopoczucie)}
                                        onChange={() => setMoodFromEmoticon(emoji)} // Przekazujemy emoji
                                        className={styles.emojiInput}
                                    />
                                    <span className={styles.emoji}>{emoji}</span>
                                </label>
                            ))}
                        </div>
                        <p style={{paddingTop: '10px', display: 'flex', justifyContent: 'center'}}>{stats?.samopoczucie ? stats.samopoczucie : 'Neutralnie' }</p>
                    </div>
                </div>
            <button onClick={collectAndSubmit} className={styles.submitButton}>Zatwierdź</button>
        </div>
    );
};

export default StatsInput;
