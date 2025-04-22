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

const AddingActivityFirstPage = () => {
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const { globalVariable, supabase } = useContext(GlobalContext);
    const [dates, setDates] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedTrenings, setSelectedTrenings] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isAnotherExercise, setIsAnotherExercise] = useState(false);
    const [comment, setComment] = useState('');
    const [newActivity, setNewActivity] = useState('');
    const [anotherActivityName, setAnotherActivityName] = useState('');
    const [smsContent, setSmsContent] = useState('');
    const [errors, setErrors] = useState({}); // New state to track errors

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
        { name: 'Fizjoterapia', id: 4},
        { name: 'Inny', id: 5 }
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

    useEffect(() => {
        selectedExercises.map(exercise => {
            if (exercise.name === 'Inna aktywność') {
                setIsAnotherExercise(true);
            }
        });  
    }, [selectedExercises]);

    const onCommentChange = (e) => {
        setComment(e.target.value);
    };

    const onSmsContentChange = (e) => {
        setSmsContent(e.target.value);
    };

    const handleNewActivityChange = (e) => {
        setNewActivity(e.target.value);
    };

    const addNewActivityToSelected=()=>{
        setIsAnotherExercise(false);
        setAnotherActivityName('');
        const actualListOfActivities = selectedExercises.filter(exercise => exercise.name !== 'Inna aktywność');
        
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

      const validateForm = () => {
        const newErrors = {};
        if (selectedOptions.length === 0) {
            newErrors.selectedOptions = 'Proszę wybrać zawodników';
        }
        if (!dates) {
            newErrors.dates = 'Proszę wybrać datę treningu';
        }
        if (selectedTrenings.length === 0) {
            newErrors.selectedTrenings = 'Proszę wybrać rodzaj treningu';
        }
        if (selectedExercises.length === 0 && (selectedTrenings[0]?.name !== 'Motoryczny'&&selectedTrenings[0]?.name !== 'Fizjoterapia')) {
            newErrors.selectedExercises = 'Proszę wybrać ćwiczenia';
        }
        return newErrors;
    };

    const endAdding = () => {
        navigate('/trener/playerView');
    };
    

    const addActivities = async () => {
        if (isUploading) return;
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const selectedType = document.getElementById("typeSelect")?.value; // Pobierz wybrany typ (kolor)
        let datesToSms = [];
        let exercises=[];
        dates.map(exercise => {
            datesToSms.push(exercise);
        });
        selectedExercises.map(exercise => {
            exercises.push(exercise.name);
        });
        
        setSmsContent("Dodano nowe aktywności\n" +
            dates
                .sort((a, b) => new Date(a) - new Date(b)) // 📅 Sortowanie dat rosnąco
                .map(date => {
                    const formattedDate = new Date(date);
                    const day = formattedDate.getDate().toString().padStart(2, '0');
                    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
                    const year = formattedDate.getFullYear();
                    const hours = formattedDate.getHours().toString().padStart(2, '0');
                    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
                   
                    return `${day}.${month}.${year} ${hours}:${minutes}: ${exercises.join(", ")}`;
                }).join("\n")
        );
        
        

        for (const athlete of selectedOptions) {
            for (const date of dates) {
                const exercises2 = [];
                for (const exercise of selectedExercises) {
                    exercises2.push({
                        name: exercise.name,
                        duration: exercise.duration,
                        repeats: exercise.repeats,
                        durationSecond: exercise.durationSecond,
                        goldenScore: exercise.goldenScore,
                        goldenScoreMinutes: exercise.goldenScoreMinutes,
                        meters: exercise.meters
                    });
                }
                const activity = {
                    id_trainer: globalVariable.id,
                    id_athlete: athlete.id,
                    date: getDateString(date),
                    start_time: getTimeString(date),
                    activity_type: selectedTrenings[0]?.name,
                    exercise: selectedExercises.map(exercise => `${exercise.name}${exercise?.duration ? ':' + exercise.duration + ' min.' : ''}${exercise?.repeats ? ':x'+exercise.repeats:''}`).join(','),
                    exercises_details: exercises2,
                    comment: comment,
                    additional_activity_type: selectedType // Nowe pole!
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
                            dodatkowy_rodzaj_aktywności: activity.additional_activity_type, // Wstaw do bazy
                            zadania: activity.exercise,
                            czas_rozpoczęcia: activity.start_time,
                            komentarz_trenera: activity.comment,
                            szczegoly: activity.exercises_details
                        },
                    ])
                    .select()
                if(error){
                    console.log("Problem podczas dodawania nowej aktywności");
                    console.log(error);
                    return;
                }
            }
        }
    };



    const Activity = ({ exercise }) => {
        const [duration, setDuration] = useState(exercise?.duration||'');
        const [repeats, setRepeats] = useState(exercise?.repeats||'');
        const [meters, setMeters] = useState(exercise?.meters||'');
        const [durationSeconds, setDurationSeconds] = useState(exercise?.durationSecond||'');
        const [goldenScore, setGoldenScore] = useState(exercise?.goldenScore||'');
        const [goldenScoreMinutes, setGoldenScoreMinutes] = useState(exercise?.goldenScoreMinutes||'');
        

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
            if(durationSeconds){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.id === exercise.id
                            ? { ...item, durationSecond: durationSeconds } // Zaktualizuj tylko liczbę powtórzeń
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(meters && selectedTrenings[0]?.name === 'Biegowy'){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.id === exercise.id
                            ? { ...item, meters: meters } // Zaktualizuj tylko liczbę powtórzeń
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(goldenScore && selectedTrenings[0]?.name === 'Na macie'){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.id === exercise.id
                            ? { ...item, goldenScore: goldenScore } // Zaktualizuj tylko liczbę powtórzeń
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(goldenScoreMinutes && selectedTrenings[0]?.name === 'Na macie'){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.id === exercise.id
                            ? { ...item, goldenScoreMinutes: goldenScoreMinutes } // Zaktualizuj tylko liczbę powtórzeń
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
        };
    
        return (
            <div>
                <div style={{marginBottom: '5px'}}>{exercise.name}</div>
                <div className={styles.exercise_details} style={true? {flexDirection: "column"}:{flexDirection: "row"}}>
                    <div>
                        <input
                            type="number"
                            placeholder='Minuty'
                            value={duration}
                            onChange={(e)=>setDuration(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder='Sekundy'
                            value={durationSeconds}
                            onChange={(e)=>setDurationSeconds(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder='Liczba powtórzeń'
                            value={repeats}
                            onChange={(e)=>setRepeats(e.target.value)}
                            style={selectedTrenings[0].name!=="Na macie"? {width: "100%"}:null}
                        />
                        {selectedTrenings[0]?.name === 'Biegowy' ? 
                            <input
                            type="number"
                            placeholder='Metry'
                            value={meters}
                            onChange={(e)=>setMeters(e.target.value)}
                            style={selectedTrenings[0].name!=="Na macie"? {width: "100%"}:null}
                        />:null
                            }
                        {selectedTrenings[0]?.name === 'Na macie' ? 
                        <div>
                            <input
                            type="number"
                            placeholder='GS [min]'
                            value={goldenScoreMinutes}
                            onChange={(e)=>setGoldenScoreMinutes(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder='GS [s]'
                            value={goldenScore}
                            onChange={(e)=>setGoldenScore(e.target.value)}
                        />
                        </div>
                         : null}
                    </div>
                    <MdOutlineDone onClick={updateExercise} className={styles.add_button} style={true? {width: "100%", margin:'4px'}:{minWidth: '40px'}}/>
                </div>
            </div>
        );
    };
    

    const addPDF = async (e) => {
        setIsUploading(true);
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
        setIsUploading(false);
    }

    const setAnotherActivity = (e) => {
        setAnotherActivityName(e.target.value);
        setSelectedExercises([{name: e.target.value, id: 0}]);
    }

    const addHeaders = () => {
        if(selectedTrenings[0]?.name === 'Biegowy' || selectedTrenings[0]?.name === 'Na macie'){
            const actualListOfActivities = [...selectedExercises];
            let headers = "";
            for(let exercise of actualListOfActivities){
                headers += exercise.name + ": \n";
            }
            setComment(comment+'\n'+headers);   
        }
    }

    return (
        <div className={styles.background}>
                <div className={styles.navbar}>
                    <div className={styles.toLeft}><BackButton/></div>
                    <div>Nowa aktywność</div>
                </div>
                <div className={styles.white_container}>
                    {errors.general && (
                        <div className={styles.error_message}>{errors.general}</div>
                    )}
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
                                style={{
                                    ...sharedStyles,
                                    searchBox: {
                                        ...sharedStyles.searchBox,
                                        border: errors.selectedOptions ? '2px solid red' : '1px solid #ccc',
                                        height: 'fit-content' // Dodanie stylu height
                                    }
                                }}
                            />
                            {errors.selectedOptions && <div className={styles.error_message}>{errors.selectedOptions}</div>}
                        </div>

                        <div className={styles.input_container}>
                            <div>Wybierz datę oraz godzinę treningu</div>
                            <Calendar
                                value={dates}
                                onChange={(e) => setDates(e.value)}
                                selectionMode="multiple"
                                readOnlyInput={false}
                                className="custom-calendar"
                                locale='pl'
                                dateFormat='dd/mm/yy'
                                showTime 
                                hourFormat="24" 
                                placeholder='Wybierz datę i godzinę'
                                stepMinute={10}
                                inputStyle={{
                                    border: 'none',  // Removes the inner border
                                    boxShadow: 'none',
                                    outline: 'none',
                                }}
                                style={{
                                    width: '100%',
                                    border: errors.dates ? '2px solid red' : '1px solid #ccc',
                                    padding: '10px',
                                    borderRadius: '3px',
                                    backgroundColor: '#fff',
                                }}
                            />

                            {errors.dates && <div className={styles.error_message}>{errors.dates}</div>}
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
                                singleSelect={true}
                                style={{
                                    width: '100%',
                                    ...sharedStyles,
                                    searchBox: {
                                        ...sharedStyles.searchBox,
                                        border: errors.selectedTrenings ? '2px solid red' : '1px solid #ccc'
                                    }
                                }}
                            />
                            {errors.selectedTrenings && <div className={styles.error_message}>{errors.selectedTrenings}</div>}
                        </div>
                        
                        <div className={styles.input_container}>
                            Wybierz typ    
                            <select id="typeSelect" className={styles.select}>
                                <option value="inny"> Domyślny</option>
                                <option value="taktyczny">🔵 Taktyczny</option>
                                <option value="motoryczny">🔴 Motoryczny</option>
                                <option value="mentalny">🟢 Mentalny</option>
                            </select>
                        </div>

                        {selectedTrenings[0]?.name=== 'Biegowy' || selectedTrenings[0]?.name === 'Na macie' ? (
                            
                           
                        <div className={styles.input_container}>
                            Wybierz ćwiczenia
                            <MultiSelectDropdown options={exercises} selectedOptions={selectedExercises} setSelectedOptions={setSelectedExercises}/>
                                {selectedExercises.map(exercise => <Activity exercise={exercise}/>)}
                                {errors.selectedExercises && <div className={styles.error_message}>{errors.selectedExercises}</div>}
                            </div>
                        ) : selectedTrenings[0]?.name=== "Motoryczny" ? 
                            (
                                <div className={styles.input_container}>
                                <input className={styles.pickPDF} type="file" onChange={addPDF} accept="application/pdf"/>
                                </div> 
                            ) 
                            : selectedTrenings[0]?.name=== "Inny" ? (
                                <div className={styles.input_container}>
                                    <input 
                                        className={styles.input} 
                                        type="text"
                                        placeholder='Podaj nazwę aktywności'
                                        value={anotherActivityName}
                                        onChange={(e)=>setAnotherActivity(e)}
                                        />
                                </div>
                            )
                            : null
                        }
                        {isAnotherExercise ? 
                        <div className={styles.input_container}>
                            <div>Nowa aktywność</div>
                            <input 
                                type="text" 
                                className={styles.input} 
                                placeholder={'Podaj nową aktywność'} 
                                value={newActivity} 
                                onChange={handleNewActivityChange}
                            />
                            <div className={styles.buttons}>
                                <AiOutlinePlus className={styles.add_button} onClick={addNewActivityToDatabase}/>
                                <MdOutlineDone className={styles.add_button} onClick={addNewActivityToSelected}/>
                            </div>
                        </div>
                        :null}
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
                             {selectedTrenings[0]?.name=== 'Biegowy' || selectedTrenings[0]?.name === 'Na macie' ? 
                                <button onClick={addHeaders}>Dodaj aktywności do komentarza</button>
                                :
                                null
                            }
                        </div>
                        <button onClick={addActivities} className={styles.button} disabled={isUploading}>
                            {isUploading ? 'Przesyłanie pliku...' : 'Dodaj'}
                        </button>
                        <textarea
                                id="multiline-input"
                                value={smsContent}
                                onChange={onSmsContentChange}
                                rows={5}  // Ustaw liczbę widocznych wierszy
                                className={styles.multiLineInput}
                                placeholder="Edytuj wiadomość sms"
                            />
                        
                        <button onClick={sendSMS } className={styles.button} >
                            Wyślij SMS
                        </button>
                        <button onClick={endAdding } className={styles.button} >
                            Zakończ
                        </button>
                </div>
            </div>
        </div>
    );
};

export default AddingActivityFirstPage;
