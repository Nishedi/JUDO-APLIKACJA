import { useEffect } from 'react';
import styles from './MotionTreningTest.module.css';
import { addLocale } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import BackButton from '../BackButton';
import { sharedStyles } from '../CommonFunction';
import Multiselect from 'multiselect-react-dropdown';
import { Calendar } from 'primereact/calendar';

    const Component = ({name, selectedPlayers, setSelectedExercises}) => {
        const [exerciseNumber, setExerciseNumber] = useState("");
        const [roundNumber, setRoundNumber] = useState("");
        const [exerciseTime, setExerciseTime] = useState("");
        const [breakTime, setBreakTime] = useState("");
        const [brakeBetweenRounds, setBrakeBetweenRounds] = useState("");
        const [activities, setActivities] = useState([]);
        useEffect(() => {
            setSelectedExercises((prevExercises) =>
                    prevExercises.map((item) =>
                        item.name === name
                            ? { ...item, name: name, roundNumber: roundNumber, exerciseTime: exerciseTime, breakTime: breakTime, brakeBetweenRounds: brakeBetweenRounds, activities: activities }
                            : item 
                    )
                );
        }, [roundNumber, exerciseTime, breakTime, brakeBetweenRounds, activities]);

         useEffect(() => {
            const num = Number(exerciseNumber) || 0;
            setActivities(prev => {
            if (num > prev.length) {
                return [
                ...prev,
                ...Array.from({ length: num - prev.length }, (_, i) => ({
                    number: prev.length + i + 1,
                    activityName: "",
                    repeats: "",
                    weight: "",
                    time: "",
                    rate: ""
                }))
                ];
            } else if (num < prev.length) {
                return prev.slice(0, num).map((item, idx) => ({
                ...item,
                number: idx + 1
                }));
            } else {
                return prev.map((item, idx) => ({
                ...item,
                number: idx + 1
                }));
            }
            });
        }, [exerciseNumber]);

        const handleRemoveActivity = (number) => {
            setActivities(prev => {
            const filtered = prev.filter(item => item.number !== number);
            return filtered.map((item, idx) => ({
                ...item,
                number: idx + 1
            }));
            });
            setExerciseNumber(prev => String(Number(prev) - 1));
        };

        return (
            <div id={name} className={styles.ABC_section}>
                <h2>{name}</h2>
                <div className={styles.activity_container}>
                    <div className={styles.rounds_element}>
                        <label>
                            Liczba ćwiczeń:
                        </label>
                        <input
                            type="number"
                            placeholder='Liczba ćwiczeń'
                            min="0"
                            value={exerciseNumber}
                            onChange={(e) => setExerciseNumber(e.target.value)}
                            className={styles.round_input}
                        />
                    </div>
                    <div className={styles.rounds_element}>
                        <label>
                            Liczba rund:
                        </label>
                        <input
                            type="number"
                            placeholder='Liczba rund'
                            min="0"
                            value={roundNumber}
                            onChange={(e) => setRoundNumber(e.target.value)}
                            className={styles.round_input}
                        />
                    </div>
                    {name === "EMOM" || name === "FOR TIME" || name === "AMRAP" || name==="OBWÓD"?
                        <div className={styles.rounds_element}>
                            <label>
                                Czas ćwiczenia:
                            </label>
                            <input
                                type="number"
                                placeholder='Czas ćwiczenia (sekundy)'
                                value={exerciseTime}
                                onChange={(e) => setExerciseTime(e.target.value)}
                                className={styles.round_input}
                            />
                        </div>:null
                    }
                    {name==="OBWÓD"?
                        <div className={styles.rounds_element}>
                            <label>
                                Czas przerwy:
                            </label>
                            <input
                                type="number"
                                placeholder='Czas przerwy (sekundy)'
                                value={breakTime}
                                onChange={(e) => setBreakTime(e.target.value)}
                                className={styles.round_input}
                            />
                        </div>:null
                    }
                    {name === "OBWÓD" ? 
                    
                        <div className={styles.rounds_element}>
                            <label className={styles.label_with_player}>
                                Przerwa między rundami:
                            </label>
                            <input
                                type="number"
                                placeholder='Czas przerwy między rundami (sekundy)'
                                value={brakeBetweenRounds}
                                onChange={(e) => setBrakeBetweenRounds(e.target.value)}
                                className={styles.round_input}
                            />

                        </div>
                        : null
                    }
                </div>
                {activities.map((activity, i) => (
                    <ActivityPart
                        key={activity.number}
                        number={activity.number}
                        activity={activity}
                        selectedPlayers={selectedPlayers}
                        setActivities={setActivities}
                        onRemove={handleRemoveActivity}
                    />))
                }
            </div>       
        );
    }

     const ActivityPart = ({number, activity, selectedPlayers, setActivities, onRemove}) => {
        return (
            <div id={number} className={styles.activity_container}>
                <div className={styles.acivity_details_container}>
                    <label>Ćwiczenie {number}:</label>
                    <input
                        type="text"
                        placeholder="Nazwa ćwiczenia"
                        value={activity.activityName}
                        onChange={e =>
                            setActivities(prev =>
                            prev.map(item =>
                                item.number === number
                                ? { ...item, activityName: e.target.value }
                                : item
                            )
                            )
                        }
                        className={styles.round_input}
                    />
                </div>
                <div className={styles.acivity_details_container}>
                    <label>Liczba powtórzeń:</label>
                    <input
                        type="number"
                        placeholder="Liczba powtórzeń"
                        value={activity.repeats}
                        onChange={e =>
                            setActivities(prev =>
                            prev.map(item =>
                                item.number === number
                                ? { ...item, repeats: e.target.value }
                                : item
                            )
                            )
                        }
                        className={styles.round_input}
                    />
                </div>
                {selectedPlayers.map(player => (
                    <div key={player.id} className={styles.acivity_details_container}>
                        <label className={styles.label_with_player}>
                        <span className={styles.player_name}>Waga: {player.name}</span>
                        </label>
                        <input
                        type="number"
                        placeholder="Waga (kg)"
                        value={activity.weight?.[player.id] ?? ""}
                        onChange={e =>
                            setActivities(prev =>
                            prev.map(item =>
                                item.number === number
                                ? {
                                    ...item,
                                    weight: {
                                        ...item.weight,
                                        [player.id]: e.target.value
                                    }
                                    }
                                : item
                            )
                            )
                        }
                        className={styles.round_input}
                        />
                    </div>
                    ))}
                <div className={styles.acivity_details_container}>
                    <label> Czas (sekundy):</label>
                    <input
                        type="number"
                        placeholder="Czas (sekundy)"
                        value={activity.time}
                        onChange={e =>
                            setActivities(prev =>
                            prev.map(item =>
                                item.number === number
                                ? { ...item, time: e.target.value }
                                : item
                            )
                            )
                        }
                        className={styles.round_input}
                    />
                </div>
                <div className={styles.acivity_details_container}>
                    <label>Tempo:</label>
                    <input
                        type="number"
                        placeholder="Tempo"
                        value={activity.rate}
                        onChange={e =>
                            setActivities(prev =>
                            prev.map(item =>
                                item.number === number
                                ? { ...item, rate: e.target.value }
                                : item
                            )
                            )
                        }
                        className={styles.round_input}
                    />
                </div>
                <button onClick={() => onRemove(number)} className={styles.remove_btn}>Usuń ćwiczenie</button>
            </div>
            )
    }


