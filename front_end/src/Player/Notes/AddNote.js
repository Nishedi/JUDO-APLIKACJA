import styles from './AddNote.module.css';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { GlobalContext } from '../../GlobalContext';
import BackButton from '../../BackButton';

const AddNote = () => {
    const { globalVariable, supabase } = useContext(GlobalContext);

    // Zmienne przechowujące wybraną datę i czas
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    // Zmienna przechowująca aktywny status walki
    const [activeStatus, setActiveStatus] = useState(null);


    // Funkcje zmieniające datę i czas
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    // Funkcja zmieniająca status walki z obsługą odznaczania statusu
    const handleStatusClick = (status) => {
        if (activeStatus === status) {
            setActiveStatus(null); // Jeśli status jest już aktywny, odznacz go
        } else {
            setActiveStatus(status); // W przeciwnym razie zaznacz go
        }
    };
    // Trzeba dodać nazwę wątku, bo do tej pory 
    // było imię i nazwisko zawodnika


    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                    <BackButton />
                </div>
                <div className={styles.navbarText}>
                    Nowa notatka <br/>
                    {}


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
                        {/* DatePicker - wybór czasu */}
                        <DatePicker
                            selected={selectedTime}
                            onChange={handleTimeChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={5} // Minuty co 5 minut
                            timeCaption="Czas"
                            dateFormat="HH:mm"
                            className={styles.customTimePicker} // Klasa CSS dla czasu
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
                    <textarea placeholder="Dodaj notatkę..."></textarea>
                </div>

                <div className={styles.submitButton}>
                    <button className={styles.addNoteButton}>Dodaj</button>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
