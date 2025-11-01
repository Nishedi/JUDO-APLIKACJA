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
                <div
                    className={styles.trainingDetails}
                    style={{ border: '2px solid ' + getActivityTypeColor(activity.dodatkowy_rodzaj_aktywności) }}
                    >
                    <p className={styles.oneline}>
                        <strong>Godzina rozpoczęcia:</strong> {activity.czas_rozpoczęcia}
                    </p>
                    <div className={styles.line}></div>

                    {(activity.rodzaj_aktywności === 'Fizjoterapia' || activity.rodzaj_aktywności === 'Inny') ? (
                        activity.rodzaj_aktywności === 'Fizjoterapia' ? (
                        <div className={styles.physioterapy}>Fizjoterapia</div>
                        ) : (
                        <div className={styles.physioterapy}>{activity.zadania}</div>
                        )
                    ) : (
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
                        ) : activity.szczegoly ? (
                            activity.rodzaj_aktywności !== "Motoryczny_test" ? (
                            <ul>
                                {activity.szczegoly.map((thing, index) => (
                                <li key={index}>
                                    <strong className={styles.name}>{thing?.name + " "}</strong><br/>
                                    {thing?.duration ?  <span>Czas trwania: <strong>{thing.duration}  min. </strong> </span>: ""}
                                    {thing?.durationSecond? <span>{!thing?.duration ? "Czas trwania: " : ""}<strong>{thing.durationSecond} sek.</strong></span>:""}
                                    {thing?.duration || thing?.durationSecond ? <br/>:null}
                                    {thing?.repeats ? <><span>Liczba powtórzeń: <strong>x{thing.repeats}</strong></span> <br/></>: ""}
                                    {thing?.times?.map((time, index) => (
                                        <div key={index}>
                                            Powtórzenie {time.number}: <strong>
                                            {(() => {
                                                const parts = [];
                                                if (time?.minutes !== '' && time?.minutes != null) parts.push(`${time.minutes} min.`);
                                                if (time?.seconds !== '' && time?.seconds != null) parts.push(`${time.seconds} sek.`);
                                                return parts.length ? parts.join(' ') : '—'; // tutaj możesz dać '' zamiast '—'
                                            })()}
                                            </strong>
                                        </div>
                                    ))}
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
                        ) : (
                            <ul>
                            {thingsToDo.map((thing, index) => {
                                const parts = thing.split(":");
                                return (
                                <li key={index}>
                                    {parts.length === 1 && <strong>{parts[0]}</strong>}
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
                    )}

                    <div className={styles.line}></div>
                    <div className={styles.trainerComment}>
                        <p>
                        <strong>Komentarz trenera:</strong>
                        <br />
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