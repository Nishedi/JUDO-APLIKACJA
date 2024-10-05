import styles from './AddNote.module.css';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import BackButton from '../../BackButton';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';



const EditNote = () => {
    const {supabase, globalVariable} = useContext(GlobalContext);
    const [selectedDate, setSelectedDate] = useState(globalVariable.notatka.data);
    const [activeStatus, setActiveStatus] = useState(globalVariable.notatka.wynik);
    const [noteText, setNoteText] = useState(globalVariable.notatka.tresc);
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
        const notatka = globalVariable.notatka
        console.log(globalVariable.notatka, globalVariable.watek)
        const { error } = await supabase
        .from('notatki')
        .update([
          { 
            data: selectedDate,
            wynik: activeStatus,
            tresc: noteText
           },
        ])
        .eq('id_notatki', globalVariable.notatka.id_notatki)
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

    const deleteNote = async () => {
        const watek = globalVariable.watek
        console.log(globalVariable.notatka.id_notatki)
        const { error } = await supabase
        .from('notatki')
        .delete()
        .eq('id_notatki', globalVariable.notatka.id_notatki)
        .select()
        if(error){
            console.log('error', error)
            alert('Nie udało się usunąć notatki')
            return;
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
                    Edycja notatki <br/>
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
                        value={noteText}
                        placeholder="Dodaj notatkę...">
                    </textarea>
                </div>

                <div className={styles.submitButton}>
                    <button onClick={deleteNote} className={styles.editNoteButton}>Usuń</button>
                    <button onClick={addNote} className={styles.editNoteButton}>Zatwierdź</button>
                </div>
            </div>
        </div>
    );
};

export default EditNote;
