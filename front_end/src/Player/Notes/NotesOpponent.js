import styles from './NotesOpponent.module.css';
import React, {useContext, useEffect, useState} from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaPlus } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { GlobalContext } from '../../GlobalContext';



// Przykładowa lista przeciwników
const opponents = [
    { name: "Piotr Wysocki", lastMeeting: "10.07.2024", balance: "5 / 1" },
    { name: "Jan Kowalski", lastMeeting: "04.05.2024", balance: "2 / 0" },
    { name: "Bartłomiej Dobrowolski", lastMeeting: "24.01.2023", balance: "1 / 3" },
];

const NotesOpponent = () => {
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

    const { id_watku } = useParams(); // Pobieramy id_watku z URL
    const [notes, setNotes] = useState([]);
    const [threadDetails, setThreadDetails] = useState(null); // Stan do przechowywania szczegółów wątku


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


    const navigate = useNavigate();
    
    const handleEditClick = () => {
        navigate(`/player/addnote`); // Przekierowanie do strony edycji profilu
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                        <RxHamburgerMenu/>
                </div>
                <div className={styles.navbarText}>
                        Notatnik <br/> Przeciwnicy
                </div>
                <div className={styles.navbarButton}>
                    <div className={styles.name}> {globalVariable.imie + " " + globalVariable.nazwisko} </div>
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
                                <div key={note.id_notatki} className={styles.match}>
                                    <p>{new Date(note.data).toLocaleDateString()} r.</p>
                                    <p>{note.tresc}</p>
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
