import styles2 from "./SignlePlayerQuickInfo.module.css";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
const SimpleInfo = ({ player, onClick }) => {
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const currentDate = `${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`;
    const [stats, setStats] = useState(null);
    const [currentDayActivities, setCurrentDayActivities] = useState(null);
    const [doneActivities, setDoneActivities] = useState(0);
    const getStatsDay = async () => {
        let { data: stats, error } = await supabase
            .from('statystyki_zawodników')
            .select("*")
            .eq('data', currentDate)
            .eq('id_zawodnika', player.id);

        if (error) {
            console.error("Błąd pobierania statystyk", error);
            return;
        }
        if (stats) {
            if(stats.length > 0) {
                setStats(stats[0]);
            }else{
                console.log(player)
                const { data, error } = await supabase
                    .from('statystyki_zawodników')
                    .insert([
                        { id_trenera: player.id_trenera, id_zawodnika: player.id, data: currentDate },
                    ])
                    .select();
                if (error) {
                    console.error("Błąd dodawania statystyk", error);
                    return;
                }
                setStats(data[0]);
            }
        }
    }

    useEffect(() => {
        getStatsDay();
        getCurrentDayActivities();
    } 
    , []);

    useEffect(() => {
        countDoneActivities();
    }, [currentDayActivities]);

    const GetFeelingsEmoticon = ({feelingsAfter}) => {
        const pickEmoticon = (feelingsAfter) => {
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
            <div>
                <span> {pickEmoticon(feelingsAfter)} </span>
            </div>
        );
    };

    const getCurrentDayActivities = async () => {
        let { data: activities, error } = await supabase
            .from('aktywności')
            .select("*")
            .eq('data', currentDate)
            .eq('id_zawodnika', player.id);

        if (error) {
            console.error("Błąd pobierania aktywności", error);
            return;
        }
        if (activities) {
            setCurrentDayActivities(activities);
        }
    }
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
            <div style={{fontSize: '16px'}}>
               <span>{getStatusEmoticon(treningStatus)}</span>
            </div>
        );
    };

    const countDoneActivities = () => {
        if (currentDayActivities) {
            return setDoneActivities(currentDayActivities?.filter(activity => activity.status==="Zrealizowany").length);
        }
        return 0;
    }

    return (
        <div onClick={onClick} className={styles2.element}>
            <div className={styles2.mainString}>
                {player.imie} {player.nazwisko}
            </div>
            <div className={styles2.subString}>
            Stran treningów:
                <div className={styles2.emoticones}>
                {currentDayActivities?.length !== 0 ? (
                    currentDayActivities?.map((activity, index) => (
                        <div key={index}>
                            <TreningStatus treningStatus={activity.status} />
                        </div>
                    ))
                ) : (
                    "Brak treningów"
                )}
                </div>
            </div>
            <div className={styles2.subString}>
                Samopoczucie: <GetFeelingsEmoticon feelingsAfter={stats?.samopoczucie}/>
            </div>
            <div className={styles2.subString}>
                Waga: <div>{stats?.waga || "----" }</div>
            </div>
        </div>
    );
}
export default SimpleInfo;