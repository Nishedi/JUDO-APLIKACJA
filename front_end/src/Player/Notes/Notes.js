import styles from './Notes.module.css';
import React, { useState, useEffect, useContext }  from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { GlobalContext } from '../../GlobalContext';
import Modal from './Modal';
import BackButton from '../../BackButton';

const Notes = () => {
    const { globalVariable, supabase } = useContext(GlobalContext);
    const navigate = useNavigate(); // Hook do nawigacji
    const [threads, setThreads] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newThread, setNewThread] = useState({
        nazwa_watku: '',
        id_zawodnika: globalVariable.id_zawodnika,
        liczba_wygranych: 0,
        liczba_przegranych: 0
    });
    const [isModalVisible, setIsModalVisible] = useState(false); // Stan obsługi modalu

    // Pobieranie wątków z Supabase przy montowaniu komponentu
    useEffect(() => {
        const fetchThreads = async () => {
            const { data, error } = await supabase
                .from('watki_notatki') // Używamy tabeli 'watki_notatki'
                .select('*')
                .eq('id_zawodnika', globalVariable.id)
                .order('nazwa_watku', { ascending: true });; 
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
        const { nazwa_watku, liczba_wygranych, liczba_przegranych } = newThread;
        if (!nazwa_watku) {
            alert('Proszę wypełnić pole z nazwą wątku');
            return;
        }
        const { data, error } = await supabase
            .from('watki_notatki')
            .insert([{
                id_zawodnika: globalVariable.id,
                nazwa_watku: nazwa_watku,
                liczba_wygranych: liczba_wygranych,
                liczba_przegranych: liczba_przegranych,
                ostatnia_aktualizacja: new Date()
            }]).select();

        if (error) {
            console.error('Błąd podczas dodawania przeciwnika: HANDLETHREAD ', error);
        } else {
            setThreads([data[0],...threads]);
            setNewThread({ nazwa_watku: '', id_zawodnika: '', liczba_wygranych: 0, liczba_przegranych: 0});
            setIsModalVisible(false); // Zamykanie modala po dodaniu wątku
        }
    };

    const handleThreadClick = (id_watku) => {
        navigate(`/player/notesopponent/${id_watku}`); // Przekierowanie do strony z notatkami o przeciwniku
    };

    return (
        <div className={styles.background}>

            {/* Navbar */}
            <div className={styles.navbar}>
                <div className={styles.burger}>
                        <BackButton path="/player/dayview"/>
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
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Szukaj wątku..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>


            {/* Wątki */}
            <div className={styles.threadList}>
                {threads
                .filter(thread =>
                    thread.nazwa_watku.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .sort((a, b) => {
                    const dateA = new Date(a.ostatnia_aktualizacja);
                    const dateB = new Date(b.ostatnia_aktualizacja);
                
                    if (dateA > dateB) return -1;
                    if (dateA < dateB) return 1;
                
                    return a.nazwa_watku.localeCompare(b.nazwa_watku);
                  })
                .map((thread, index) => (
                        <div
                            key={index} 
                            className={styles.opponentCard}
                            onClick={() => handleThreadClick(thread.id_watku)}>
                            <div className={styles.opponentInfo}>
                                <div className={styles.opponentName}>
                                    {thread.nazwa_watku}
                                </div>
                                <div className={styles.opponentDetails}>
                                    Bilans: {thread.liczba_wygranych + "/" + thread.liczba_przegranych}
                                </div>
                            </div>
                            <div className={styles.dateandarrow}>

                                {thread?.ostatnia_aktualizacja && (
                                    <div className={styles.opponentDetails}>
                                        Ost. akt.: {new Date(thread.ostatnia_aktualizacja).toLocaleDateString()}
                                    </div>
                                )}
                                <IoIosArrowDown className={styles.arrowIcon} />
                            </div>
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