const MotionTreningTest = () => {
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
    const { globalVariable, supabase } = useContext(GlobalContext);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [categories] = useState([
        { name: "Warm up", value: "Warm up" },
        { name: "Część A", value: "Czesc A" },
        { name: "Część B", value: "Czesc B" },
        { name: "Część C", value: "Czesc C" },
        { name: "EMOM", value: "EMOM" },
        { name: "FOR TIME", value: "FOR TIME" },
        { name: "AMRAP", value: "AMRAP" },
        { name: "OBWÓD", value: "OBWÓD" },
        { name: "Cool down", value: "Cool down" },
    ]);
    const [dates, setDates] = useState(null);
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
    
    const [selectedCategories, setSelectedCategories] = useState(null);
    const onSelectGroup = (selectedList) => {
        setSelectedCategories(selectedList);
        setSelectedExercises(selectedList.map(item => {
            return { name: item.name};
        }));
    };

    const onRemoveGroup = (selectedList) => {
        setSelectedCategories(selectedList);
        setSelectedExercises(selectedList.map(item => {
            return { name: item.name};
        }));
    };
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const onSelectPlayer = (selectedList) => {
        setSelectedPlayers(selectedList);
    };
    const onRemovePlayer = (selectedList) => {
        setSelectedPlayers(selectedList);
    };

    const handleWarmUpChange = (e) => {
         setSelectedExercises((prevExercises) =>
            prevExercises.map((item) =>
                item.name === "Warm up"
                    ? { ...item, content: e.target.value }
                    : item 
            )
        );
    };

    const handleCoolDownChange = (e) => {  
        setSelectedExercises((prevExercises) =>
            prevExercises.map((item) =>
                item.name === "Cool down"
                    ? { ...item, content: e.target.value }
                    : item
            )
        );
    };

    const initiatePlayers = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id_trenera', globalVariable.id);

        if (zawodnicy && zawodnicy.length !== 0) {
            setPlayers(zawodnicy.map(zawodnik => { return { name: `${zawodnik.imie} ${zawodnik.nazwisko}`, grupa: zawodnik.grupa, id: zawodnik.id }; }));
     }
    };

    useEffect(() => {
        initiatePlayers();
    }, []);

    const partComponents = {
        "Część A": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="Część A" />,
        "Część B": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="Część B" />,
        "Część C": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="Część C" />,
        "EMOM": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="EMOM" />,
        "FOR TIME": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="FOR TIME" />,
        "AMRAP": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="AMRAP" />,
        "OBWÓD": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="OBWÓD" />
    };

    const handleSave = async () => {
        if (selectedPlayers.length === 0) {
            alert("Wybierz zawodników");
            return;
        }
        if (selectedCategories.length === 0) {
            alert("Wybierz kategorię");
            return;
        }
        if (dates === null || dates.length === 0) {
            alert("Wybierz datę i godzinę treningu");
            return;
        }
         for (const athlete of selectedPlayers) {
            for (const date of dates) {
                const exercisesWithSingleWeight = selectedExercises.map(exercise => {
                    if (exercise.activities && Array.isArray(exercise.activities)) {
                        return {
                        ...exercise,
                        activities: exercise.activities.map(act => ({
                            ...act,
                            weight: act.weight?.[athlete.id] ?? ""
                        }))
                        };
                    } else if ('content' in exercise) {
                        // Jeśli jest pole content, kopiujemy je bez zmian
                        return { ...exercise, content: exercise.content };
                    } else {
                        // Opcjonalnie: obsługa innych przypadków (np. pusty obiekt)
                        return { ...exercise };
                    }
                    });
                const activity = {
                    szczegoly: exercisesWithSingleWeight,
                    
                };
                const { data, error } = await supabase
                    .from('aktywności')
                    .insert({
                        id_trenera: globalVariable.id,
                        id_zawodnika: athlete.id,
                        data: getDateString(date),                        
                        czas_rozpoczęcia: getTimeString(date),
                        rodzaj_aktywności: "Motoryczny_test",
                        szczegoly: activity.szczegoly,
                        dodatkowy_rodzaj_aktywności: "inny",
                    });
                if (error) {
                    console.error("Błąd podczas zapisywania treningu:", error);
                    alert("Wystąpił błąd podczas zapisywania treningu. Spróbuj ponownie.");
                }
                else {
                    console.log("Trening zapisany pomyślnie:", data);
                    navigate('/trener/treningi');
                }
            }}
        
    }

    return (
        <div className = {styles.background}>
        {/* Navbar */}
        <div className={styles.navbar}>
            <div className={styles.toLeft}><BackButton/></div>
                {isEditing ? <div className={styles.tag}>Edytuj aktywność</div> : <div className={styles.tag}>Nowa aktywność motoryczna</div>}
        </div>
        <div className={styles.white_container}>
            <div className={styles.content}>
                <button className={styles.edit_button} onClick={handleSave}>Zapisz</button>
                {isEditing===true ? null :
                    <>
                        <div className={styles.input_container}>
                            Wybierz zawodników
                            <Multiselect
                                options={players}
                                selectedValues={selectedPlayers}
                                onSelect={onSelectPlayer}
                                onRemove={onRemovePlayer}
                                displayValue="name"
                                placeholder='Wybierz zawodników'
                                style={{
                                    ...sharedStyles,
                                    searchBox: {
                                        ...sharedStyles.searchBox,
                                        // border: errors.selectedOptions ? '2px solid red' : '1px solid #ccc',
                                        height: 'fit-content' // Dodanie stylu height
                                    }
                                }}
                            />
                            {/* {errors.selectedOptions && <div className={styles.error_message}>{errors.selectedOptions}</div>} */}
                        </div>
                        <div className={styles.input_container}>
                            Wybierz kategorię:
                            <Multiselect
                                options={categories}
                                selectedValues={selectedCategories}
                                onSelect={onSelectGroup}
                                onRemove={onRemoveGroup}
                                displayValue="name"
                                placeholder='Wybierz kategorię'
                                style={{
                                    ...sharedStyles,
                                    searchBox: {
                                        ...sharedStyles.searchBox,
                                        border: false ? '2px solid red' : '1px solid #ccc',
                                        height: 'fit-content' 
                                    }
                                }}
                            />
                            {/* {errors.selectedOptions && <div className={styles.error_message}>{errors.selectedOptions}</div>} */}
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
                                        // border: errors.dates ? '2px solid red' : '1px solid #ccc',
                                        padding: '10px',
                                        borderRadius: '3px',
                                        backgroundColor: '#fff',
                                    }}
                                />
                        
                                                    {/* {errors.dates && <div className={styles.error_message}>{errors.dates}</div>} */}
                            </div>
                    </>
                }
                {selectedCategories?.some(
                    item => item.name === "Warm up" && item.value === "Warm up"
                    ) ? 
                    <>
                        <div className={styles.input_container}>
                            Wprowadź treść rozgrzewki :
                            <textarea
                                id="multiline-input"
                                value={selectedExercises.find(
                                    item => item.name === "Warm up")?.content}
                                onChange={(e) => handleWarmUpChange(e)}
                                rows={5}  
                                className={styles.multiLineInput}
                                placeholder="Wpisz treść rozgrzewki"
                            />
                        </div>
                    </>
                    : null 
                }
                {selectedCategories?.some(
                    item => item.name === "Cool down" && item.value === "Cool down"
                    ) ? 
                    <>
                        <div className={styles.input_container}>
                            Wprowadź treść schłodzenia:
                            <textarea
                                id="multiline-input"
                                value={selectedExercises.find(
                                    item => item.name === "Cool down")?.content}
                                onChange={(e) => handleCoolDownChange(e)}
                                rows={5}  
                                className={styles.multiLineInput}
                                placeholder="Wpisz treść schłodzenia"
                            />
                        </div>
                    </>
                    : null 
                }
                
                {selectedCategories?.map(item =>
                    partComponents[item.name]?.(item.name) ?? null
                )}


            </div>
        </div>
        </div>
    );
}
export default MotionTreningTest;