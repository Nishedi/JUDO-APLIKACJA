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


import 'primereact/resources/themes/saga-blue/theme.css';  // Lub inny motyw
import 'primereact/resources/primereact.min.css';          // Podstawowe style komponentów
import 'primeicons/primeicons.css';                        // Ikony

const AddingActivityFirstPage = () => {
    const navigate = useNavigate();
    const { globalVariable, supabase } = useContext(GlobalContext);
    const [dates, setDates] = useState(null);
    const [time] = useState(() => {
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

    const [options, setOptions] = useState([
        { name: 'Option 1', id: 1 },
        { name: 'Option 2', id: 2 },
        { name: 'Option 3', id: 3 },
        { name: 'Option 4', id: 4 },
        { name: 'Option 5', id: 5 }
    ]);

    const [trenings] = useState([
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

    const onSelect = (selectedList) => {
        setSelectedOptions(selectedList);
    };

    const onRemove = (selectedList) => {
        setSelectedOptions(selectedList);
    };

    const onSelectTrening = (selectedList) => {
        setSelectedTrenings(selectedList);
        setSelectedExercises([]);
    };

    const onRemoveTrening = (selectedList) => {
        setSelectedTrenings(selectedList);
        setSelectedExercises([]);
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
                    exercise: selectedExercises.map(exercise => `${exercise.name}${exercise?.duration ? ':' + exercise.duration + ' min' : ''}${exercise?.repeats ? ':x'+exercise.repeats:''}`).join(','),
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


    const Activity = ({ exercise }) => {
        const [duration, setDuration] = useState(exercise?.duration||'');
        const [repeats, setRepeats] = useState(exercise?.repeats||'');
        // Funkcja do aktualizacji liczby powtórzeń
        const updateExercise = () => {
            if(duration){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.id === exercise.id
                            ? { ...item, duration: duration } // Zaktualizuj tylko czas trwania
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(repeats){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.id === exercise.id
                            ? { ...item, repeats: repeats } // Zaktualizuj tylko liczbę powtórzeń
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
        };
    
        return (
            <div>
                <div>{exercise.name}:{exercise.duration}:{exercise.repeats}</div>
                <div className={styles.exercise_details}>
                    <input
                        type="text"
                        placeholder='Czas trwania'
                        value={duration}
                        onChange={(e)=>setDuration(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder='Liczba powtórzeń'
                        value={repeats||exercise?.repeats}
                        onChange={(e)=>setRepeats(e.target.value)}
                    />
                    <MdOutlineDone onClick={updateExercise} className={styles.add_button}/>
                </div>
            </div>
        );
    };
    

    const addPDF = async (e) => {
        let file = e.target.files[0];
        const suffix =new Date().getDate()+""+new Date().getMonth()+""+new Date().getFullYear()+""+
        new Date().getHours()+""+new Date().getMinutes()+""+ new Date().getSeconds()
        +""+new Date().getMilliseconds();
        const {data, error} = await supabase
        .storage
        .from('treningipdf')
        .upload('trening'+suffix+'.pdf', file);
        if(error){
            console.log(error);
        }
        if (data) {
            setSelectedExercises([{name: 'https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/treningipdf/' + data.path, id: 0}]);
        }
    }

    const addHeaders = () => {
        if(selectedTrenings[0]?.name === 'Biegowy' || selectedTrenings[0]?.name === 'Na macie'){
            const actualListOfActivities = [...selectedExercises];
            let headers = "";
            for(let exercise of actualListOfActivities){
                headers += exercise.name + ": \n";
            }
            setComment(headers);
        }
    }

    return (
        <div className={styles.background}>
                <div className={styles.navbar}>
                    <div className={styles.toLeft}><BackButton/></div>
                    <div>Nowa Aktywność</div>
                </div>
                <div className={styles.white_container}>
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
                                readOnlyInput = {false}
                                className="custom-calendar"
                                style={{ width: '100%' }}
                                locale='pl'
                                dateFormat='dd/mm/yy'
                                showTime 
                                hourFormat="24" 
                                placeholder='Wybierz datę i godzinę'
                                stepMinute={10}
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
                    (<div className={styles.input_container}>
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
                        {selectedExercises.map(exercise => {
                            
                            return <Activity exercise={exercise}/>
                        
                        }
                        )}
                    </div> ): selectedTrenings[0]?.name=== "Motoryczny" ? 
                        (
                            <>
                            <input type="file" onChange={addPDF} accept="application/pdf"/>
                            </> 
                        ) 
                        : null
                    }
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
                    
                    {/* <div className={styles.input_container}>
                        Podaj długość trwania aktywności
                        <Calendar value={time} onChange={(e) => setTime(e.value)} timeOnly />
                    </div> */}
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
                        <button onClick={addHeaders}>Dodaj nagłówki aktywności do komentarza</button>
                    </div>
                    <button onClick={addActivities} className={styles.button}>Dodaj</button>
                </div>
            </div>
        </div>
    );
};

export default AddingActivityFirstPage;
