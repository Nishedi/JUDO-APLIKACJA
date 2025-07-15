import React, { useEffect } from 'react';
import styles from './MotionTreningTest.module.css';

import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import BackButton from '../BackButton';
import { sharedStyles } from '../CommonFunction';
import Multiselect from 'multiselect-react-dropdown';

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

    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
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
    const [warmUp, setWarmUp] = useState('');
    const [coolDown, setCoolDown] = useState('');
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const onSelectPlayer = (selectedList) => {
        setSelectedPlayers(selectedList);
    };
    const onRemovePlayer = (selectedList) => {
        setSelectedPlayers(selectedList);
    };

    const initiatePlayers = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id_trenera', globalVariable.id);

        if (zawodnicy && zawodnicy.length !== 0) {
            setPlayers(zawodnicy.map(zawodnik => { return { name: `${zawodnik.imie} ${zawodnik.nazwisko}`, grupa: zawodnik.grupa, id: zawodnik.id }; }));
            // setFilteredOptions(zawodnicy.map(zawodnik => { return { name: `${zawodnik.imie} ${zawodnik.nazwisko}`, grupa: zawodnik.grupa, id: zawodnik.id }; }));
        }
    };

    useEffect(() => {
        initiatePlayers();
    }, []);

    const handleEditClick = () => {
        navigate('/trener/playerView'); // Przekierowanie do strony edycji profilu
    }



    const partComponents = {
        "Część A": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="Część A" />,
        "Część B": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="Część B" />,
        "Część C": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="Część C" />,
        "EMOM": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="EMOM" />,
        "FOR TIME": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="FOR TIME" />,
        "AMRAP": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="AMRAP" />,
        "OBWÓD": (key) => <Component key={key} selectedPlayers={selectedPlayers} setSelectedExercises={setSelectedExercises} selectedExercises={selectedExercises} name="OBWÓD" />
    };

   

    return (
        <div className = {styles.background}>
        {/* Navbar */}
        <div className={styles.navbar}>
            <div className={styles.toLeft}><BackButton/></div>
                {isEditing ? <div className={styles.tag}>Edytuj aktywność</div> : <div className={styles.tag}>Nowa aktywność motoryczna</div>}
        </div>
        <div className={styles.white_container}>
            <div className={styles.content}>
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
                    </>
                }
                {selectedCategories?.some(
                    item => item.name === "Warm up" && item.value === "Warm up"
                    ) ? 
                    <>
                        <div className={styles.input_container}>
                            Wprowadź treść rozgrzewki:
                            <textarea
                                id="multiline-input"
                                value={warmUp}
                                onChange={(e) => setWarmUp(e.target.value)}
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
                                value={coolDown}
                                onChange={(e) => setCoolDown(e.target.value)}
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