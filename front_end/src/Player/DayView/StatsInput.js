import { useState } from "react";
import styles from "./StatsInput.module.css";
import React from "react";

const StatsInput = ({ onSubmit, initialData }) => {

    const [soreness, setSoreness] = useState(false); // State dla przycisku TAK/NIE
    const [mood, setMood] = useState(''); // State dla samopoczucia
    const [stats, setStats] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStats(prevStats => ({
            ...prevStats,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSubmit(stats);
    };

    return (
        <div className={styles.statsInput}>
            <div className={styles.statsInputTitle}>
                <p>Statystyki dnia</p>
                <p>Edycja</p>
            </div>

            <div className={styles.statsInputContent}>
                {/* Tętno */}
                <div className={styles.statsInputContentElement}>
                    <p>Tętno</p>
                    <select name="tetno" value={stats.tetno} onChange={handleChange}>
                        {Array.from({ length: 151 }, (_, i) => (
                            <option key={i} value={i + 50}>
                                {i + 50}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Samopoczucie */}
                <div className={styles.statsInputContentElement}>
                    <p>Samopoczucie</p>
                    <div className={styles.moodSelector}>
                        {['😢', '🙁', '😐', '🙂', '😊', '😁'].map((emoji, index) => (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="mood"
                                    value={emoji}
                                    checked={mood === emoji}
                                    onChange={() => setMood(emoji)}
                                />
                                {emoji}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Zakwaszenie */}
                <div className={styles.statsInputContentElement}>
                    <p>Zakwaszenie</p>
                    <button type="button" onClick={() => setStats(prevStats => ({ ...prevStats, zakwaszenie: stats.zakwaszenie === "TAK" ? "NIE" : "TAK" }))}>
                        {stats.zakwaszenie}
                    </button>
                </div>

                {/* Kinaza */}
                <div className={styles.statsInputContentElement}>
                    <p>Kinaza</p>
                    <input type="text" name="kinaza" value={stats.kinaza} onChange={handleChange} />
                </div>

                {/* Komentarz */}
                <div className={styles.statsInputContentElement}>
                    <p>Komentarz</p>
                    <textarea name="komentarz" value={stats.komentarz} onChange={handleChange}></textarea>
                </div>
            </div>
            
            <button onClick={handleSubmit} className={styles.submitButton}>Zatwierdź</button>
        </div>
      );
    };
    
    export default StatsInput;