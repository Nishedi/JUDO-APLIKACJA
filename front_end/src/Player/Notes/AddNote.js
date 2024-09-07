import styles from './AddNote.module.css';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaPlus } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';
import DatePicker from 'react-datepicker';



const AddNote = () => {
    
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.burger}>
                        <RxHamburgerMenu/>
                </div>
                <div className={styles.navbarText}>
                        Nowa notatka
                </div>
            </div>

                    {/* Główna sekcja */}
            <div className={styles.mainContent}>
                <div class={styles.noteHeader}>
                    Piotr Kopiec
                </div>

                <div class={styles.noteSection}>
                        <p>Data:</p>

                        <input type="date" className={styles.customDatePicker} />
                        <input type="time" className={styles.timePicker} />
                        {/* <DatePicker 
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            className={styles.customDatePicker} 
                        />
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Czas"
                            dateFormat="h:mm aa"
                            className={styles.timePicker} // Klasa CSS dla pickera czasu
                        /> */}
                </div>

                <div class={styles.noteSection}>
                    <p>Status walki:</p>
                    <div class={styles.fightStatus}>
                        <button class={styles.statusButton}>wygrana</button>
                        <button class={styles.statusButton}>przegrana</button>
                    </div>
                </div>

                <div class={styles.noteTextArea}>
                    <textarea placeholder="Dodaj notatkę..."></textarea>
                </div>

                <div class={styles.submitButton}>
                    <button class={styles.addNoteButton}>Dodaj</button>
                </div>
            </div>
        </div>

    );
};

export default AddNote;
