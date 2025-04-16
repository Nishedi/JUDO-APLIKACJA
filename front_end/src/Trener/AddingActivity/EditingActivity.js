import styles from './AddingActivity.module.css';
import { addLocale } from 'primereact/api';
import { useState, useContext, useEffect, act } from 'react';
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

const EditingActivity = () => {
    const navigate = useNavigate();
    const { supabase, viewedPlayer, setViewedPlayer } = useContext(GlobalContext);
    const actualDate = new Date();
    actualDate.setDate(viewedPlayer.currentActivity.data.split('.')[0]);
    actualDate.setMonth(viewedPlayer.currentActivity.data.split('.')[1]-1);
    actualDate.setFullYear(viewedPlayer.currentActivity.data.split('.')[2]);
    actualDate.setHours(viewedPlayer.currentActivity.czas_rozpoczęcia.split(':')[0]);
    actualDate.setMinutes(viewedPlayer.currentActivity.czas_rozpoczęcia.split(':')[1]);
    const [dates, setDates] = useState(actualDate);
    const [selectedTrenings, setSelectedTrenings] = useState([{name: viewedPlayer.currentActivity.rodzaj_aktywności, id: 0}]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [isAnotherExercise, setIsAnotherExercise] = useState(false);
    const [comment, setComment] = useState(viewedPlayer.currentActivity.komentarz_trenera);
    const [newActivity, setNewActivity] = useState('');
    const [anotherActivityName, setAnotherActivityName] = useState(viewedPlayer.currentActivity?.zadania);

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

    const [trenings] = useState([
        { name: '🏃‍♂️ Biegowy', id: 1 },
        { name: '🏋️‍♀️ Motoryczny', id: 2 },
        { name: '🥋 Na macie', id: 3 },
        { name: '🧘‍♂️ Fizjoterapia', id: 4},
        { name: '🌀 Inny', id: 5 }
    ]);

    const [exercises, setExercises] = useState([
        { name: 'Bieg ciągły', id: 1 }
    ]);

    useEffect(() => {
        const selectedExercises = viewedPlayer.currentActivity?.szczegoly;
        if(selectedExercises)
            setSelectedExercises(selectedExercises);
        
    }, []);



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
        if (selectedTrenings[0]?.name=== 'Biegowy' || selectedTrenings[0]?.name === 'Na macie') {
            initiateExercises();
        }else{
            setExercises([]);
            setIsAnotherExercise(false);
        }
    }, [selectedTrenings]);

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
        const activity = {
            date: getDateString(dates),
            start_time: getTimeString(dates),
            activity_type: selectedTrenings[0]?.name,
            exercise: selectedExercises.map(exercise => `${exercise.name}${exercise?.duration ? ':' + exercise.duration + ' min.' : ''}${exercise?.repeats ? ':x'+exercise.repeats:''}`).join(','),
            comment: comment,
            details: selectedExercises
        };
        const { data, error } = await supabase
            .from('aktywności')
            .update({
                data: activity.date,
                rodzaj_aktywności: activity.activity_type,
                zadania: activity.exercise,
                czas_rozpoczęcia: activity.start_time,
                komentarz_trenera: activity.comment,
                szczegoly: activity.details
            })
            .eq('id', viewedPlayer.currentActivity.id)
            .select()
        if(error){
            console.log("Problem podczas dodawania nowej aktywności");
            console.log(error);
            return;
        }
        if(data && data.length !== 0){
            setViewedPlayer(prevState => {
                return {
                    ...prevState,
                    currentActivity: data[0]
                }
            });


            navigate('/trener/trainingview');
        };
        
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

    const setAnotherActivity = (e) => {
        setAnotherActivityName(e.target.value);
        setSelectedExercises([{name: e.target.value, id: 0}]);
    }

    const Activity = ({ exercise, index }) => {
        const [duration, setDuration] = useState(exercise?.duration||'');
        const [repeats, setRepeats] = useState(exercise?.repeats||'');
        const [durationSecond, setDurationSecond] = useState(exercise?.durationSecond||'');
        const [goldenScore, setGoldenScore] = useState(exercise?.goldenScore||'');
        // Funkcja do aktualizacji liczby powtórzeń
        const updateExercise = () => {
            if(duration||duration===''){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item, index1) =>
                        index1 === index
                            ? { ...item, duration: duration } // Zaktualizuj tylko czas trwania
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(durationSecond||durationSecond===''){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item, index1) =>
                        index1 === index
                            ? { ...item, durationSecond: durationSecond } // Zaktualizuj tylko czas trwania
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(repeats||repeats===''){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item, index1) =>
                        index1 === index
                            ? { ...item, repeats: repeats } // Zaktualizuj tylko czas trwania
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
            if(goldenScore && selectedTrenings[0]?.name === 'Na macie'){
                setSelectedExercises((prevExercises) =>
                    prevExercises.map((item, index1) =>
                        index1 === index
                            ? { ...item, goldenScore: goldenScore } // Zaktualizuj tylko liczbę powtórzeń
                            : item // Zwróć niezmienione elementy
                    )
                );
            }
        };
    
        return (
            <div>
               <div style={{marginBottom: '5px'}}>{exercise.name}</div>
               <div className={styles.exercise_details} style={selectedTrenings[0].name==="Na macie"? {flexDirection: "column"}:{flexDirection: "row"}}>
                    <div>
                        <input
                            type="number"
                            placeholder='Czas trwania'
                            value={duration}
                            onChange={(e)=>{setDuration(e.target.value)}}
                        />
                        <input
                            type="number"
                            placeholder='Czas trwania w sekundach'
                            value={durationSecond}
                            onChange={(e)=>setDurationSecond(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder='Liczba powtórzeń'
                            value={repeats||exercise?.repeats}
                            onChange={(e)=>setRepeats(e.target.value)}
                            style={selectedTrenings[0].name!=="Na macie"? {width: "100%"}:null}
                        />
                        {selectedTrenings[0]?.name === 'Na macie' ? 
                         <input
                            type="number"
                            placeholder='GS'
                            value={goldenScore||exercise?.goldenScore}
                            onChange={(e)=>setGoldenScore(e.target.value)}
                        />
                         : null}
                    </div>
                    <MdOutlineDone onClick={updateExercise} className={styles.add_button} style={selectedTrenings[0].name==="Na macie"? {width: "100%", margin:'4px'}:{minWidth: '40px'}}/>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.toLeft}><BackButton/></div>
                <div>Edytowanie aktywności</div>
            </div>
            <div className={styles.content}>
                <div className={styles.input_container}>
                    <div>Wybierz datę oraz godzinę treningu</div>
                    <div className="card flex justify-content-center">
                        <Calendar
                            value={dates}
                            onChange={(e) => setDates(e.value)}
                            selectionMode="single"
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
                    {selectedExercises.map((exercise, index) => {
                        return(<Activity index={index} exercise={exercise} />);})}

                </div> ): selectedTrenings[0]?.name=== "Motoryczny" ? 
                    (
                        <>
                        <input type="file" onChange={addPDF} accept="application/pdf"/>
                        </> 
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
                    Podaj czas trwania aktywności
                    <Calendar value={time} onChange={(e) => setTime(e.value)}  
                        stepMinute={5} timeOnly />
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
                </div>
                <button onClick={addActivities} className={styles.button}>Zapisz</button>
            </div>
        </div>
    );
};

export default EditingActivity;
