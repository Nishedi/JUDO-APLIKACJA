import styles from './Notes.module.css';
import React, { useState, useEffect, useContext }  from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { createClient } from '@supabase/supabase-js';
import { GlobalContext } from '../../GlobalContext';
import Modal from './Modal';

const Notes = () => {
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

    const [threads, setThreads] = useState([]);
    const [newThread, setNewThread] = useState({
        nazwa_watku: '',
        id_zawodnika: globalVariable.id_zawodnika,
        liczba_wygranych: '',
        liczba_przegranych: ''
    });

    const [isModalVisible, setIsModalVisible] = useState(false); // Stan obsługi modalu


    // Pobieranie wątków z Supabase przy montowaniu komponentu
    useEffect(() => {
        const fetchThreads = async () => {
            const { data, error } = await supabase
                .from('watki_notatki') // Używamy tabeli 'watki_notatki'
                .select('*')
                .eq('id_zawodnika', globalVariable.id); // Pobieranie wątków tylko dla aktualnie zalogowanego zawodnika
            if (error) {
                console.error('Błąd podczas pobierania przeciwników USEEFFECT:', error);
            } else {
                setThreads(data);
            }
        };

        fetchThreads();
    }, [globalVariable]);
 

    // Funkcja dodawania nowego wątku
    const handleAddThread = async () => {
        const { nazwa_watku, id_zawodnika, liczba_wygranych, liczba_przegranych } = newThread;
        if (!nazwa_watku) {
            alert('Proszę wypełnić pole z imieniem i nazwiskiem przeciwnika');
            return;
        }
        const { data, error } = await supabase
            .from('watki_notatki')
            .insert([{
                nazwa_watku,
                id_zawodnika: globalVariable.id, // Pobieranie ID zawodnika z globalnego kontekstu
                liczba_wygranych,
                liczba_przegranych
            }]);

        if (error) {
            console.error('Błąd podczas dodawania przeciwnika: HANDLETHREAD ', error);
        } else {
            setThreads([...threads, ...data]);
            setNewThread({ nazwa_watku: '', id_zawodnika: '', liczba_wygranych: '', liczba_przegranych: '' });
            setIsModalVisible(false); // Zamykanie modala po dodaniu wątku
        }
    };


    return (
        <div className={styles.background}>

            {/* Navbar */}
            <div className={styles.navbar}>
                <div className={styles.burger}>
                        <RxHamburgerMenu/>
                </div>
                <div className={styles.navbarText}>
                        Notatnik <br/> Przeciwnicy
                </div>
                <div className={styles.navbarButton}>
                    <button className={styles.addButton} onClick={() => setIsModalVisible(true)}>
                        <AiOutlinePlus/>
                    </button>
                </div>
            </div>

            {/* Wątki */}
            <div className={styles.weeklist}>
                {threads.map((thread, index) => (
                        <div key={index} className={styles.opponentCard}>
                            <div className={styles.opponentInfo}>
                                <div className={styles.opponentName}>{thread.nazwa_watku}</div>
                                <div className={styles.opponentDetails}>
                                    Ostatnie spotkanie: <br />
                                    Bilans: {thread.liczba_wygranych + "/" + thread.liczba_przegranych}
                                </div>
                            </div>
                            <IoIosArrowDown className={styles.arrowIcon} />
                        </div>
                    ))}
            </div>

                    {/* Modal do dodawania wątku */}
            {isModalVisible && (
                <Modal
                    onClose={() => setIsModalVisible(false)}
                    handleAddThread={handleAddThread}
                    newThread={newThread}
                    setNewThread={setNewThread}
                />
            )}
        </div>
    );
};

export default Notes;