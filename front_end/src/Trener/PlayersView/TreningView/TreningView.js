import styles from './TreningView.module.css';
import React, { useEffect } from 'react';
import { TreningStatus, FeelingsAfter, getActivityTypeColor } from '../../../CommonFunction';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            console.log(viewedPlayer.currentActivity);
            console.error("Błąd pobierania aktywności", error);
            return;
        }
        setActivity(data[0]);
    };


    useEffect(() => {
        getCurrentActivity();
        
    }, []);
    useEffect(() => {
        splitThingsToDo();
    }, [activity]);

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

    const duplicateActivity = async () => {
        navigate(`/trener/addingactivityfirstpage/${"duplicate"}`);
    }

    const editActivity = () => {
        navigate(`/trener/addingactivityfirstpage/${"edit"}`);
        // navigate('/trener/editingactivity');
    }


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


    return (
        <div className = {styles.background}>
            <div>
                <div className={styles.navbar}>
                    <div className={styles.burger}>
                        <BackButton path={"/trener/singleplayersingleday"}/>
                    </div>
                    <div className={styles.profilDiv}>
                        <div  >
                            Trening <br/>
                            <span style={{ textTransform: 'uppercase' }}>{activity.rodzaj_aktywności}</span>
                        </div>
                    </div>
                </div>
                {/* Body */}
                {activity.rodzaj_aktywności !== 'Inny' ? 
                    <div className={styles.trainingDetails} style={{border: '2px solid ' + getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności)}}>
                            <div className={styles.switchContainer}>
                                <label className={styles.trainingDetails}>Czy trening został wykonany?</label>
                                <TreningStatus treningStatus={activity.status} />    
                            </div>
                    </div>
                    :null
                }
                <div className={styles.trainingDetails} style={{border: '2px solid ' + getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności)}}>
                    <p className={styles.oneline}><strong>Godzina rozpoczęcia:</strong> {activity.czas_rozpoczęcia}</p>
                            <div className={styles.line}></div>

                        {activity.rodzaj_aktywności === 'Fizjoterapia' || activity.rodzaj_aktywności === 'Inny' 
                        ? (
                            activity.rodzaj_aktywności === 'Fizjoterapia' ?
                            <div className={styles.physioterapy}>Fizjoterapia</div> 
                            :
                            <div className={styles.physioterapy}>{activity.zadania}</div>

                         ) :
                        <div>
                            <p><strong>Zadania do wykonania:</strong></p>
                            {/* Tutaj połączone z bazą - to co trener wskaże! */}
                            {activity.rodzaj_aktywności==='Motoryczny' ? 
                            <button 
                                className={styles.buttonRozwin}
                                onClick={() => {
                                window.open(activity.zadania);  // Przekierowanie
                            }}>Wyświetl szczegóły</button>
                            : (
                                
                                activity.szczegoly ?
                                    <ul>
                                         {activity.szczegoly.map((thing, index) => {
                                            return(
                                                <li key={index}>
                                                    <strong>{thing?.name+" "}</strong>
                                                    {thing?.duration ? thing.duration + " min. " : ""} 
                                                    {thing?.durationSecond ? thing.durationSecond + " sek. " : ""}
                                                    {thing?.repeats ? "x"+thing.repeats + "\u00A0\u00A0" : ""}
                                                    {thing?.meters ? thing.meters + " m. " : ""}
                                                    {
                                                    thing?.goldenScoreMinutes && thing?.goldenScore 
                                                        ? "+ " + thing.goldenScoreMinutes + ":" + (thing.goldenScore.toString().padStart(2, "0"))
                                                        : thing?.goldenScoreMinutes 
                                                        ? "+ " + thing.goldenScoreMinutes + " min. "
                                                        : thing?.goldenScore 
                                                        ? "+ " +  thing.goldenScore + " s."
                                                        : ""
                                                    }

                                                </li>
                                            );
                                        })}
                                    </ul> 
                                    :
                                    <ul>
                                        {thingsToDo.map((thing, index) => {
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
                        }                 
                        <div className={styles.line}></div>
                        <div className={styles.trainerComment}>
                            <p><strong>Komentarz trenera:</strong>
                                <br/>
                                <div className={styles.commentSection}>
                                    {activity.komentarz_trenera 
                                        ? activity.komentarz_trenera.split('\n').map((line, index) => (
                                            <span key={index} className={styles.commentLine}>
                                            {parseTextWithLinks(line)}
                                            {index < activity.komentarz_trenera.split('\n').length - 1 && <br />} 
                                            </span>
                                        ))
                                        : 'Brak komentarza'}
                                </div>
                            </p>    
                        </div>
                    </div>
                    <div className={styles.trainingDetails} style={{border: '2px solid ' + getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności)}}>
                        {activity.rodzaj_aktywności !== 'Inny' ?
                            <>
                                <div className={styles.switchContainer}>
                                    <strong>Odczucia po treningu:</strong>
                                    <FeelingsAfter  feelingsAfter={activity.odczucia} />
                                </div>
                                <div className={styles.line}></div>
                            </>:null
                        }
                        
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
            {isModalOpen && (
                    <div className={styles.modal_overlay}>
                        <div className={styles.modal_content}>
                            <h2>Czy na pewno chcesz usunąć tą aktywność?</h2>
                            <div className={styles.modal_buttons}>
                                <button onClick={deleteActivity}>Tak</button>
                                <button onClick={()=>setIsModalOpen(false)}>Nie</button>
                            </div>
                        </div>
                    </div>
                )}
      <div className={styles.buttons}>
        <div className={styles.buttoncenter}>
            <button className={styles.buttonTrening} onClick={duplicateActivity} >Duplikuj</button>
        </div>
      <div className={styles.buttoncenter}>
            <button className={styles.buttonTrening} onClick={editActivity} >Edytuj</button>
        </div>
        <div className={styles.buttoncenter}>
            <button className={styles.buttonTrening} onClick={()=>setIsModalOpen(true)} >Usuń</button>
        </div>
        </div>
    </div>
  );
};

export default TrenerTrainingView;