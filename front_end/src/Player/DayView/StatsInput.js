import React,{ useState } from "react";
import styles from "./StatsInput.module.css";

const StatsInput = ({ onSubmit, initialData }) => {

    const [soreness, setSoreness] = useState(false); // State dla przycisku TAK/NIE
    const [mood, setMood] = useState(''); // State dla samopoczucia
    const [stats, setStats] = useState(initialData);

    const emojiIcons = [
        'front_end/src/emojis/beaming-face-with-smiling-eyes-svgrepo-com.svg',
        'front_end/src/emojis/neutral-face-svgrepo-com.svg',
        'front_end/src/emojis/sad-but-relieved-face-svgrepo-com.svg',
        'front_end/src/emojis/slightly-frowning-face-svgrepo-com.svg',
        'front_end/src/emojis/slightly-smiling-face-svgrepo-com.svg',
        'front_end/src/emojis/smiling-face-with-smiling-eyes-svgrepo-com.svg',
];

const Switch = ({ isOn, onToggle }) => {
    return (
      <label className={styles.switch}>
        <input type="checkbox" checked={isOn} onChange={onToggle} />
        <span
          className={`${styles.slider} ${
            isOn ? styles.on : styles.off
          }`}
        ></span>
      </label>
    );
  };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStats(prevStats => ({
            ...prevStats,
            [name]: value
        }));
    };

    const handleToggle = () => {
        setStats(prevStats => ({ 
          ...prevStats, 
          zakwaszenie: prevStats.zakwaszenie === "TAK" ? "NIE" : "TAK" 
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
                    <select name="tetno"
                            value={stats.tetno} 
                            onChange={handleChange}
                            className={styles.selectElement}
                    >
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
                    <div className={styles.emojiContainer}>
                        {['😢', '🙁', '😐', '🙂', '😊', '😁'].map((emoji, index) => (
                            <label key={index}className={styles.emojiLabel}>
                                <input
                                    type="radio"
                                    name="mood"
                                    value={emoji}
                                    checked={mood === emoji}
                                    onChange={() => setMood(emoji)}
                                    className={styles.emojiInput}
                                />
                               <span className={styles.emoji}>{emoji}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Zakwaszenie */}
                <div className={styles.statsInputContentElement2}>
                    <p>Zakwaszenie</p>
                    <div><Switch 
                         isOn={stats.zakwaszenie === "TAK" }
                         onToggle={handleToggle} />
                    </div>
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