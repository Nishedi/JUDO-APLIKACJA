import styles from './AddingActivity.module.css';
import { locale, addLocale } from 'primereact/api';
import { useState, useContext, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { GlobalContext } from '../../GlobalContext';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'primereact/calendar';
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


import 'primereact/resources/themes/saga-blue/theme.css';  // Lub inny motyw
import 'primereact/resources/primereact.min.css';          // Podstawowe style komponentów
import 'primeicons/primeicons.css';                        // Ikony

const AddingActivityFirstPage = () => {
    const navigate = useNavigate();
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
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedTrenings, setSelectedTrenings] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isAnotherExercise, setIsAnotherExercise] = useState(false);
    const [comment, setComment] = useState('');
    const [newActivity, setNewActivity] = useState('');

    const sharedStyles = {
        chips: {
            color: '#f8f8f8',
            fontSize: '1rem',
            padding: '2px 8px',
            backgroundColor: '#1D61DC',
            margin: '0px',
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
            fontWeight: 'bold',
            fontSize: '15px',
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
        { name: 'Na macie', id: 3 },
        { name: 'Fizjoterapia', id: 4}
    ]);

    const [exercises, setExercises] = useState([
        { name: 'Bieg ciągły', id: 1 }
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

    const initiateExercises = async () => {
            if(selectedTrenings[0]?.name === 'Biegowy' || selectedTrenings[0]?.name === 'Na macie') {
                let { data: cwiczenia, error } = await supabase
                    .from('cwiczenia')
                    .select('*')
                    .eq('rodzaj', selectedTrenings[0]?.name);

                if (cwiczenia && cwiczenia.length !== 0) {
                    const sortedExercises = cwiczenia
                    .map(cwiczenie => {
                        return { name: cwiczenie.cwiczenie, id: cwiczenie.id };
                    })
                    .sort((a, b) => a.name.localeCompare(b.name));
                    sortedExercises.push({ name: 'Inna aktywność', id: 0 });
                    setExercises(sortedExercises);
                }
                if(error){
                    console.log(error);
                }
            }
    };
    

    useEffect(() => {
        initiateOptions();
    }, []);

    useEffect(() => {
        if (selectedTrenings[0]?.name=== 'Biegowy' || selectedTrenings[0]?.name === 'Na macie') {
            initiateExercises();
        }else{
            setExercises([]);
            setIsAnotherExercise(false);
        }
    }, [selectedTrenings]);

    const onSelect = (selectedList, selectedItem) => {
        setSelectedOptions(selectedList);
    };

    const onRemove = (selectedList, removedItem) => {
        setSelectedOptions(selectedList);
    };

    const onSelectTrening = (selectedList, selectedItem) => {
        setSelectedTrenings(selectedList);
        setSelectedExercises([]);
       // initiateExercises();
    };

    const onRemoveTrening = (selectedList, removedItem) => {
        setSelectedTrenings(selectedList);
        setSelectedExercises([]);
        // initiateExercises();
    };

    const onSelectedExercises = (selectedList, selectedItem) => {
        if(selectedItem.id === 0){
            setIsAnotherExercise(true);
        }else{
            setSelectedExercises(selectedList);
        }
    };

    const onRemoveExercises = (selectedList, removedItem) => {
        if(removedItem.id === 0){
            setIsAnotherExercise(true);
        }else{
            setSelectedExercises(selectedList);
        }
    };

    const onCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleNewActivityChange = (e) => {
        setNewActivity(e.target.value);
    };

    const addNewActivityToSelected=()=>{
        const actualListOfActivities = [...selectedExercises];
        actualListOfActivities.push({name: newActivity, id: actualListOfActivities.length});
        setSelectedExercises(actualListOfActivities);
    }

    const addNewActivityToDatabase = async () => {
        const rodzaj1 = selectedTrenings[0]?.name;
        const cwiczenie1 = newActivity;
        if (rodzaj1!== 'Biegowy' && rodzaj1 !== 'Na macie') {
           return;
        };
        const { data, error } = await supabase
            .from('cwiczenia')
            .insert([
                { rodzaj: rodzaj1, cwiczenie: cwiczenie1 },
            ])
            .select()
            if(!data || data.length !== 0 || !error || data?.name!==cwiczenie1 || data?.rodzaj!==rodzaj1){
                // alert('Nie udało się dodać nowego ćwiczenia');
                console.log(data);
            }
    };
    

    const getTimeString = (time) => {
        if (!time) return '';
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const getDateString = (time) => {
        if (!time) return '';
        const day = time.getDate().toString().padStart(2, '0');
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        return `${day}.${month}.${year}`;
      };

    

    const addActivities = async () => {
        for (const athlete of selectedOptions) {
            for (const date of dates) {
                const activity = {
                    id_trainer: globalVariable.id,
                    id_athlete: athlete.id,
                    date: getDateString(date),
                    start_time: getTimeString(date),
                    duration: getTimeString(time),
                    activity_type: selectedTrenings[0]?.name,
                    exercise: selectedExercises.map(exercise => exercise.name).join(','),
                    comment: comment
                };
                const { data, error } = await supabase
                    .from('aktywności')
                    .insert([
                        { 
                            id_trenera: activity.id_trainer, 
                            id_zawodnika: activity.id_athlete,
                            data: activity.date,
                            czas_trwania: activity.duration,
                            rodzaj_aktywności: activity.activity_type,
                            zadania: activity.exercise,
                            czas_rozpoczęcia: activity.start_time,
                            komentarz_trenera: activity.comment
                        },
                    ])
                    .select()
                if(error){
                    console.log("Problem podczas dodawania nowej aktywności");
                    console.log(error);
                    return;
                }
                if(data && data.length !== 0){
                    navigate('/trener/playerView');
                };
            }
        }
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
                        singleSelect={true}
                    />
                </div>
                
                {selectedTrenings[0]?.name=== 'Biegowy' || selectedTrenings[0]?.name === 'Na macie' ? 
                <div className={styles.input_container}>
                    Wybierz ćwiczenia
                    <Multiselect
                        options={exercises}
                        selectedValues={selectedExercises}
                        onSelect={onSelectedExercises}
                        onRemove={onRemoveExercises}
                        displayValue="name"
                        placeholder='Wybierz ćwiczenia'
                        style={sharedStyles}
                    />
                </div> : null}
                {isAnotherExercise ? 
                <div className={styles.input_container}>
                    <div>Nowa aktywność</div>
                    <input type="text" 
                    className={styles.input} 
                    placeholder={'Podaj nową aktywność'} 
                    value={newActivity} 
                    onChange={handleNewActivityChange}/>
                    <div className={styles.buttons}>
                        <AiOutlinePlus className={styles.add_button} onClick={addNewActivityToDatabase}/>
                        <MdOutlineDone className={styles.add_button} onClick={addNewActivityToSelected}/>
                    </div>
                </div>
                :null}
                
                <div className={styles.input_container}>
                    Podaj długość trwania aktywności
                    <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly />
                </div>
                <div className={styles.input_container}>
                    <div>Komentarz</div>
                    <textarea
                        id="multiline-input"
                        value={comment}
                        onChange={onCommentChange}
                        rows={5}  // Ustaw liczbę widocznych wierszy
                        className={styles.multiLineInput}
                        placeholder="Wpisz komentarz"
                    />
                </div>
            </div>
            <button onClick={addActivities} className={styles.button}>Dalej</button>
        </div>
    );
};

export default AddingActivityFirstPage;