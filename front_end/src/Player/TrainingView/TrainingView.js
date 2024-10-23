import styles from './TrainingView.module.css';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import { pickEmoticon, setMoodFromEmoticon } from '../../CommonFunction';
import BackButton from '../../BackButton';

const TrainingView = () => {
  const { supabase } = useContext(GlobalContext);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const [activity, setActivity] = useState(null); 
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

  function parseTextWithLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
        return (
            <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
            </a>
        );
        }
        return part;
    });
    }

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
            <div style={{textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{activity.rodzaj_aktywności}</div>
          </div>
        </div>
      </div>
      <div className={styles.trainingDetails}>
        <p className={styles.oneline}><strong>Godzina rozpoczęcia:</strong> {activity.czas_rozpoczęcia}</p>
        <div className={styles.line}></div>        
      {activity.rodzaj_aktywności === 'Fizjoterapia' || activity.rodzaj_aktywności === 'Inny'  ? 
        (
          activity.rodzaj_aktywności === 'Fizjoterapia' ?
          <div className={styles.physioterapy}>Fizjoterapia</div> 
          :
          <div className={styles.physioterapy}>{activity.zadania}</div>

       )
        :
        <div>
            <p><strong>Zadania do wykonania:</strong></p>
            <ul>
              { activity.zadania ? (
                activity.rodzaj_aktywności === 'Motoryczny' ?
                <button 
                    className={styles.buttonRozwin}
                    onClick={() => {
                    window.open(activity.zadania);  // Przekierowanie
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
        }

        <div className={styles.line}></div>        
        <div className={styles.trainerComment}>
          <p><strong>Komentarz trenera:</strong></p>
          <div className={styles.commentSection}>
            {parseTextWithLinks(activity.komentarz_trenera)}
          </div>
        </div>
      </div>
      <div className={styles.trainingDetails}>
        {activity.rodzaj_aktywności === 'Inny' ? null : (
          <>
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
          <div className={styles.line}></div>
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
            <p style={{ display: 'flex', justifyContent: 'center'}}>{selectedMood ? selectedMood : activity?.odczucia ? activity.odczucia : null }</p>
          </div>
          </>
        )}       
        <div className={styles.commentSection}>
          <label>Komentarz</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Dodaj komentarz"
            rows={10}
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
