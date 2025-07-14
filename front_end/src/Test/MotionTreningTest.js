import React, { useEffect } from 'react';
import styles from './MotionTreningTest.module.css';

import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { useContext } from 'react';
import { useState } from 'react';
import BackButton from '../BackButton';
import { sharedStyles } from '../CommonFunction';
import Multiselect from 'multiselect-react-dropdown';

const MotionTreningTest = () => {

    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);

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
    };

    const onRemoveGroup = (selectedList) => {
        setSelectedCategories(selectedList);
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

    const Component = ({name}) => {
        const [roundNumber, setRoundNumber] = useState(1);
        const [exerciseTime, setExerciseTime] = useState(0);
        const [breakTime, setBreakTime] = useState(0);
        const [brakeBetweenRounds, setBrakeBetweenRounds] = useState(0);
        return (
            <div className={styles.ABC_section}>
                <h2>{name}</h2>
                <div className={styles.activity_container}>
                    <div className={styles.rounds_element}>
                        <label>
                            Liczba rund:
                        </label>
                        <input
                            type="number"
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
                                value={brakeBetweenRounds}
                                onChange={(e) => setBrakeBetweenRounds(e.target.value)}
                                className={styles.round_input}
                            />

                        </div>
                        : null
                    }
                </div>
                
                {Array.from({ length: Math.max(0, Number(roundNumber) || 0) }, (_, i) => (
                    <ActivityPart key={i} number={i + 1} />
                ))}

                
            </div>       
        );
    }

    const partComponents = {
        "Część A": (key) => <Component key={key} name="Część A" />,
        "Część B": (key) => <Component key={key} name="Część B" />,
        "Część C": (key) => <Component key={key} name="Część C" />,
        "EMOM": (key) => <Component key={key} name="EMOM" />,
        "FOR TIME": (key) => <Component key={key} name="FOR TIME" />,
        "AMRAP": (key) => <Component key={key} name="AMRAP" />,
        "OBWÓD": (key) => <Component key={key} name="OBWÓD" />
    };

    const ActivityPart = ({number}) => {
        const [activityName, setActivityName] = useState('');
        const [repeats, setRepeats] = useState();
        const [weight, setWeight] = useState();
        const [time, setTime] = useState();
        const [rate, setRate] = useState();
        return (
            <div id={number} className={styles.activity_container}>
                <div className={styles.acivity_details_container}>
                    <label>
                        Ćwiczenie {number}:
                    </label>
                    <input
                        type="text"
                        placeholder='Nazwa ćwiczenia'
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        className={styles.round_input}
                    />
                </div>
                <div className={styles.acivity_details_container}>
                    <label>
                        Liczba powtórzeń:
                    </label>
                    <input
                        type="number"
                        placeholder='Liczba powtórzeń'
                        value={repeats}
                        onChange={(e) => setRepeats(e.target.value)}
                        className={styles.round_input}
                    />
                </div>
                {selectedPlayers.map(player => (
                    <div id={player.id} className={styles.acivity_details_container}>
                        <label className={styles.label_with_player}>
                            <span className={styles.player_name}>Waga: {player.name}</span>
                        </label>
                        <input
                        type="number"
                        placeholder='Waga (kg)'
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={styles.round_input}
                        />
                    </div>
                ))}
                <div className={styles.acivity_details_container}>
                    <label>
                        Czas (sekundy):
                    </label>
                    <input
                        type="number"
                        placeholder='Czas (sekundy)'
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={styles.round_input}
                    />
                </div>
                <div className={styles.acivity_details_container}>
                    <label>
                        Tempo:
                    </label>
                    <input
                        placeholder='Tempo'
                        type="text"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className={styles.round_input}
                    />
                </div>
            </div>
            )
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
                    partComponents[item.name]?.(item.id) ?? null
                )}


            </div>
        </div>
        

        </div>
    );
}
export default MotionTreningTest;