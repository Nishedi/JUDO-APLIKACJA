import styles from './TreningView.module.css';
import React, { useEffect } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { GlobalContext } from '../../../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const TrenerTrainingView = () => {
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const { viewedPlayer, setViewedPlayer } = useContext(GlobalContext);
    const [activity, setActivity] = useState(viewedPlayer.currentActivity);
    const [thingsToDo, setThingsToDo] = useState(["bład","błąd"]);
    const navigate = useNavigate();

    const splitThingsToDo = () => {
        const things = activity.zadania;
        const thingsArray = things?.split(",");
        setThingsToDo(thingsArray);
    };

    useEffect(() => {
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
        navigate(-1);
        
    }

    const formatTime = (time) => {
        const hour = time.split(":")[0];
        const minute = time.split(":")[1];
        return `${hour} godz. ${minute} min.`;
    };

    const TreningStatus = ({ treningStatus}) => {
        const getStatusEmoticon = (treningStatus) => {
            switch (treningStatus) {
                case 'Nierozpoczęty':
                    return '⏳';  // Emotikona oczekiwania
                case 'Zrealizowany':
                    return '✅';  // Emotikona wykonania
                case 'Niezrealizowany':
                    return '❌';  // Emotikona niewykonania
                default:
                    return '🤷';  // Emotikona na wypadek nieznanego statusu
            }
        };
    
        return (
            <div style={{fontSize: '24px'}}>
               <span>{getStatusEmoticon(treningStatus)}</span>
            </div>
        );
    };

    const FeelingsAfter = ({feelingsAfter }) => {

        const getFeelingsEmoticon = (feelingsAfter) => {
            switch (feelingsAfter) {
                case 'Bardzo źle':
                    return '😢';  // Bardzo źle
                case 'Źle':
                    return '😕';  // Źle
                case 'Neutralnie':
                    return '😐';  // Neutralnie
                case 'Dobrze':
                    return '🙂';  // Dobrze
                case 'Bardzo dobrze':
                    return '😁';  // Bardzo dobrze
                default:
                    return '😐';  // Brak emotikony, jeśli nie ma odczuć
            }
        };
    
        return (
            <div style={{fontSize: '24px'}}>
               <span> {getFeelingsEmoticon(feelingsAfter)} {feelingsAfter}</span> 
            </div>
        );
    };

    return (
        <div className = {styles.background}>
            <div>
                <div className={styles.navbar}>
                    <div className={styles.burger}>
                        <RxHamburgerMenu/>
                    </div>
                    <div className={styles.profilDiv}>
                        <div  >
                            Trening {activity.rodzaj_aktywności}
                        </div>

                    </div>
                </div>
                {/* Body */}
                <div className={styles.trainingDetails}>
                    <p className={styles.oneline}><strong>Godzina rozpoczęcia:</strong> {activity.czas_rozpoczęcia}</p>
                    <p className={styles.oneline}><strong>Czas trwania:</strong> {formatTime(activity.czas_trwania)}</p>
                    <div>
                        <p><strong>Zadania do wykonania:</strong></p>
                        {/* Tutaj połączone z bazą - to co trener wskaże! */}
                        <ul>
                            {thingsToDo.map((thing, index) => (
                                <li key={index}>{thing}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.switchContainer}>
                    <label className={styles.trainingDetails}>Czy trening został wykonany?</label>
                    <TreningStatus treningStatus={activity.status} />
                    
                    </div>

                    <div className={styles.trainerComment}>
                        <p><strong>Komentarz trenera:</strong>
                                    <br/>
                                    <div className={styles.commentSection}>
                                        {activity.komentarz_trenera || 'Brak komentarza'}
                                    </div>
                        </p>    
                    </div>
                    <div className={styles.switchContainer}>
                        <p><strong>Odczucia po treningu</strong></p>
                        <FeelingsAfter styles={{fontSize:'40px'}} feelingsAfter={activity.odczucia} />
                    </div>
                
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
            <button className={styles.buttonTrening} onClick={deleteActivity} >Usuń</button>
        </div>
        </div>
    </div>
  );
};

export default TrenerTrainingView;