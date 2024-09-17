import styles from './TrainingView.module.css';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';

const TrainingView = () => {

    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
    const [selectedMood, setSelectedMood] = useState(null);
    const [comment, setComment] = useState('');

    const handleMoodClick = (mood) => {
        setSelectedMood(mood);
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Obsługa dodania komentarza, np. wysłanie do API
    console.log('Komentarz dodany:', comment);
  };


    return (
        <div className = {styles.background}>
        {/* Navbar */}
        <div className={styles.navbar}>
            <div className={styles.burger}>
                <RxHamburgerMenu/>
            </div>
            <div className={styles.profilDiv}>
                <div  >
                    Trening TYP
                </div>

            </div>
        </div>
        {/* Body */}
        <div className={styles.trainingDetails}>
            <p><strong>Czas trwania:</strong> 45 min</p>
        <div>
            <p><strong>Zadania do wykonania:</strong></p>
            {/* Tutaj połączone z bazą - to co trener wskaże! */}
            <ul>
                <li>Ręce</li>
                <li>Nogi</li>
                <li>Plecy</li>
            </ul>
        </div>

        <div className={styles.switchContainer}>
          <label className={styles.trainingDetails}>Czy trening został wykonany?</label>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={isTrainingCompleted} 
              onChange={() => setIsTrainingCompleted(!isTrainingCompleted)} 
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.trainerComment}>
            <p><strong>Komentarz trenera:</strong>
                        <br/>
                        <div className={styles.commentSection}>Lorem Ipsum jest tekstem stosowanym 
                        jako przykładowy wypełniacz w przemyśle poligraficznym.
                        Został po raz pierwszy użyty w XV w. przez nieznanego 
                        drukarza do wypełnienia tekstem próbnej książki.
                        </div>
            </p>    
        </div>

        <p><strong>Odczucia po treningu</strong></p>
        <div className={styles.moodContainer}>
            <div className={styles.moods}>
                {['😊', '🙂', '😐', '😕', '☹️'].map((mood, index) => (
                <span 
                    key={index} 
                    className={`${styles.mood} ${selectedMood === mood ? styles.selected : ''}`}
                    onClick={() => handleMoodClick(mood)}
                >
                    {mood}
                </span>
                ))}
            </div>
        </div>
       
        <div className={styles.commentSection}>
          <label>KOMENTARZ</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Dodaj komentarz"
          ></textarea>
        </div>
        <div className={styles.buttoncenter}>
            <button className={styles.buttonTrening} onClick={handleSubmit}>Dodaj komentarz</button>
        </div>
      </div>
    </div>
  );
};

export default TrainingView;