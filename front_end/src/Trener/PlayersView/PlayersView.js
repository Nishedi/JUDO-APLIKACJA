import styles from "./PlayersView.module.css";
import SimpleInfo from "./SinglePlayerQuickInfo";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { useEffect } from "react";

const PlayersView = () => {
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const [players, setPlayers] = useState([]);
    const getPlayers = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('imie, nazwisko, stan_treningow, samopoczucie, waga')
            .eq('id_trenera', '1')
        if(zawodnicy.length!==0){
            setPlayers(zawodnicy);
        }
        
    }

    useEffect(() => {
        getPlayers();
      }, []);

   

    const now = new Date();
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div>
                    Burger
                </div>
                <div className="left_navbar">
                    <div className={styles.writing_div}>
                        Twoi ZAWODNICY
                    </div>
                    <div className={styles.date_div}>
                        {now.getDate()+" "+monthNames[now.getMonth()]+", "+dayNames[now.getDay()]}
                    </div>
                </div>
                
            </div>
            <div>
                {players.map((player) => {
                    return <SimpleInfo player={player} />
                })}
            </div>
        </div>
    );
}
export default PlayersView;