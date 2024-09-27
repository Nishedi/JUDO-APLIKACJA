import styles from './NotesOpponent.module.css';
import React, {useContext, useEffect, useState} from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import BackButton from '../../BackButton';

const NotesOpponent = () => {
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const { id_watku } = useParams(); // Pobieramy id_watku z URL
    const [notes, setNotes] = useState([]);
    const [threadDetails, setThreadDetails] = useState(null); // Stan do przechowywania szczegółów wątku
    const [expandedNotes, setExpandedNotes] = useState([]); // Dodaj stan do przechowywania ID rozwiniętej notatki


    // Pobieranie notatek z Supabase przy montowaniu komponentu
    useEffect(() => {
        const fetchThreadsDetails = async () => {
           try {
                if (!id_watku) {
                    console.error('id_watku is undefined');
                    return;
                }
                const { data, error } = await supabase
                    .from('watki_notatki') // Tabela 'watki_notatki'
                    .select('*')
                    .eq('id_watku', id_watku) // Filtrujemy na podstawie id_watku
                    .single(); // Oczekujemy pojedynczego wyniku

                if (error) {
                    console.error('Błąd podczas pobierania notatek USEEFFECT:', error);
                } else {
                    setThreadDetails(data); // Zapisz szczegóły wątku w stanie
                }
            } catch (error) {
                console.error('Błąd podczas pobierania notatek w try-catch:', error);
            }
        };

    fetchThreadsDetails();
}, [id_watku]);

useEffect(() => {
    const fetchNotes = async () => {
        try {
            if (!id_watku) {
                console.error('id_watku is undefined');
                return;
            }
            // Pobierz szczegóły wątku
            const { data: threadData, error: threadError } = await supabase
                .from('watki_notatki')
                .select('*')
                .eq('id_watku', id_watku)
                .single();

            if (threadError) {
                console.error('Błąd podczas pobierania wątku:', threadError);
            } else {
                setThreadDetails(threadData);
            }

            // Pobierz notatki
            const { data: notesData, error: notesError } = await supabase
                .from('notatki')
                .select('*')
                .eq('id_watku', id_watku)
                .order('id_notatki', { ascending: false });

            if (notesError) {
                console.error('Błąd podczas pobierania notatek:', notesError);
            } else {
                setNotes(notesData);
            }
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    };

    fetchNotes();
}, [id_watku]);

    const editButton = (note) => {
        setGlobalVariable({ ...globalVariable, watek: threadDetails, notatka: note });
        navigate('/player/editnote');
    };


    const navigate = useNavigate();
    const handleEditClick = () => {
        setGlobalVariable({ ...globalVariable, watek: threadDetails });
        navigate(`/player/addnote`); // Przekierowanie do strony edycji profilu
    };

    const toggleNote = (noteId) => {
        setExpandedNotes((prevExpandedNotes) => {
            if (prevExpandedNotes.includes(noteId)) {
                // Usuń id notatki, jeśli już jest rozwinięta
                return prevExpandedNotes.filter(id => id !== noteId);
            } else {
                // Dodaj id notatki, jeśli nie jest rozwinięta
                return [...prevExpandedNotes, noteId];
            }
        });
    };

    // Funkcja do zmiany wyniku na tekst
    const getWynikText = (wynik) => {
        return wynik === 'wygrana' ? 'wygrana' : wynik === 'przegrana' ? 'przegrana': 'brak danych';
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                        <BackButton path="/player/notes"/>
                </div>
                <div className={styles.navbarText}>
                        Notatnik <br/>
                        {threadDetails ? threadDetails.nazwa_watku : 'Ładowanie...'}
                </div>
                <div className={styles.navbarButton}>
                    <div className={styles.name}>  </div>
                </div>

                
            </div>

                    {/* Główna sekcja */}
            <div className={styles.mainContent}>
                <div className={styles.opponentDetails}>
                <div>
                    <h3>{threadDetails ? threadDetails.nazwa_watku : 'Ładowanie...'}</h3>
                    Bilans: {threadDetails ? threadDetails.liczba_wygranych + "/" + threadDetails.liczba_przegranych : 'Ładowanie...'}
                </div>
                <button onClick={handleEditClick} className={styles.addNoteButton}><FaPlus/></button>
                </div>

                {/* Lista spotkań */}
                <div className={styles.matchList}>
                    {notes.length > 0 ? (
                            notes.map((note) => (
                                <div 
                                    key={note.id_notatki}
                                    className={`${styles.match} ${expandedNotes.includes(note.id_notatki) ? styles.open : ''}`}
                                    onClick={() => toggleNote(note.id_notatki)}
                                >
                                    <div className={styles.matchHeader}>
                                        <p>{new Date(note.data).toLocaleDateString()} r.</p>
                                        
                                        {/* Strzałka zależna od wyniku walki */}
                                        {note.wynik === "wygrana" ? (
                                            <span className={styles.resultEmoji} role="img" aria-label="wygrana">🏆</span> // Emoji pucharu dla wygranej
                                        ) : note.wynik === "przegrana" ? (
                                            <span className={styles.resultEmoji} role="img" aria-label="przegrana">❌</span> // Emoji krzyżyka dla przegranej /> //* Strzałka w dół dla przegranej */}
                                        ) : (
                                            <span>Brak wyniku</span>  //* W razie braku wyniku */}
                                        )}
                                        <button onClick={() => editButton(note)} className={styles.editbutton}>Edytuj</button>

                                    </div>
                                    {expandedNotes.includes(note.id_notatki) && (
                                        <div className={styles.matchDetails}>
                                            <div className={styles.wynik}> Wynik: {getWynikText(note.wynik)} </div>
                                            <div className={styles.noteText}>{note.tresc}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Brak notatek dla tego wątku.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesOpponent;
