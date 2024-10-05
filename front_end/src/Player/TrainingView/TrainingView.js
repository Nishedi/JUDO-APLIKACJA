import styles from './TrainingView.module.css';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { pickEmoticon, setMoodFromEmoticon } from '../../CommonFunction';
import BackButton from '../../BackButton';

const TrainingView = () => {
  const { supabase } = useContext(GlobalContext);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const [activity, setActivity] = useState(null); 

  const [time, setTime] = useState(() => {
    const initialTime = new Date();
    initialTime.setHours(0, 0, 0, 0); // Ustawiamy godziny, minuty, sekundy i milisekundy na 0
    return initialTime;
  });

  const navigate = useNavigate();
  
  // Pobieranie aktywności z bazy danych
  const fetchActivityFromDatabase = async (activityId) => {
    try {
      let { data: aktywnosc, error } = await supabase
        .from('aktywności')  // Tabela w bazie danych
        .select('*')
        .eq('id', activityId)
        .single();

      if (error) {
        console.error('Błąd podczas pobierania aktywności FETCHACTFROMDATAB:', error);
      } else {
        setActivity(aktywnosc);
        if(aktywnosc.status === 'Zrealizowany') setIsTrainingCompleted(true);
        setSelectedMood(aktywnosc.odczucia);
        setComment(aktywnosc.komentarz_zawodnika);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania aktywności:', error);
    }
  };

  useEffect(() => {
    fetchActivityFromDatabase(id);
  }, [id]);



    const getTimeString = (time) => {
      if (!time) return '';
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trainingStatus = isTrainingCompleted ? 'Zrealizowany' : 'Niezrealizowany';
    try {
      const { error } = await supabase
        .from('aktywności')  // Nazwa tabeli w bazie danych
        .update({
          odczucia: selectedMood,
          komentarz_zawodnika: comment,
          status: trainingStatus,
          czas_trwania: getTimeString(time),
        })
        .eq('id', activity.id);  // Warunek aktualizacji

      if (error) {
        console.error('Błąd aktualizacji danych', error);
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error('Błądddd', err);
    }
  };

  if (!activity) {
    return <div>Ładowanie...</div>;
  }

  return (
    
    <div className={styles.background}>
      {/* Navbar */}
      <div className={styles.navbar}>
        <div className={styles.burger}>
          <BackButton />
        </div>
        <div className={styles.profilDiv}>
          <div>
            Trening 
            <div style={{textTransform: 'uppercase'}}>{activity.rodzaj_aktywności}</div>
          </div>
        </div>
      </div>
      <div className={styles.trainingDetails}>
        {/* <p><strong>Czas trwania:</strong> {activity.czas_trwania}</p> */}
        <div>
          <p><strong>Zadania do wykonania:</strong></p>
          <ul>
            { activity.zadania ? (
              activity.rodzaj_aktywności === 'Motoryczny' ?
              <button 
                  className={styles.buttonRozwin}
                  onClick={() => {
                  window.open("https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/treningipdf/trening2482024183939795.pdf");  // Przekierowanie
              }}>
                  Wyświetl szczegóły
              </button>
              :
              <ul>
                {activity.zadania.split(',').map((task, index) => {
                    // Podziel zadanie na części na podstawie dwukropka ":"
                    const parts = task.split(":");
            
                    return (
                        <li key={index}>
                            {parts.length === 1 && (
                                // Jeśli jest tylko jedna część
                                <strong>{parts[0]}</strong>
                            )}
                            {parts.length === 2 && (
                                // Jeśli są dwie części, wyświetl je z dwukropkiem pomiędzy
                                <>
                                    <strong>{parts[0]}</strong>: {parts[1]}
                                </>
                            )}
                            {parts.length === 3 && (
                                // Jeśli są trzy części, wyświetl każdą część
                                <>
                                    <strong>{parts[0]}</strong> {parts[1]} {parts[2]}
                                </>
                            )}
                        </li>
                    );
                })}
          </ul>
          
            ) : (
              <li>Brak zadań do wykonania</li>
            )}
          </ul>
        </div>

        <div className={styles.trainerComment}>
          <p><strong>Komentarz trenera:</strong></p>
          <div className={styles.commentSection}>
            {activity.komentarz_trenera}
          </div>
        </div>
</div>
<div className={styles.trainingDetails}>
        <p><strong>Odczucia po treningu</strong></p>
        <div className={styles.moodContainer}>
          <div className={styles.moods}>
            {['😢','🙁', '😐', '🙂','😊'].map((mood, index) => (
              <span
                key={index}
                className={`${styles.mood} ${pickEmoticon(selectedMood) === mood ? styles.selected : ''}`}
                onClick={() => setMoodFromEmoticon(mood, setSelectedMood)}
              >
                {mood}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.input_container}>
                    <p><strong>Czas trwania treningu</strong></p>
                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly />
        </div>

        <div className={styles.commentSection}>
          <label>KOMENTARZ</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Dodaj komentarz"
          ></textarea>
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
        <div className={styles.buttoncenter}>
          <button className={styles.buttonTrening} onClick={handleSubmit}>Zatwierdź</button>
        </div>
      </div>
    </div>
  );
};

export default TrainingView;
