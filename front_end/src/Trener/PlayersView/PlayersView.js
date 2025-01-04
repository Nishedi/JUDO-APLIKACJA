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
            .order('imie', {ascending: true});
        
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

    const onReportErrorClick = () => {
        navigate('/reporterror');
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

    const closeSidebar = () => {
        if(isSidebarOpen){
            setIsSidebarOpen(false);
        }
    }


    const now = new Date();
    const dayNames = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", 
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    
        return (
        <div onClick={closeSidebar} className={styles.background}>
            <Sidebar onReportErrorClick={onReportErrorClick} isOpen={isSidebarOpen} onLogOutClick={onLogOutClick} onClose={toggleSidebar} name={globalVariable.imie} surname={globalVariable.nazwisko} onAddActivityClick={onAddActivityClick} onAddPlayerClick={onAddPlayerClick} goToProfile={goToProfile}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar}>
                    <RxHamburgerMenu className={styles.burger}/>
                </div>
                <div className="left_navbar" onClick={() => setIsSidebarOpen(false)}>
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