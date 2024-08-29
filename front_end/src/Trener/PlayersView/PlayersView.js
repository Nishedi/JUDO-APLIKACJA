import styles from "./PlayersView.module.css";
import SimpleInfo from "./SinglePlayerQuickInfo";
import Sidebar from "./SideBar";
import { useState, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import { createClient } from '@supabase/supabase-js'
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const PlayersView = () => {
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const getPlayers = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('imie, nazwisko, stan_treningow, samopoczucie, waga')
            .eq('id_trenera', globalVariable.id)
        if(zawodnicy.length!==0){
            setPlayers(zawodnicy);
        }
        
    }

    useEffect(() => {
        getPlayers();
      }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const hideSidebar = () => {
        setIsSidebarOpen(false);
    }

    const onLogOutClick = () => {
        setGlobalVariable(null);
        navigate('/');
    }

    const onAddActivityClick = () => {
        navigate('/trener/addingactivityfirstpage');
    }

    const onAddPlayerClick = () => {
        navigate('/trener/addingplayerbaseinfo');
    }

    const now = new Date();
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    return (
        <div className={styles.background}>
            <Sidebar isOpen={isSidebarOpen} onLogOutClick={onLogOutClick} onClose={toggleSidebar} name={globalVariable.imie} surname={globalVariable.nazwisko} onAddActivityClick={onAddActivityClick} onAddPlayerClick={onAddPlayerClick}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar}>
                    <RxHamburgerMenu className={styles.burger}/>
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
            <div onClick={hideSidebar}>
                {players.map((player) => {
                    return <SimpleInfo player={player} />
                })}
            </div>
        </div>
    );
}
export default PlayersView;