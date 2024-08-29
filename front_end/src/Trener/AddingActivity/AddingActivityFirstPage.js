import styles from './AddingActivity.module.css';
import { locale, addLocale } from 'primereact/api';
import { useState, useContext, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { GlobalContext } from '../../GlobalContext';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'primereact/calendar';

import 'primereact/resources/themes/saga-blue/theme.css';  // Lub inny motyw
import 'primereact/resources/primereact.min.css';          // Podstawowe style komponentów
import 'primeicons/primeicons.css';                        // Ikony

const AddingActivityFirstPage = () => {
    const { globalVariable } = useContext(GlobalContext);
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey);
    const [dates, setDates] = useState(null);
    const [time, setTime] = useState(() => {
        const initialTime = new Date();
        initialTime.setHours(0, 0, 0, 0); // Ustawiamy godziny, minuty, sekundy i milisekundy na 0
        return initialTime;
      });

    const sharedStyles = {
        chips: {
            color: '#000'
        },
        multiselectContainer: {
            color: '#000',
            width: '100%'
        },
        searchBox: {
            border: '1px solid #ccc',
            color: '#000',
            backgroundColor: '#FFF',
            borderRadius: '3px',
            padding: '8px'
        },
        optionContainer: {
            color: 'red',
            background: '#f8f8f8',
            border: '1px solid #ccc'
        },
        option: {
            color: '#000',
            background: '#f8f8f8',
            padding: '5px 10px',
            fontSize: '1rem',
            cursor: 'pointer',
        },
        selectedOption: {
            fontWeight: 'bold'
        }
    };

    // Initialize state using the useState hook
    const [options, setOptions] = useState([
        { name: 'Option 1', id: 1 },
        { name: 'Option 2', id: 2 },
        { name: 'Option 3', id: 3 },
        { name: 'Option 4', id: 4 },
        { name: 'Option 5', id: 5 }
    ]);

    const [trenings, setTrenings] = useState([
        { name: 'Biegowy', id: 1 },
        { name: 'Motoryczny', id: 2 },
        { name: 'Na macie', id: 3 }
    ]);

    // Set Polish locale globally for PrimeReact
    addLocale('pl', {
        firstDayOfWeek: 1,
        dayNames: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
        dayNamesShort: ['nd', 'pn', 'wt', 'śr', 'czw', 'pt', 'sb'],
        dayNamesMin: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
        monthNames: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
        monthNamesShort: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
        today: 'Dziś',
        clear: 'Wyczyść'
    });

    const initiateOptions = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id_trenera', globalVariable.id);

        if (zawodnicy && zawodnicy.length !== 0) {
            setOptions(zawodnicy.map(zawodnik => { return { name: `${zawodnik.imie} ${zawodnik.nazwisko}`, id: zawodnik.id }; }));
        }
    };

    useEffect(() => {
        initiateOptions();
    }, []);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedTrenings, setSelectedTrenings] = useState([]);

    const onSelect = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);
    };

    const onSelectTrening = (selectedList, selectedItem) => {
        setSelectedTrenings(selectedList);
    };

    const onRemoveTrening = (selectedList, removedItem) => {
        setSelectedTrenings(selectedList);
    };

    const getTimeString = () => {
        if (!time) return '';
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                Nowa Aktywność
            </div>
            <div className={styles.content}>
                <div className={styles.input_container}>
                    Wybierz zawodników
                    <Multiselect
                        options={options}
                        selectedValues={selectedOptions}
                        onSelect={onSelect}
                        onRemove={onRemove}
                        displayValue="name"
                        placeholder='Wybierz zawodników'
                        style={sharedStyles}
                    />
                </div>
                <div className={styles.input_container}>
                    <div>Wybierz datę oraz godzinę treningu</div>
                    <div className="card flex justify-content-center">
                        <Calendar
                            value={dates}
                            onChange={(e) => setDates(e.value)}
                            selectionMode="multiple"
                            readOnlyInput
                            className="custom-calendar"
                            style={{ width: '100%' }}
                            locale='pl'
                            dateFormat='dd/mm/yy'
                            showTime 
                            hourFormat="24" 
                            placeholder='Wybierz datę i godzinę'
                        
                        />
                    </div>
                </div>
                <div className={styles.input_container}>
                    Wybierz rodzaj treningu
                    <Multiselect
                        options={trenings}
                        selectedValues={selectedTrenings}
                        onSelect={onSelectTrening}
                        onRemove={onRemoveTrening}
                        displayValue="name"
                        placeholder='Wybierz rodzaj treningu'
                        style={sharedStyles}
                    />
                </div>
                
                {selectedTrenings[0]?.name=== 'Biegowy'  ? console.log("Biegowy") : trenings[0]?.name ==='Na macie' ? console.log("Na macie") : console.log(selectedTrenings[0])}
                <div className={styles.input_container}>
                    Wybierz ćwiczenia
                    <Multiselect
                        options={trenings}
                        selectedValues={selectedTrenings}
                        onSelect={onSelectTrening}
                        onRemove={onRemoveTrening}
                        displayValue="name"
                        placeholder='Wybierz ćwiczenia'
                        style={sharedStyles}
                    />
                </div>
                <div className={styles.input_container}>
                    Podaj długość trwania aktywności
                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly />
                </div>

            </div>
        </div>
    );
};

export default AddingActivityFirstPage;
