import styles from './AddNote.module.css';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import BackButton from '../../BackButton';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';



const AddNote = () => {
    const {supabase, globalVariable} = useContext(GlobalContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStatus, setActiveStatus] = useState(null);
    const [noteText, setNoteText] = useState('');
    const navigate = useNavigate();

    // Funkcje zmieniające datę i czas
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Funkcja zmieniająca status walki z obsługą odznaczania statusu
    const handleStatusClick = (status) => {
        if (activeStatus === status) {
            setActiveStatus(null); // Jeśli status jest już aktywny, odznacz go
        } else {
            setActiveStatus(status); // W przeciwnym razie zaznacz go
        }
    };
    
    const addNote = async () => {
        const watek = globalVariable.watek
        const { error } = await supabase
        .from('notatki')
        .insert([
          { 
            id_watku: watek.id_watku,
            data: selectedDate,
            wynik: activeStatus,
            tresc: noteText
           },
        ])
        .select()
        if(error){
            console.log('error', error)
            return;
        }
        if (activeStatus === 'wygrana') {
            const { error } = await supabase
                .from('watki_notatki')
                .update({ liczba_wygranych: watek.liczba_wygranych+1 }) 
                .eq('id_watku', watek.id_watku);
            if (error) {
                console.log('error', error);
            }
        }
        if (activeStatus === 'przegrana') {
            const { error } = await supabase
                .from('watki_notatki')
                .update({ liczba_przegranych: watek.liczba_przegranych+1 }) 
                .eq('id_watku', watek.id_watku);
            if (error) {
                console.log('error', error);
            }
        }
        navigate(`/player/notesopponent/${watek.id_watku}`);
    }


    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                    <BackButton />
                </div>
                <div className={styles.navbarText}>
                    Nowa notatka <br/>
                </div>
            </div>

            {/* Główna sekcja */}
            <div className={styles.mainContent}>
                <div className={styles.noteHeader}>
                    {/* Nazwa wątku */}
                    
                </div>

                <div className={styles.noteSection}>
                    <p>Data:</p>
                    <div className={styles.pickerWrapper}>
                        {/* DatePicker - wybór daty */}
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy"
                            className={styles.customDatePicker} // Klasa CSS dla daty
                        />
                    </div>
                </div>

                <div className={styles.noteSection}>
                    <p>Status walki:</p>
                    <div className={styles.fightStatus}>
                        <button
                            className={`${styles.statusButton} ${activeStatus === 'wygrana' ? styles.active : ''}`}
                            onClick={() => handleStatusClick('wygrana')}
                        >
                            wygrana
                        </button>
                        <button
                            className={`${styles.statusButton} ${activeStatus === 'przegrana' ? styles.active : ''}`}
                            onClick={() => handleStatusClick('przegrana')}
                        >
                            przegrana
                        </button>
                    </div>
                </div>

                <div className={styles.noteTextArea}>
                    <textarea 
                        onChange={(e) => setNoteText(e.target.value)} 
                        placeholder="Dodaj notatkę...">
                    </textarea>
                </div>

                <div className={styles.submitButton}>
                    <button onClick={addNote} className={styles.addNoteButton}>Dodaj</button>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
