import styles from "./PlayerStats.module.css";
import Sidebar from "../SideBar";
import { useState, useContext } from "react";
import { GlobalContext } from '../../../GlobalContext';
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import DatePicker from 'react-datepicker';


const PlayerStats = () => {
    const {setViewedPlayer, supabase} = useContext(GlobalContext);
    const {viewedPlayer, globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [playerStats, setPlayerStats] = useState([]);
    const today = new Date();
    const [scrolableChart, setScrolableChart] = useState(false);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2); 
    firstDayOfMonth.setDate(firstDayOfMonth.getDate()); // Ostatni dzień poprzedniego miesiąca
    const [firstDate, setFirstDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [secondDate, setSecondDate] = useState(new Date().toISOString().split('T')[0]);
    const [processedPlayerStats, setProcessedPlayerStats] = useState([]);
    const [maxWeight, setMaxWeight] = useState(0);
    const [minWeight, setMinWeight] = useState(0);
    const [maxPulse, setMaxPulse] = useState(0);
    const [minPulse, setMinPulse] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [accurancy, setAccurancy] = useState(10);
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
        const startDate = new Date(startDateStr); 
        const endDate = new Date(endDateStr);
        const dates = [];
        while (startDate <= endDate) {
            const formattedDate = `${String(startDate.getDate()).padStart(2, '0')}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${startDate.getFullYear()}`;
            dates.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1); 
        }
        
        return dates;
    };

    const changeAccurancy = (incOrDec) => {
        // console.log(accurancy)
        // let change = 1;
        // if(accurancy >= 100 && incOrDec == 1) return;
        // if(accurancy <= 0.15 && incOrDec == -1) return;
        // if(accurancy >= 20 && incOrDec == -1) change = 10;
        // if(accurancy >= 10 && incOrDec == 1) change = 10;
        
        // if(accurancy <= 10 && incOrDec == 1) change = 1;
        // if(accurancy <= 1 && incOrDec == -1) change = 0.1;
        // setAccurancy(accurancy + change*incOrDec);
    }


    useEffect(() => {
        getPlayerStats();
      }, [firstDate, secondDate]);

    useEffect(() => {
        if(playerStats.length === 0) return;   
         
        const data = playerStats.map(entry => {
            // Mapowanie samopoczucia na wartości
            
            let feelingValue;
            switch (entry.samopoczucie) {
                case 'Bardzo źle':
                    feelingValue = 0;
                    break;
                case 'Źle':
                    feelingValue = 25;
                    break;
                case 'Neutralnie':
                    feelingValue = 50;
                    break;
                case 'Dobrze':
                    feelingValue = 75;
                    break;
                case 'Bardzo dobrze':
                    feelingValue = 100;
                    break;
                default:
                    feelingValue = null; 
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
        const validWeights = data.filter(entry => typeof entry.weight === 'number' && entry.weight >= 10);
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
        let minWeight = Math.min(...fullDateRange
            .filter(entry => entry.weight !== null && entry.weight !== 0) // Pomiń wiersze z brakującymi danymi
            .map(entry => entry.weight));
        let maxWeight = Math.max(...fullDateRange.map(entry => entry.weight));
        const diffrence = maxWeight - minWeight;
        minWeight = minWeight - diffrence/10;
        maxWeight = maxWeight + diffrence/10;
        let minPulse = Math.min(...fullDateRange 
            .filter(entry => entry.pulse !== null && entry.pulse !== 0) // Pomiń wiersze z brakującymi danymi
            .map(entry => entry.pulse));
        let maxPulse = Math.max(...fullDateRange.map(entry => entry.pulse));
        const diffrencePulse = maxPulse - minPulse;
        minPulse = minPulse - diffrencePulse/accurancy;
        maxPulse = maxPulse + diffrencePulse/accurancy;
        setMinPulse(minPulse);
        setMaxPulse(maxPulse);
        setMinWeight(minWeight);
        setMaxWeight(maxWeight);
        const dx = fullDateRange.map(entry => {
            const weight = ((entry.weight-minWeight)/(maxWeight-minWeight))*100;
            const pulse = ((entry.pulse-minPulse)/(maxPulse-minPulse))*100;
            return {
                ...entry,
                weight: weight,
                pulse: pulse
            };
        });

        setProcessedPlayerStats(dx);
    }, [firstDate, secondDate, playerStats, accurancy]);

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

    const monthName = () => {
        
        const formattedItemDate = firstDate
                    ? firstDate.split('.').reverse().join('-')  // Przekształca "DD.MM.YYYY" na "YYYY-MM-DD"
                    : null;
        const [year, month, day] = formattedItemDate.split('-');
        const date = new Date(year, month - 1, day); 
        return date.toLocaleString('default', { month: 'long' }); 
    };

    const handleFirstDateChange = (date) => {
        setFirstDate(date.toISOString().split('T')[0]);
    };

    const handleSecondDateChange = (date) => {
        setSecondDate(date.toISOString().split('T')[0]);
    };

    const handleSelectChange = (event) => {
        setSelectedFilter(event.target.value);
      };

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
            
            {windowWidth > 550 ?
            <div className={styles.buttonsFrame}>
                <div className={styles.dateFrame}>
                    <div className={styles.noteSection}>
                    <p>Data początkowa: </p>
                        <div className={styles.pickerWrapper}>
                            {/* DatePicker - wybór daty */}
                            <DatePicker
                                selected={firstDate}
                                onChange={handleFirstDateChange}
                                dateFormat="dd.MM.yyyy"
                                className={styles.customDatePicker} // Klasa CSS dla daty
                            />
                        </div>
                    </div>
                    <div className={styles.noteSection}>
                    <p>Data początkowa: </p>
                        <div className={styles.pickerWrapper}>
                            {/* DatePicker - wybór daty */}
                            <DatePicker
                                selected={secondDate}
                                onChange={handleSecondDateChange}
                                dateFormat="dd.MM.yyyy"
                                className={styles.customDatePicker} // Klasa CSS dla daty
                            />
                        </div>
                    </div>
                </div>
                {/* <div className={styles.dateFrame}>
                    <button className={styles.buttonStats} onClick={()=>{changeAccurancy(1)}}>Zwiększ szczegółowość</button>
                    <button className={styles.buttonStats} onClick={()=>{changeAccurancy(-1)}}>Zmniejsz szczegółowość</button>
                </div> */}
                <button className={styles.buttonStats} onClick={()=>{setScrolableChart(!scrolableChart)}}>Przesuwny wykres</button>
                <select className={styles.selectButton} value={selectedFilter} onChange={(e)=>{handleSelectChange(e)}}>
                    <option value="feeling">Samopoczucie</option>
                    <option value="pulse">Tętno</option>
                    <option value="weight">Waga</option>
                    <option value="all">Wszystkie</option>
                </select>
               
                
            </div>
            
            : null}
            <div className={styles.chartSection}>
            {windowWidth > 550 ?
            <div className={!scrolableChart? styles.scrollableChartContainer: null}>
                <LineChart 
                    width={!scrolableChart?windowWidth:processedPlayerStats.length*25} 
                    height={400} 
                    data={processedPlayerStats} 
                    margin={windowWidth > 550 
                        ? { top: 20, right: 10, left: 30, bottom: 40 } 
                        : { top: 20, right: 10, left: 10, bottom: 40 }
                    }
                    >
                    <CartesianGrid strokeDasharray="5 5" />
                    <XAxis dataKey="date" label={{ value: `Data (${monthName()})`, position: 'bottom', offset: 0, dx:!scrolableChart?0:-processedPlayerStats.length*25/3 }} minTickGap={15} tickFormatter={(date) => {
                        const [year, month, day] = date.split('-'); // Rozdzielenie daty na części
                        return `${day}`; // Zwracamy tylko miesiąc i dzień
                    }} />
                    {window.innerWidth > 550 ?
                     
                        <YAxis 
                            label={{ 
                                value: `Tętno/Samopoczucie/Waga[kg]`, 
                                angle: -90, // Obrót o 90 stopni w kierunku przeciwnym do ruchu wskazówek zegara
                                position: 'insideLeft', 
                                offset: -5 ,
                                dy: 100
                            }} 
                            ticks={[0,25,50,75, 100]}  
                            tickFormatter={(value) => {
                                switch(value) {
                                    case 0: return (
                                        `${selectedFilter==='all' || selectedFilter === 'pulse'?(0 * (minPulse - minWeight) + minWeight).toFixed(0):""}
                                        ${selectedFilter==='all' || selectedFilter === 'feeling'?"😢\n":""}` +
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.8 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0` 
                                    );
                                    case 25: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.25 * (minPulse - minWeight) + minWeight).toFixed(0):""}
                                        ${selectedFilter==='all' || selectedFilter === 'feeling'?"🙁\n":""}` +
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.8 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0` 
                                    );
                                    case 50: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.5 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                        ${selectedFilter==='all' || selectedFilter === 'feeling'?"😐\n":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.8 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0`
                                    );
                                    case 75: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.75 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                         ${selectedFilter==='all' || selectedFilter === 'feeling'?"🙂\n":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.8 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0`
                                    );
                                    case 100: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.8 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                        ${selectedFilter==='all' || selectedFilter === 'feeling'?"😊\n":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.8 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0`
                                    );
                                    default: return value;
                                }
                            }}
                            style={{ whiteSpace: 'nowrap', wordWrap: 'normal', overflowWrap: 'normal' }} 
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
                    {selectedFilter === 'all' || selectedFilter === 'pulse' ? <Line type="monotone" dataKey="pulse" stroke={'#77AEFF'} dot={false} name="Tętno" /> : null}
                    {selectedFilter === 'all' || selectedFilter === 'feeling' ? <Line type="monotone" dataKey="feeling" stroke={'#11BBAE'} dot={false} name="Samopoczucie" /> : null}
                    {selectedFilter === 'all' || selectedFilter === 'weight' ? <Line type="monotone" dataKey="weight" stroke={'#FF77AE'} dot={false} name="Waga" /> : null}
                    <Legend verticalAlign="top" height={36} wrapperStyle={{
                        marginLeft: !scrolableChart?0:-processedPlayerStats.length*25/3, // Przesunięcie legendy w lewo o 50px
                    }} />
                </LineChart>
                </div>:
                <div style={{
                    display: 'flex',
                    justifyContent: 'center', // Centrowanie w poziomie
                    textAlign: 'center',
                    flexDirection: 'column',
                }}>
                    <h1>Obróć telefon aby wyświetlić wykresy</h1>
                    <h1>Uwaga! Sekcja w fazie produkcji!</h1>
                    <h2>Mogą wystąpić niespodziewane błędy</h2>
                
                </div>}

                </div> 
        </div>
    );
}
export default PlayerStats;