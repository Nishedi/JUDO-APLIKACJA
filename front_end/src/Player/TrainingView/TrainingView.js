import styles from './TrainingView.module.css';
import React, { useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';

const TrainingView = () => {
  const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [comment, setComment] = useState('');

  const { id } = useParams();
  const location = useLocation();
  const [activity, setActivity] = useState(null); // Tutaj będzie pobrana aktywność z bazy danych

  useEffect(() => {
    if (location.state && location.state.activity) {
      setActivity(location.state.activity);
    } else {
      // Pobranie aktywności z bazy danych
      fetchActivityFromDatabase(id);
    }
  }, [id, location.state]);

  // Pobieranie aktywności z bazy danych
  const fetchActivityFromDatabase = async (activityId) => {
    try {
      let { data: aktywnosc, error } = await supabase
        .from('aktywnosci')  // Tabela w bazie danych
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

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
  };

  // Tutaj przeniosłem logikę aktualizacji do funkcji `handleSubmit`
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Obsługa aktualizacji komentarza, odczuć i statusu w bazie danych
    try {
      const { error } = await supabase
        .from('aktywności')  // Nazwa tabeli w bazie danych
        .update({
          odczucia: selectedMood,
          komentarz_zawodnika: comment,
          status: isTrainingCompleted
        })
        .eq('id', activity.id);  // Warunek aktualizacji

      if (error) {
        console.error('Błąd aktualizacji danych', error);
      } else {
        console.log('Komentarz i odczucia zaktualizowane');
      }
    } catch (err) {
      console.error('Błąd', err);
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
          <RxHamburgerMenu />
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
            {/* Dodaję warunek, który sprawdza, czy 'zadania_do_wykonania' istnieje */}
            { activity.zadania_do_wykonania ? (
              activity.zadania_do_wykonania.split(',').map((task, index) => (
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
