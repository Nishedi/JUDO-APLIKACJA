import styles from "./PlayerStats.module.css";
import Sidebar from "../SideBar";
import { useState, useContext } from "react";
import { GlobalContext } from '../../../GlobalContext';
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import DatePicker from 'react-datepicker';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BackButton from "../../../BackButton";

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
    const [processedPlayerStats2, setProcessedPlayerStats2] = useState([]);
    const [maxWeight, setMaxWeight] = useState(0);
    const [minWeight, setMinWeight] = useState(0);
    const [maxPulse, setMaxPulse] = useState(0);
    const [minPulse, setMinPulse] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [accurancy, setAccurancy] = useState(10);
    const [playerNotDailyStats, setPlayerNotDailyStats] = useState([]);
    const [minKinaza, setMinKinaza] = useState(0);
    const [maxKinaza, setMaxKinaza] = useState(0);
    const [minKwasMlekowy, setMinKwasMlekowy] = useState(0);
    const [maxKwasMlekowy, setMaxKwasMlekowy] = useState(0);
    const [monthChangeLines, setMonthChangeLines] = useState([]);
    const [longActivities, setLongActivities] = useState([]);

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

    const colors = ["red", "blue", "green", "orange", "purple", "pink", "brown", "gray", "cyan", "magenta"];

    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    const getPlayersNotDailyStats = async () => {
        const dates = generateDateArray(firstDate, secondDate);
        let { data, error } = await supabase
            .from('niecodzienne_statystyki')
            .select('*')
            .in('data',dates)
            .eq('id_trenera', globalVariable.id)
            .eq('id_zawodnika', viewedPlayer.id);

        if(error){
            alert("Błąd podczas pobierania danych dotyczących kinazy i kwasu mlekowego");
        }
        if(data){
            setPlayerNotDailyStats(data);
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
    useEffect(() => {
        getPlayerStats();
        getPlayersNotDailyStats();
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
        const fullDateRange2 = [];
        const startDate = new Date(firstDate);
        const endDate = new Date(secondDate);
        const validPulses = data.filter(entry => typeof entry.pulse === 'number');
        const avgPulse = validPulses.reduce((acc, entry) => acc + entry.pulse, 0) / (validPulses.length || 1);
        const validWeights = data.filter(entry => typeof entry.weight === 'number' && entry.weight >= 10);
        const avgWeight = validWeights.reduce((acc, entry) => acc + entry.weight, 0) / (validWeights.length || 1);
        const validFeelings = data.filter(entry => typeof entry.feeling === 'number');
        const avgFeeling = validFeelings.reduce((acc, entry) => acc + entry.feeling, 0) / (validFeelings.length || 1);
        const validKinaza = playerNotDailyStats.filter(entry => typeof entry.kinaza === 'number');
        const avgKinaza = validKinaza.reduce((acc, entry) => acc + entry.kinaza, 0) / (validKinaza.length || 1);
        const validKwasMlekowy = playerNotDailyStats.filter(entry => typeof entry.kwas_mlekowy === 'number');
        const avgKwasMlekowy = validKwasMlekowy.reduce((acc, entry) => acc + entry.kwas_mlekowy, 0) / (validKwasMlekowy.length || 1);

        // Użyj pętli do utworzenia zakresu dat
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split('T')[0];
            const entry = data.find(item => {
                const formattedItemDate = item.date 
                    ? item.date.split('.').reverse().join('-')  // Przekształca "DD.MM.YYYY" na "YYYY-MM-DD"
                    : null;
                return formattedItemDate === formattedDate;
            });
            const entry2 = playerNotDailyStats.find(item => {
                const formattedItemDate = item.data
                    ? item.data.split('.').reverse().join('-')  // Przekształca "DD.MM.YYYY" na "YYYY-MM-DD"
                    : null;
                return formattedItemDate === formattedDate;
            });
            fullDateRange.push({
                date: formattedDate,
                feeling: entry?.feeling ? entry.feeling : avgFeeling,
                pulse: entry?.pulse ? entry.pulse : avgPulse,
                weight: entry?.weight ? entry.weight : avgWeight
            });
            fullDateRange2.push({
                date: formattedDate,
                kinaza: entry2?.kinaza ? entry2.kinaza : avgKinaza,
                kwas_mlekowy: entry2?.kwas_mlekowy ? entry2.kwas_mlekowy : avgKwasMlekowy
            });
            
        }
        let minWeight = Math.min(...fullDateRange
            .filter(entry => entry.weight !== null && entry.weight !== 0) // Pomiń wiersze z brakującymi danymi
            .map(entry => entry.weight));
        let maxWeight = Math.max(...fullDateRange.map(entry => entry.weight));
        const diffrence = maxWeight - minWeight;
        minWeight = minWeight - 2.5;
        maxWeight = maxWeight + 2.5;
        let minPulse = Math.min(...fullDateRange 
            .filter(entry => entry.pulse !== null && entry.pulse !== 0) // Pomiń wiersze z brakującymi danymi
            .map(entry => entry.pulse));
        let maxPulse = Math.max(...fullDateRange.map(entry => entry.pulse));
        const diffrencePulse = maxPulse - minPulse;
        minPulse = minPulse - 10;
        maxPulse = maxPulse + 10;
        let minKinaza = Math.min(...fullDateRange2
            .filter(entry => entry.kinaza !== null && entry.kinaza !== 0) // Pomiń wiersze z brakującymi danymi
            .map(entry => entry.kinaza));
        let maxKinaza = Math.max(...fullDateRange2.map(entry => entry.kinaza));
        const diffrenceKinaza = maxKinaza - minKinaza;
        minKinaza = Math.max(minKinaza - diffrenceKinaza / 10, 0);
        maxKinaza = maxKinaza + diffrenceKinaza/10;
        let minKwasMlekowy = Math.min(...fullDateRange2
            .filter(entry => entry.kwas_mlekowy !== null && entry.kwas_mlekowy !== 0) // Pomiń wiersze z brakującymi danymi
            .map(entry => entry.kwas_mlekowy));
        let maxKwasMlekowy = Math.max(...fullDateRange2.map(entry => entry.kwas_mlekowy));
        const diffrenceKwasMlekowy = maxKwasMlekowy - minKwasMlekowy;
        
        minKwasMlekowy = Math.max(minKwasMlekowy - diffrenceKwasMlekowy / 10, 0);
        maxKwasMlekowy = maxKwasMlekowy + diffrenceKwasMlekowy/10;
        setMinKinaza(minKinaza);
        setMaxKinaza(maxKinaza);
        setMinKwasMlekowy(minKwasMlekowy);
        setMaxKwasMlekowy(maxKwasMlekowy);
        setMinPulse(minPulse);
        setMaxPulse(maxPulse);
        setMinWeight(minWeight);
        setMaxWeight(maxWeight);
        const dx = fullDateRange.map(entry => {
            const weight = ((entry.weight-minWeight)/(maxWeight-minWeight))*100;
            const pulse = ((entry.pulse-minPulse)/(maxPulse-minPulse))*100;
            const kinaza = ((entry.kinaza-minKinaza)/(maxKinaza-minKinaza))*100;
            const kwasMlekowy = ((entry.kwas_mlekowy-minKwasMlekowy)/(maxKwasMlekowy-minKwasMlekowy))*100;

            return {
                ...entry,
                weight: weight,
                pulse: pulse,
                kinaza: kinaza,
                kwas_mlekowy: kwasMlekowy
            };
        });

        const dx2 = fullDateRange2.map(entry => {
            const kinaza = ((entry.kinaza-minKinaza)/(Math.max(maxKinaza-minKinaza,1)))*100;
            const kwasMlekowy = ((entry.kwas_mlekowy-minKwasMlekowy)/(Math.max(maxKwasMlekowy-minKwasMlekowy, 1)))*100;
            
            return {
                ...entry,
                kinaza: kinaza,
                kwas_mlekowy: kwasMlekowy
            };
        });

        setProcessedPlayerStats(dx);
        setProcessedPlayerStats2(dx2);
        const changes = [];
        for (let i = 1; i < dx.length; i++) {
            const prevMonth = new Date(dx[i - 1].date).getMonth();
            const currMonth = new Date(dx[i].date).getMonth();
            if (currMonth !== prevMonth) {
                console.log("zmiana miesiąca", dx[i].date);
                changes.push(dx[i].date);
            }
        }
        setMonthChangeLines(changes);
    }, [firstDate, secondDate, playerStats, accurancy]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const onReportErrorClick = () => {
        navigate('/reporterror');
    }

    const onLogOutClick = () => {
        localStorage.clear();
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

    const exportChartToPDF = () => {
        const input = document.getElementById('chart-container'); // ID kontenera wykresu
    
        html2canvas(input, { scale: 2 }) // Skaluje jakość obrazu
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('landscape', 'mm', 'a4'); // Utworzenie poziomego PDF
                const imgWidth = 297; // A4 width in mm (landscape)
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                const fileName = viewedPlayer.imie +"-"+ viewedPlayer.nazwisko + '-' + firstDate + '-' + secondDate+'.pdf';
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(fileName); // Zapis pliku PDF
            })
            .catch((error) => {
                console.error('Błąd eksportu wykresu do PDF:', error);
            });
    };

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

    const getLongActivities = async () => {

        let { data: zawodnicy, error } = await supabase
            .from('aktywnosci_wielodniowe')
            .select('*')
            .eq('id_zawodnika', viewedPlayer.id);

        if (error) {
            console.error("Błąd podczas pobierania danych zawodnika:", error);
            return;
        }
        if (zawodnicy && zawodnicy.length !== 0) {
            setLongActivities(zawodnicy);
        }

        
    };
    const getPolishMonthName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pl-PL', { month: 'long' });
        };

    useEffect(() => {
        getLongActivities();
    }, [viewedPlayer.id]);

    const Chart = ({selectedFilter}) => {
            return (
                <div id="chart-container" className={!scrolableChart? styles.scrollableChartContainer: styles.x}>
                <div>Legenda</div>
                <LineChart 
                    width={!scrolableChart?windowWidth-50:processedPlayerStats.length*20} 
                    height={400} 
                    data={processedPlayerStats} 
                    margin={windowWidth > 550 
                        ? { top: 20, right: 10, left: 45, bottom: 40 } 
                        : { top: 20, right: 10, left: 10, bottom: 40 }
                    }
                    >
                    <CartesianGrid strokeDasharray="5 5" />
                    {scrolableChart && monthChangeLines.map((date, index) => (
                        <ReferenceLine
                            key={index}
                            x={date}
                            stroke="gray"
                            strokeDasharray="10"
                            label={{
                            value: getPolishMonthName(date),
                            position: 'insideBottomLeft',
                            fill: 'red',
                            }}
                        />
                        ))}
                     {
                        longActivities.map((activity, index) => (
                            <>
                                <ReferenceLine key={index} x={activity.poczatek} stroke={colors[index]} strokeDasharray="10" label={{ value: activity.nazwa, position: 'top', fill: colors[index] }} />
                                <ReferenceLine key={index + longActivities.length} x={activity.koniec} stroke={colors[index]} strokeDasharray="10"  />
                            </>
                        ))
                    }
                   
                    <XAxis 
                        dataKey="date" 
                        type="category" 
                        allowDuplicatedCategory={false}
                        label={{ 
                            value: `Data
                    (${!scrolableChart? monthName(): firstDate.split('-')[2]+"."+firstDate.split('-')[1]+'-'+secondDate.split('-')[2]+"."+secondDate.split('-')[1]})`, 
                            position: 'bottom', 
                            offset: 0, 
                            dx:!scrolableChart?0:-processedPlayerStats.length*25/4 
                        }} 
                        minTickGap={15} 
                        tickFormatter={(date) => {
                            const [year, month, day] = date.split('-'); // Rozdzielenie daty na części
                            return `${day}`; // Zwracamy tylko miesiąc i dzień
                    }} />
                    {window.innerWidth > 550 ?
                     
                        <YAxis 
                            label={{ 
                                value: `Tętno/Samopoczucie/Waga[kg]`, 
                                angle: -90, // Obrót o 90 stopni w kierunku przeciwnym do ruchu wskazówek zegara
                                position: 'insideLeft', 
                                offset: -35 ,
                                dy: 100
                            }} 
                            ticks={[0,25,50,75, 100]}  
                            tickFormatter={(value) => {
                                switch(value) {
                                    case 0: return (
                                        `${selectedFilter==='all' || selectedFilter === 'pulse'?(0 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                        ${selectedFilter==='all' ?"😢\n":""}` +
                                        `${selectedFilter!=='all' && selectedFilter === 'feeling'?"Bardzo źle😢":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0` 
                                    );
                                    case 25: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.25 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                        ${selectedFilter==='all' ?"🙁\n":""}` +
                                        `${selectedFilter!=='all' && selectedFilter === 'feeling'?"Źle 🙁":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.25 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0` 
                                    );
                                    case 50: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.5 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                        ${selectedFilter==='all' ?"😐\n":""}`+
                                        `${selectedFilter!=='all' && selectedFilter === 'feeling'?"Neutralnie 😐":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.5 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0`
                                    );
                                    case 75: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(0.75 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                         ${selectedFilter==='all' ?"🙂\n":""}`+
                                         `${selectedFilter!=='all' && selectedFilter === 'feeling'?"Dobrze🙂":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(0.75 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0`
                                    );
                                    case 100: return (
                                        `${selectedFilter==='all'||selectedFilter === 'pulse'?(1 * (maxPulse - minPulse) + minPulse).toFixed(0):""}
                                         ${selectedFilter==='all' ?"😊\n":""}`+
                                         `${selectedFilter!=='all' && selectedFilter === 'feeling'?"Bardzo dobrze 😊":""}`+
                                        `${selectedFilter==='all' || selectedFilter === 'weight'?(1 * (maxWeight - minWeight) + minWeight).toFixed(1):""}\u00A0`
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
                    {selectedFilter === 'all' || selectedFilter === 'pulse' ? 
                        <Line 
                            type="monotone" 
                            dataKey="pulse" 
                            stroke={'#103476'}
                            strokeWidth={2} // Pogrubienie linii
                            dot={false} 
                            name="Tętno" 
                        />
                        : null
                    }
                    {selectedFilter === 'all' || selectedFilter === 'feeling' ? 
                        <Line 
                            type="monotone" 
                            dataKey="feeling" 
                            stroke={'#E0140E'}
                            strokeWidth={2} // Pogrubienie linii 
                            dot={false} 
                            name="Samopoczucie" 
                        /> 
                        : null
                    }
                    {selectedFilter === 'all' || selectedFilter === 'weight' ? 
                        <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke={'#FFC62E'}
                            strokeWidth={2} // Pogrubienie linii
                            dot={false} 
                            name="Waga"
                        /> 
                        : null
                    }
                    <Legend verticalAlign="top" height={36} wrapperStyle={{
                        marginLeft: !scrolableChart?0:-processedPlayerStats.length*25/4, // Przesunięcie legendy w lewo o 50px
                    }} />
                </LineChart>
                

                {/* Sekcja statystyk niecodziennych */}
                </div>
            )    
    }


    return (
        <div onClick={closeSidebar} className={styles.background}>
            <Sidebar onReportErrorClick={onReportErrorClick} isOpen={isSidebarOpen} onLogOutClick={onLogOutClick} onClose={toggleSidebar} name={globalVariable.imie} surname={globalVariable.nazwisko} onAddActivityClick={onAddActivityClick} onAddPlayerClick={onAddPlayerClick} goToProfile={goToProfile}/>
            <div className={styles.navbar}>
                <div onClick={toggleSidebar}>
                    {/* <RxHamburgerMenu className={styles.burger}/> */}
                    <BackButton/>
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
                    <select className={styles.selectButton} value={selectedFilter} onChange={(e)=>{handleSelectChange(e)}}>
                        <option value="feeling">Samopoczucie</option>
                        <option value="pulse">Tętno</option>
                        <option value="weight">Waga</option>
                        <option value="all">Wszystkie</option>
                    </select> 
                    <button className={styles.buttonStats} 
                        onClick={()=>{setScrolableChart(!scrolableChart); setFirstDate(firstDayOfMonth.toISOString().split('T')[0]); setSecondDate(new Date().toISOString().split('T')[0])}}>
                            {!scrolableChart?"Przesuwny wykres":"Miesięczny wykres"}
                    </button>
                    <button onClick={exportChartToPDF} className={styles.buttonStats}>
                        Eksportuj jako PDF
                    </button>  
                </div>
                {scrolableChart?
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
                        <p>Data końcowa: </p>
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
                    </div>:null
                }
           
            </div>
            
            : null}
            <div className={styles.chartSection}>
            {windowWidth > 550 ?
            <>
                <Chart selectedFilter={selectedFilter}/>
                <Chart selectedFilter={"pulse"}/>
                <Chart selectedFilter={"feeling"}/>
                <Chart selectedFilter={"weight"}/>
                
                <div id="chart-container2" className={!scrolableChart? styles.scrollableChartContainer: styles.x}>
                <LineChart 
                    width={!scrolableChart?windowWidth-50:processedPlayerStats.length*20} 
                    height={400} 
                    data={processedPlayerStats2} 
                    margin={windowWidth > 550 
                        ? { top: 20, right: 10, left: 30, bottom: 40 } 
                        : { top: 20, right: 10, left: 10, bottom: 40 }
                    }
                    >
                    <CartesianGrid strokeDasharray="5 5" />
                    {scrolableChart && monthChangeLines.map((date, index) => (
                        <ReferenceLine
                            key={index}
                            x={date}
                            stroke="gray"
                            strokeDasharray="10"
                            label={{
                            value: getPolishMonthName(date),
                            position: 'insideBottomLeft',
                            fill: 'red',
                            }}
                        />
                        ))}
                    
                    <XAxis dataKey="date" label={{ value: `Data
                    (${!scrolableChart? monthName(): firstDate.split('-')[2]+"."+firstDate.split('-')[1]+'-'+secondDate.split('-')[2]+"."+secondDate.split('-')[1]})`, 
                    position: 'bottom', offset: 0, dx:!scrolableChart?0:-processedPlayerStats.length*25/4 }} minTickGap={15} 
                    tickFormatter={(date) => {
                        const [year, month, day] = date.split('-'); // Rozdzielenie daty na części
                        return `${day}`; // Zwracamy tylko miesiąc i dzień
                    }} />
                    
                    
                    {window.innerWidth > 550 ?
                        
                        <YAxis 
                            label={{ 
                                value: `Kinaza/Kwas Mlekowy`, 
                                angle: -90, // Obrót o 90 stopni w kierunku przeciwnym do ruchu wskazówek zegara
                                position: 'insideLeft', 
                                offset: -5 ,
                                dy: 100
                            }} 
                            ticks={[0,25,50,75, 100]}  
                            tickFormatter={(value) => {
                                switch(value) {
                                    case 0: return (
                                        `${true? (0 * (maxKinaza - minKinaza) + minKinaza).toFixed(0):""}\u00A0
                                        ${true?(0 * (maxKwasMlekowy - minKwasMlekowy) + minKwasMlekowy).toFixed(0) :""}\u00A0` 
                                    );
                                    case 25: return (
                                        `${true? (0.25 * (maxKinaza - minKinaza) + minKinaza).toFixed(0):""}\u00A0
                                        ${true?(0.25 * (maxKwasMlekowy - minKwasMlekowy) + minKwasMlekowy).toFixed(0) :""}\u00A0`
                                    );
                                    case 50: return (
                                        `${true? (0.5 * (maxKinaza - minKinaza) + minKinaza).toFixed(0):""}\u00A0
                                        ${true?(0.5 * (maxKwasMlekowy - minKwasMlekowy) + minKwasMlekowy).toFixed(0) :""}\u00A0`
                                    );
                                    case 75: return (
                                        `${true? (0.75 * (maxKinaza - minKinaza) + minKinaza).toFixed(0):""}\u00A0
                                        ${true?(0.75 * (maxKwasMlekowy - minKwasMlekowy) + minKwasMlekowy).toFixed(0) :""}\u00A0`
                                    );
                                    case 100: return (
                                        `${true ?(1 * (maxKinaza - minKinaza) + minKinaza).toFixed(0):""}\u00A0
                                        ${true?(1 * (maxKwasMlekowy - minKwasMlekowy) + minKwasMlekowy).toFixed(0) :""}\u00A0`
                                    );
                                    default: return value;
                                }
                            }}
                            style={{ whiteSpace: 'nowrap', wordWrap: 'normal', overflowWrap: 'normal' }} 
                        /> : 
                        null
                        }   
                    <Line 
                        type="monotone" 
                        dataKey="kinaza" 
                        stroke={'#103476'}
                        strokeWidth={2} // Pogrubienie linii
                        dot={false} 
                        name="Kinaza" 
                        />
                    <Line 
                        type="monotone" 
                        dataKey="kwas_mlekowy" 
                        stroke={'#E0140E'}
                        strokeWidth={2} // Pogrubienie linii 
                        dot={false} 
                        name="Kwas Mlekowy" 
                    /> 
                    
                    <Legend verticalAlign="top" height={36} wrapperStyle={{
                        marginLeft: !scrolableChart?0:-processedPlayerStats.length*25/4, // Przesunięcie legendy w lewo o 50px
                    }} />
                </LineChart>
                
                </div>
            
            
            </>
            
            
            :
                <div style={{
                    display: 'flex',
                    justifyContent: 'center', // Centrowanie w poziomie
                    textAlign: 'center',
                    flexDirection: 'column',
                }}>
                    <h1>Obróć telefon aby wyświetlić wykresy</h1>
                    <h1>Uwaga! Sekcja w fazie testów!</h1>
                    <h2>Mogą wystąpić niespodziewane błędy</h2>
                    <h3>Generowanie pdf działa tylko dla wykresów nieprzesuwnych</h3>
                
                </div>}

                </div> 
        </div>
    );
}
export default PlayerStats;