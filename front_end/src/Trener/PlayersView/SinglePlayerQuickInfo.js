import styles2 from "./SignlePlayerQuickInfo.module.css";
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { GlobalContext } from "../../GlobalContext";
import { useContext } from "react";
import { GetFeelingsEmoticon,TreningStatus } from "../../CommonFunction"

const SimpleInfo = ({ player, onClick }) => {
    const { supabase } = useContext(GlobalContext);
    const currentDate = `${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`;
    const [stats, setStats] = useState(null);
    const [currentDayActivities, setCurrentDayActivities] = useState(null);
    const hasFetched = useRef(false); 

    const getStatsDay = async () => {
        if (hasFetched.current) return;  // Sprawdzenie flagi
        hasFetched.current = true;  // Ustawienie flagi
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

    useLayoutEffect(() => {
        getStatsDay();
        getCurrentDayActivities();
    }, []);
    
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
            const sortedActivities = activities.sort((a, b) => {
                // Zamieniamy godziny z formatu string na obiekty Date, aby móc je porównać
                const timeA = new Date(`${currentDate} ${a.czas_rozpoczęcia}`);
                const timeB = new Date(`${currentDate} ${b.czas_rozpoczęcia}`);
                return timeA - timeB;  // Sortowanie rosnące
            });
            setCurrentDayActivities(sortedActivities);
        }
    }

    return (
        <div onClick={onClick} className={styles2.element}>
            <div className={styles2.mainString}>
                {player.imie} {player.nazwisko}&nbsp;{player?.grupa && <div style={{color:"#AAA"}}>{`(${player.grupa})`}</div>}
            </div>
            <div className={styles2.subString}>
            Stan treningów:
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
                Samopoczucie: <strong style={{display: 'flex', flexDirection:'row', alignItems: 'center'}}>{stats?.samopoczucie}&nbsp;<GetFeelingsEmoticon feelingsAfter={stats?.samopoczucie}/></strong> 
            </div>
            <div className={styles2.subString}>
                Waga: <div><strong>{stats && stats.waga ? `${stats.waga} kg` : "----"}</strong></div>
            </div>
        </div>
    );
}
export default SimpleInfo;