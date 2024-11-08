import styles from "./PlayerStats.module.css";
import Sidebar from "../SideBar";
import { useState, useContext } from "react";
import { GlobalContext } from '../../../GlobalContext';
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';


const PlayerStats = () => {
    const {setViewedPlayer, supabase} = useContext(GlobalContext);
    const {viewedPlayer, globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [playerStats, setPlayerStats] = useState([]);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2); 
    firstDayOfMonth.setDate(firstDayOfMonth.getDate()); // Ostatni dzień poprzedniego miesiąca
    const [firstDate, setFirstDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [secondDate, setSecondDate] = useState(new Date().toISOString().split('T')[0]);
    const [processedPlayerStats, setProcessedPlayerStats] = useState([]);
    const getPlayerStats = async () => {
        const dates = generateDateArray(firstDate, secondDate);
        let { data: statystyki, error } = await supabase
            .from('statystyki_zawodników')
            .select('*')
            .in('data', dates)
            .eq('id_trenera', globalVariable.id)
            .eq('id_zawodnika', viewedPlayer.id);
        if(error){
            alert("Błąd podczas pobierania danych zawodnika");
        }
        if(statystyki){
            setPlayerStats(statystyki);
        }
    }

    const generateDateArray = (startDateStr, endDateStr) => {
        const startDate = new Date(startDateStr); // Miesiące są zero-indeksowane
        const endDate = new Date(endDateStr);
        const dates = [];
        while (startDate <= endDate) {
            const formattedDate = `${String(startDate.getDate()).padStart(2, '0')}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${startDate.getFullYear()}`;
            dates.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1); // Przejdź do następnego dnia
        }
        
        return dates;
    };

    useEffect(() => {
        getPlayerStats();
      }, []);

    useEffect(() => {
        if(playerStats.length === 0) return;    
        const data = playerStats.map(entry => {
            // Mapowanie samopoczucia na wartości
            let feelingValue;
            switch (entry.samopoczucie) {
                case 'Bardzo źle':
                    feelingValue = 20;
                    break;
                case 'Źle':
                    feelingValue = 40;
                    break;
                case 'Neutralnie':
                    feelingValue = 60;
                    break;
                case 'Dobrze':
                    feelingValue = 80;
                    break;
                case 'Bardzo dobrze':
                    feelingValue = 100;
                    break;
                default:
                    feelingValue = 60; // Domyślna wartość na wypadek nieznanego stanu
                    break;
            }
        
            return {
                date: entry.data,
                feeling: feelingValue,
                pulse: entry.tętno,
                weight: entry.waga
            };
        });
        
        const fullDateRange = [];
        const startDate = new Date(firstDate);
        const endDate = new Date(secondDate);
        const validPulses = data.filter(entry => typeof entry.pulse === 'number');
        const avgPulse = validPulses.reduce((acc, entry) => acc + entry.pulse, 0) / (validPulses.length || 1);
        const validWeights = data.filter(entry => typeof entry.weight === 'number');
        const avgWeight = validWeights.reduce((acc, entry) => acc + entry.weight, 0) / (validWeights.length || 1);
        const validFeelings = data.filter(entry => typeof entry.feeling === 'number');
        const avgFeeling = validFeelings.reduce((acc, entry) => acc + entry.feeling, 0) / (validFeelings.length || 1);

        // Użyj pętli do utworzenia zakresu dat
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split('T')[0];
            const entry = data.find(item => {
                const formattedItemDate = item.date 
                    ? item.date.split('.').reverse().join('-')  // Przekształca "DD.MM.YYYY" na "YYYY-MM-DD"
                    : null;
                return formattedItemDate === formattedDate;
            });
            fullDateRange.push({
                date: formattedDate,
                feeling: entry?.feeling ? entry.feeling : avgFeeling,
                pulse: entry?.pulse ? entry.pulse : avgPulse,
                weight: entry?.weight ? entry.weight : avgWeight
            });
        }
        setProcessedPlayerStats(fullDateRange);
    }, [firstDate, secondDate, playerStats]);

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

    const goToProfile = () => {
        navigate('/trener/userprofile');
    }

    const closeSidebar = () => {
        if(isSidebarOpen){
            setIsSidebarOpen(false);
        }
    }

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
    , [window.innerWidth]);
    return (
        <div onClick={closeSidebar} className={styles.background}>
            <Sidebar onReportErrorClick={onReportErrorClick} isOpen={isSidebarOpen} onLogOutClick={onLogOutClick} onClose={toggleSidebar} name={globalVariable.imie} surname={globalVariable.nazwisko} onAddActivityClick={onAddActivityClick} onAddPlayerClick={onAddPlayerClick} goToProfile={goToProfile}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar}>
                    <RxHamburgerMenu className={styles.burger}/>
                </div>
                <div className="left_navbar" onClick={() => setIsSidebarOpen(false)}>
                    <div className={styles.writing_div}>
                        Statystyki zawodnika
                    </div>
                    <div className={styles.player_info_div}>
                        {viewedPlayer.imie} {viewedPlayer.nazwisko}
                    </div>
                </div>
                 
            </div>
            <div className={styles.chartSection}>
            {windowWidth > 550 ?
                <LineChart 
                    width={windowWidth} 
                    height={400} 
                    data={processedPlayerStats} 
                    margin={windowWidth > 550 
                        ? { top: 20, right: 10, left: 30, bottom: 40 } 
                        : { top: 20, right: 10, left: 10, bottom: 40 }
                    }
                    >
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="date" label={{ value: 'Data', position: 'bottom', offset: 0 }} minTickGap={15} />
                    {window.innerWidth > 550 ?
                        <YAxis 
                            ticks={[20, 40, 60, 80, 100]}  
                            tickFormatter={(value) => {
                                switch(value) {
                                    case 20: return "Bardzo źle\n20";
                                    case 40: return "Źle\n40";
                                    case 60: return "Neutralnie\n60";
                                    case 80: return "Dobrze\n80";
                                    case 100: return "Bardzo dobrze\n100";
                                    default: return value;
                                }
                            }}
                            style={{ whiteSpace: 'pre-line', wordWrap: 'normal', overflowWrap: 'normal' }} 
                        /> : 
                        <YAxis 
                            ticks={[20, 40, 60, 80, 100]}  
                            tickFormatter={(value) => {
                                switch(value) {
                                    case 20: return "😢\n20";
                                    case 40: return "🙁\n40";
                                    case 60: return "😐\n60";
                                    case 80: return "🙂\n80";
                                    case 100: return "😊\n100";
                                    default: return value;
                                }
                            }}
                            style={{ whiteSpace: 'pre-line', wordWrap: 'normal', overflowWrap: 'normal' }} 
                        />
                        }    
                    <Line type="monotone" dataKey="pulse" stroke={'#77AEFF'} dot={false} name="Tętno" />
                    <Line type="monotone" dataKey="weight" stroke={'#FF77AE'} dot={false} name="Waga" />
                    <Line type="monotone" dataKey="feeling" stroke={'#11BBAE'} dot={false} name="Samopoczucie" />
                    <Legend verticalAlign="top" height={36} />
                </LineChart>:
                <div style={{
                    display: 'flex',
                    justifyContent: 'center', // Centrowanie w poziomie
                    textAlign: 'center'
                }}>
                    <h1>Obróć telefon aby wyświetlić wykresy</h1>
                </div>}

                </div> 
        </div>
    );
}
export default PlayerStats;