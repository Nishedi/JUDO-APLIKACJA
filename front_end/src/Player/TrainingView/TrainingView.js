import styles from './TrainingView.module.css';
import React, { useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import BackButton from '../../BackButton';

const TrainingView = () => {
  const { supabase } = useContext(GlobalContext);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [comment, setComment] = useState('');

  const { id } = useParams();
  const location = useLocation();
  const [activity, setActivity] = useState(null); // Tutaj będzie pobrana aktywność z bazy danych
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
        setIsTrainingCompleted(aktywnosc.status);
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

  const setMoodFromEmoticon = (feelingsAfter) => {
    switch (feelingsAfter) {
        case '😢':
            setSelectedMood('Bardzo źle');  
            break; 
        case '🙁':
            setSelectedMood('Źle');
            break;
        case '😐':
            setSelectedMood('Neutralnie');  
            break;
        case '🙂':
            setSelectedMood('Dobrze'); 
            break;
        case '😊':
            setSelectedMood('Bardzo dobrze');  
            break;
        default:
            setSelectedMood('Neutralnie');
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trainingStatus = isTrainingCompleted ? 'Zrealizowany' : 'Niezrealizowany';
    
    
    try {
      const { error } = await supabase
        .from('aktywności')  // Nazwa tabeli w bazie danych
        .update({
          odczucia: selectedMood,
          komentarz_zawodnika: comment,
          status: trainingStatus
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
            Trening {activity.rodzaj_aktywnosci}
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className={styles.trainingDetails}>
        <p><strong>Czas trwania:</strong> {activity.czas_trwania}</p>
        <div>
          <p><strong>Zadania do wykonania:</strong></p>
          <ul>
            { activity.zadania ? (
              activity.zadania.split(',').map((task, index) => (
                <li key={index}>{task}</li>
              ))
            ) : (
              <li>Brak zadań do wykonania</li>
            )}
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
          <p><strong>Komentarz trenera:</strong></p>
          <div className={styles.commentSection}>
            {activity.komentarz_trenera}
          </div>
        </div>

        <p><strong>Odczucia po treningu</strong></p>
        <div className={styles.moodContainer}>
          <div className={styles.moods}>
            {['😢','☹️', '😐', '🙂','😊'].map((mood, index) => (
              <span
                key={index}
                className={`${styles.mood} ${pickEmoticon(selectedMood) === mood ? styles.selected : ''}`}
                onClick={() => setMoodFromEmoticon(mood)}
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
          <button className={styles.buttonTrening} onClick={handleSubmit}>Zatwierdź</button>
        </div>
      </div>
    </div>
  );
};

export default TrainingView;
