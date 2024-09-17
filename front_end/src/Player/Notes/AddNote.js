import styles from './AddNote.module.css';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import "react-datepicker/dist/react-datepicker.css";
import { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import { GlobalContext } from '../../GlobalContext';

const AddNote = () => {
    const { globalVariable, supabase } = useContext(GlobalContext);

    // Zmienne przechowujące wybraną datę i czas
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    // Funkcje zmieniające datę i czas
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    // Trzeba dodać nazwę wątku, bo do tej pory 
    // było imię i nazwisko zawodnika


    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                    <RxHamburgerMenu />
                </div>
                <div className={styles.navbarText}>
                    Nowa notatka
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
                        <button className={styles.statusButton}>wygrana</button>
                        <button className={styles.statusButton}>przegrana</button>
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
