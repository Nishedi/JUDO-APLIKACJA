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
  const [comment, setComment] = useState("");
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
        (
          <div>
            <p><strong>Zadania do wykonania:</strong></p>
            {activity.rodzaj_aktywności === 'Motoryczny' ? (
              <button
                className={styles.buttonRozwin}
                onClick={() => {
                  window.open(activity.zadania);
                }}
              >
                Wyświetl szczegóły
              </button>
            ) : activity.szczegoly ? 
            (
              activity.rodzaj_aktywności !== "Motoryczny_test" ? (
                <ul>
                  {activity.szczegoly.map((thing, index) => (
                    <li key={index}>
                      <strong className={styles.name}>{thing?.name + " "}</strong><br/>
                      {thing?.duration ?  <span>Czas trwania: <strong>{thing.duration}  min. </strong> </span>: ""}
                      {thing?.durationSecond? <span>{!thing?.duration ? "Czas trwania: " : ""}<strong>{thing.durationSecond} sek.</strong></span>:""}
                      {thing?.duration || thing?.durationSecond ? <br/>:null}
                      {thing?.repeats ? <><span>Liczba powtórzeń: <strong>x{thing.repeats}</strong></span> <br/></>: ""}
                      {thing?.meters ?<><span>Odległość: <strong>{thing.meters} m. </strong></span> <br/></>: ""}
                      {thing?.goldenScoreMinutes ? <span> Golden Score: <strong>{thing.goldenScoreMinutes} min. </strong></span> : ""}
                      {thing?.goldenScore ? <span>{!thing?.goldenScoreMinutes ? "Golden Score: " : ""}<strong>{thing.goldenScore} sek. </strong></span> : ""}
                      {thing?.goldenScoreMinutes && thing?.goldenScore ? <br /> : ""}
                      {thing?.breakBetweenSeries ?<> <span>Przerwa między seriami: <strong>{thing.breakBetweenSeries} sek. </strong></span><br/></> : ""}
                      {thing?.numberOfSeries ? <><span>Liczba serii: <strong>{thing.numberOfSeries}</strong></span><br/> </>: ""}
                      {thing?.breakBetweenIntervals ? <><span>Przerwa między interwałami: <strong>{thing.breakBetweenIntervals} sek. </strong></span><br/> </> : ""}                              
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  {activity.szczegoly.map((thing, index) => (
                    <li key={index}>
                        <span className={styles.bolded700}>{thing?.name + " "}</span><br/>
                        {thing?.content && thing.content}
                        {thing?.roundNumber?<>Liczba rund: {thing.roundNumber}<br/></>:""}
                        {thing?.exerciseTime ? <> Czas ćwiczenia: {thing.exerciseTime} <br/></> : ""}
                        {thing?.breakTime ? <span> Przerwa: {thing.breakTime} <br/></span> : ""}
                        {thing?.brakeBetweenRounds ? <span> Przerwa między rundami: {thing.brakeBetweenRounds}<br/> </span> : ""}
                        {
                          thing.activities && thing.activities.length > 0 ? (
                            <>
                              <span>Ćwiczenia:</span>
                              <br/>
                              <ul className={styles.list}>                      
                                  {thing.activities.map((activityItem, activityIndex) => (
                                    <li key={activityIndex} className={styles.list}>
                                      <strong className={styles.bolded}>{activityItem.activityName }</strong><br/>
                                      {activityItem.repeats ? <>Liczba powtórzeń: {activityItem.repeats}<br/></> : ""}
                                      {activityItem.weight ? <>Waga: {activityItem.weight} kg<br/></> : ""}
                                      {activityItem.time ? <>Czas: {activityItem.time} <br/></> : ""} 
                                      {activityItem.rate ? <>Tempo: {activityItem.rate}<br/></>: ""}                            
                                     </li>
                                  ))}
                              </ul>
                            </>
                          ) : null                          
                        }
                     </li>
                  ))}
                </>
              )
            ) : 
            (
              <ul>
                {activity.zadania.split(',').map((thing, index) => {
                  const parts = thing.split(":");
                    return (
                      <li key={index}>
                        {parts.length === 1 && (
                          <strong>{parts[0]}</strong>
                         )}
                        {parts.length === 2 && (
                          <>
                            <strong>{parts[0]}</strong>: {parts[1]}
                          </>
                         )}
                        {parts.length === 3 && (
                          <>
                            <strong>{parts[0]}</strong> {parts[1]} {parts[2]}
                          </>
                        )}
                      </li>
                      );
                    })}
                </ul>           
              )}
            </div>
          )
        }

        <div className={styles.line}></div>        
        <div className={styles.trainerComment}>
          <p><strong>Komentarz trenera:</strong></p>
          <div className={styles.commentSection}> 
            {activity.komentarz_trenera ? (
              parseTextWithLinks(activity.komentarz_trenera)
            ) : (
              ""
            )}
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
