import styles from './TreningView.module.css';
import React, { useEffect } from 'react';
import { TreningStatus, FeelingsAfter } from '../../../CommonFunction';
import { GlobalContext } from '../../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../../BackButton';

const TrenerTrainingView = () => {
    const { globalVariable, supabase } = useContext(GlobalContext);
    const { viewedPlayer } = useContext(GlobalContext);
    const [activity, setActivity] = useState(viewedPlayer.currentActivity);
    const [thingsToDo, setThingsToDo] = useState(["bład","błąd"]);
    const navigate = useNavigate();

    const splitThingsToDo = () => {
        const things = activity.zadania;
        const thingsArray = things?.split(",");
        setThingsToDo(thingsArray);
    };

    const getCurrentActivity = async () => {
        const { data, error } = await supabase
        .from('aktywności')
        .select('*')
        .eq('id', viewedPlayer.currentActivity.id)
        
        if (error) {
            console.error("Błąd pobierania aktywności", error);
            return;
        }
        setActivity(data[0]);
    };


    useEffect(() => {
        getCurrentActivity();
        splitThingsToDo();
    }, []);

    const deleteActivity = async () => {
        const { error } = await supabase
        .from('aktywności')
        .delete()
        .eq('id', activity.id)
        .eq('id_zawodnika', viewedPlayer.id)
        .eq('id_trenera', globalVariable.id);
        if (error) {
            console.error("Błąd usuwania aktywności", error);
            return;
        }
        navigate('/trener/singleplayersingleday');
        
    }

    const editActivity = () => {
        navigate('/trener/editingactivity');
    }

    const formatTime = (time) => {
        const hour = time.split(":")[0];
        const minute = time.split(":")[1];
        return `${hour} godz. ${minute} min.`;
    };

    return (
        <div className = {styles.background}>
            <div>
                <div className={styles.navbar}>
                    <div className={styles.burger}>
                        <BackButton/>
                    </div>
                    <div className={styles.profilDiv}>
                        <div  >
                            Trening <br/>
                            <span style={{ textTransform: 'uppercase' }}>{activity.rodzaj_aktywności}</span>
                        </div>
                    </div>
                </div>
                {/* Body */}
                <div className={styles.trainingDetails}>
                        <div className={styles.switchContainer}>
                            <label className={styles.trainingDetails}>Czy trening został wykonany?</label>
                            <TreningStatus treningStatus={activity.status} />    
                        </div>
                </div>
                <div className={styles.trainingDetails}>
                            <p className={styles.oneline}><strong>Godzina rozpoczęcia:</strong> {activity.czas_rozpoczęcia}</p>
                            <div className={styles.line}></div>
                            <p className={styles.oneline}><strong>Czas trwania:</strong> {formatTime(activity.czas_trwania)}</p>
                            <div className={styles.line}></div>

                        <div>
                            <p><strong>Zadania do wykonania:</strong></p>
                            {/* Tutaj połączone z bazą - to co trener wskaże! */}
                            {activity.rodzaj_aktywności==='Motoryczny' ? 
                            <button 
                                className={styles.buttonRozwin}
                                onClick={() => {
                                window.open("https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/treningipdf/trening2482024183939795.pdf");  // Przekierowanie
                            }}>Wyświetl szczegóły</button>
                            : (
                                <ul>
                                {thingsToDo.map((thing, index) => (
                                    <li key={index}>{thing}</li>
                                ))}
                                </ul>
                            )}
                        </div>                  
                        <div className={styles.line}></div>
                        <div className={styles.trainerComment}>
                            <p><strong>Komentarz trenera:</strong>
                                        <br/>
                                        <div className={styles.commentSection}>
                                        {activity.komentarz_trenera 
                                            ? activity.komentarz_trenera.split('\n').map((line, index, arr) => (
                                                <span key={index}>
                                                {line}
                                                {index < arr.length - 1 && <br />} {/* Dodaje <br /> tylko jeśli to nie jest ostatni element */}
                                                </span>
                                            ))
                                            : 'Brak komentarza'}
                                        </div>

                            </p>    
                        </div>
                    </div>
                    <div className={styles.trainingDetails}>
                        <div className={styles.switchContainer}>
                            <strong>Odczucia po treningu:</strong>
                            <FeelingsAfter  feelingsAfter={activity.odczucia} />
                        </div>
                        <div className={styles.line}></div>
                        <div className={styles.trainerComment}>
                            <p><strong>Komentarz zawodnika:</strong>
                                        <br/>
                                <div className={styles.commentSection}>
                                    {activity.komentarz_zawodnika || 'Brak komentarza'}
                                </div>
                            </p>    
                        </div>
                    
                </div>
            </div>
      <div className={styles.buttons}>
      <div className={styles.buttoncenter}>
            <button className={styles.buttonTrening} onClick={editActivity} >Edytuj</button>
        </div>
        <div className={styles.buttoncenter}>
            <button className={styles.buttonTrening} onClick={deleteActivity} >Usuń</button>
        </div>
        </div>
    </div>
  );
};

export default TrenerTrainingView;