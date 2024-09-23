import styles from "./PlayersView.module.css";
import SimpleInfo from "./SinglePlayerQuickInfo";
import Sidebar from "./SideBar";
import { useState, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const PlayersView = () => {
    const {setViewedPlayer, supabase} = useContext(GlobalContext);
    const {globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const getPlayers = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id_trenera', globalVariable.id)
            .order('nazwisko', {ascending: true});
        if(zawodnicy && zawodnicy.length!==0){
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

    const pickPlayer = (player) => {
        setViewedPlayer(player);
        navigate('/trener/singleplayerweekview');
    }

    const goToProfile = () => {
        navigate('/trener/userprofile');
    }

    const now = new Date();
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    return (
        <div className={styles.background}>
            <Sidebar isOpen={isSidebarOpen} onLogOutClick={onLogOutClick} onClose={toggleSidebar} name={globalVariable.imie} surname={globalVariable.nazwisko} onAddActivityClick={onAddActivityClick} onAddPlayerClick={onAddPlayerClick} goToProfile={goToProfile}/>
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
                {/* "trener/singleplayerweekview" */}
            </div>
            <div >
                {players.map((player) => {
                    return <SimpleInfo 
                        key={player.id}
                        onClick={() => pickPlayer(player)}  // Przekazanie gracza
                        player={player} 
                    />
                })}
            </div>
        </div>
    );
}
export default PlayersView;