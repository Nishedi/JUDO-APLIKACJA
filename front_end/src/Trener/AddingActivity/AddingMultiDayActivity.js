import styles from './AddingActivity.module.css';
import { addLocale } from 'primereact/api';
import { useState, useContext, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { GlobalContext } from '../../GlobalContext';
import { Calendar } from 'primereact/calendar';
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import BackButton from '../../BackButton';
import MultiSelectDropdown from './MultiSelectDropdown';

import 'primereact/resources/themes/saga-blue/theme.css';  // Lub inny motyw
import 'primereact/resources/primereact.min.css';          // Podstawowe style komponentów
import 'primeicons/primeicons.css';                        // Ikony

// NAZWA AKTYWNOSCI W RODZAJ_AKTYWNOSCI

const AddingMultiDayActivity = () => {
    const navigate = useNavigate();
    const { supabase, globalVariable } = useContext(GlobalContext);

    const [activityName, setActivityName] = useState('');
    const [activityType, setActivityType] = useState('inne');
    const [selectedAthletes, setSelectedAthletes] = useState([]);
    const [athleteOptions, setAthleteOptions] = useState([]);
    const [dateRange, setDateRange] = useState(null); // [start, end]
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});

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

    // SMS
    const selectedOptions = selectedAthletes;
    const [smsContent, setSmsContent] = useState('');
    const [dates, setDates] = useState(null);
    const [sms, setSms] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    
    const onSmsContentChange = (e) => {
        setSmsContent(e.target.value);
    };
    const [selectedExercises, setSelectedExercises] = useState([]);
    
    async function sendSMS() {
        const phoneNumbers = [];
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('numer_telefonu')
            .in('id', selectedOptions.map(option => option.id));
        if (zawodnicy && zawodnicy.length !== 0) {
            phoneNumbers.push(zawodnicy.map(zawodnik => zawodnik.numer_telefonu));
        }
        
        else{
            console.log("Brak zawodników");
            alert("Nie można wysłać smsa, ponieważ nie wybrano zawodników");
            return
        }
        const phoneQuery = phoneNumbers.flat().join(',');

        const params = {
            from: 'judotracker',
            to: phoneQuery,
            msg: smsContent,
            test: '0'
        };
    
        try {
            const response = await fetch('https://judotracker-backend.netlify.app/.netlify/functions/api/send-sms', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Odpowiedź z backendu:', data); // Tutaj zobaczysz zwrócone parametry
    
            return data;
        } catch (error) {
            console.error('Błąd przy wysyłaniu SMS:', error);
        }
    }

    const saveSMS = () => {
        if(!dates || dates.length === 0) return;
        setSms(prevSmses => {
            let newSmses = [...(prevSmses || [])]; // Zachowujemy poprzednie wartości
            let exercises = selectedExercises.map(exercise => exercise.name);
    
            dates.forEach(date => {
                let sms = {
                    date: date,
                    allexercises: exercises
                };
                newSmses.push(sms);
            });
            setIsSaved(true);
            return newSmses;
        });
    };

    const loadSMS = () => {
        if (sms && sms.length === 0) return;
       
        const mergedSmses = sms.reduce((acc, curr) => {
            const existingSms = acc.find(item => 
                item.date.getDate() === curr.date.getDate() &&
                item.date.getMonth() === curr.date.getMonth() &&
                item.date.getFullYear() === curr.date.getFullYear() &&
                item.date.getHours() === curr.date.getHours() &&
                item.date.getMinutes() === curr.date.getMinutes()
            );
            if (existingSms) {
                // Jeśli już mamy tę datę, dodajemy nowe ćwiczenia (bez duplikatów)
                existingSms.allexercises = [...new Set([...existingSms.allexercises, ...curr.allexercises])];
            } else {
                // Jeśli nie ma jeszcze tej daty, dodajemy nowy wpis
                acc.push({ ...curr });
            }
    
            return acc;
        }, []);
        setSms(mergedSmses);
        console.log(mergedSmses);
        if (!isSaved) {
            dates.forEach(date => {
                const existingSms = mergedSmses.find(sms =>
                    date.getDate() === sms.date.getDate() &&
                    date.getMonth() === sms.date.getMonth() &&
                    date.getFullYear() === sms.date.getFullYear() &&
                    date.getHours() === sms.date.getHours() &&
                    date.getMinutes() === sms.date.getMinutes()
                );
        
                if (existingSms) {
                   existingSms.allexercises = [...new Set([...existingSms.allexercises, ...selectedExercises.map(exercise => exercise.name)])];
                } else {
                    mergedSmses.push({
                        date: date, // Konwersja na format ISO dla porównywania
                        allexercises: selectedExercises.map(exercise => exercise.name)
                    });
                }
            });
        }
        setSmsContent("Dodano nowe aktywności\n" +
            mergedSmses
                .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sortowanie według daty
                .map(sms => {
                    const date = new Date(sms.date); // Konwersja na obiekt Date
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
        
                    return `${day}.${month}.${year} ${hours}:${minutes}: ${sms.allexercises.join(", ")}`;
                }).join("\n")
        );
        
        
    };
    

    const clearSMS = () => {
        setSms([]);
    };


    useEffect(() => {
        const fetchAthletes = async () => {
            const { data, error } = await supabase
                .from('zawodnicy')
                .select('*')
                .eq('id_trenera', globalVariable.id);

            if (data) {
                const formatted = data.map(z => ({
                    name: `${z.imie} ${z.nazwisko}`,
                    id: z.id
                }));
                setAthleteOptions(formatted);
            } else {
                console.error(error);
            }
        };

        fetchAthletes();
    }, [supabase, globalVariable.id]);

    const validate = () => {
        const newErrors = {};
        if (!activityName.trim()) newErrors.activityName = 'Podaj nazwę aktywności';
        if (!dateRange || !dateRange[0] || !dateRange[1]) newErrors.dateRange = 'Wybierz zakres dat';
        if (selectedAthletes.length === 0) newErrors.selectedAthletes = 'Wybierz zawodników';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        console.log('Zapisuję aktywność...');

        for (const athlete of selectedAthletes) {
            const { error } = await supabase
                .from('aktywnosci_wielodniowe')
                .insert({
                    id_trenera: globalVariable.id,
                    id_zawodnika: athlete.id,
                    rodzaj_aktywnosci: activityType,
                    nazwa: activityName,
                    komentarz: comment,
                    poczatek: toLocalDateString(dateRange[0]),
                    koniec: toLocalDateString(dateRange[1]),
                });

            if (error) {
                console.error('Błąd zapisu aktywności:', error);
                alert('Błąd podczas zapisu. Sprawdź konsolę.');
                return;
            }
        }

        alert('Aktywność dodana!');
        navigate('/trener/playerView');
    };

    const getDateString = (time) => {
        if (!time) return '';
        const day = time.getDate().toString().padStart(2, '0');
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const toLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    

    useEffect(() => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            const start = new Date(dateRange[0]);
            const end = new Date(dateRange[1]);
            const dateList = [];
    
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dateList.push(new Date(d));
            }
    
            setDates(dateList);
        }
    }, [dateRange]);
    
    useEffect(() => {
        if (activityName.trim()) {
            setSelectedExercises([{ name: activityName.trim() }]);
        }
    }, [activityName]);
    
    const endAdding = () => {
        navigate('/trener/playerView');
    };    

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.toLeft}><BackButton /></div>
                <div style={{textAlign: 'center'}}>Nowa aktywność <br/> wielodniowa</div>
            </div>

            <div className={styles.white_container}>
                <div className={styles.content}>
                <div className={styles.input_container}>
                        <label>Typ aktywności</label>
                        <select
                            className={styles.select}
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value)}
                        >
                            <option value="oboz">🏕️ Obóz</option>
                            <option value="zawody">🏆 Zawody</option>
                            <option value="kontuzja">🩹 Kontuzja</option>
                            <option value="inne">❓ Inne</option>
                        </select>
                    </div>

                    <div className={styles.input_container}>
                        <label>Nazwa aktywności</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                        />
                        {errors.activityName && <div className={styles.error_message}>{errors.activityName}</div>}
                    </div>

                    <div className={styles.input_container}>
                        <label>Zawodnicy</label>
                        <Multiselect
                            options={athleteOptions}
                            selectedValues={selectedAthletes}
                            onSelect={setSelectedAthletes}
                            onRemove={setSelectedAthletes}
                            displayValue="name"
                            placeholder="Wybierz zawodników"
                            style={{
                                searchBox: {
                                    border: errors.selectedAthletes ? '2px solid red' : '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                }
                            }}
                        />
                        {errors.selectedAthletes && <div className={styles.error_message}>{errors.selectedAthletes}</div>}
                    </div>

                    <div className={styles.input_container}>
                        <label>Zakres dat (od - do)</label>
                        <Calendar
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            selectionMode="range"
                            readOnlyInput={false}
                            showIcon
                            locale="pl"
                            dateFormat="dd/mm/yy"
                            placeholder="Wybierz daty"
                            style={{ width: '100%' }}
                        />
                        {console.log(dateRange)}
                        {errors.dateRange && <div className={styles.error_message}>{errors.dateRange}</div>}
                    </div>

                    <div className={styles.input_container}>
                        <label>Komentarz</label>
                        <textarea
                            className={styles.multiLineInput}
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Wpisz komentarz"
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label>SMS</label>
                        <textarea
                            id="multiline-input"
                            value={smsContent}
                            onChange={onSmsContentChange}
                            rows={5}  // Ustaw liczbę widocznych wierszy
                            className={styles.multiLineInput}
                            placeholder="Wpisz wiadomość sms"
                        />
                    </div>
                <button onClick={sendSMS } className={styles.button} >
                    Wyślij SMS
                </button>
                    <button onClick={handleSave} className={styles.button}>
                        Zapisz aktywność
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddingMultiDayActivity;