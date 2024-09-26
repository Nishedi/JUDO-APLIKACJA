import styles from './Modal.module.css';
import React from 'react';


const Modal = ({ onClose, handleAddThread, newThread, setNewThread }) => {

    // Funkcja do obsługi zwiększania liczby wygranych
    const handleIncrementWygrane = () => {
        setNewThread({ ...newThread, liczba_wygranych: (newThread.liczba_wygranych || 0) + 1 });
    };

    // Funkcja do obsługi zmniejszania liczby wygranych
    const handleDecrementWygrane = () => {
        setNewThread({ ...newThread, liczba_wygranych: Math.max(0, (newThread.liczba_wygranych || 0) - 1) });
    };

    // Funkcja do obsługi zwiększania liczby przegranych
    const handleIncrementPrzegrane = () => {
        setNewThread({ ...newThread, liczba_przegranych: (newThread.liczba_przegranych || 0) + 1 });
    };

    // Funkcja do obsługi zmniejszania liczby przegranych
    const handleDecrementPrzegrane = () => {
        setNewThread({ ...newThread, liczba_przegranych: Math.max(0, (newThread.liczba_przegranych || 0) - 1) });
    };

    // Funkcja obsługująca dodanie wątku oraz zamknięcie modala
    const handleSaveAndClose = () => {
        handleAddThread();  // Dodaj wątek
        onClose();          // Zamknij modal
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div>
                    <h3>Dodaj nowy wątek przeciwnika</h3>
                    <input
                        type="text"
                        placeholder="Imię i nazwisko przeciwnika"
                        value={newThread.nazwa_watku}
                        onChange={(e) => setNewThread({ ...newThread, nazwa_watku: e.target.value })}
                        className={styles.input}
                    />
                </div>
                <div className={styles.selector}>
                    <label>Wygrane</label>
                    <div className={styles.numberSelector}>
                        <button onClick={handleDecrementWygrane}>-</button>
                        <input
                            type="number"
                            value={newThread.liczba_wygranych || 0}
                            readOnly
                        />
                        <button onClick={handleIncrementWygrane}>+</button>
                    </div>
                </div>
                <div className={styles.selector}>
                    <label>Przegrane</label>
                    <div className={styles.numberSelector}>
                        <button onClick={handleDecrementPrzegrane}>-</button>
                        <input
                            type="number"
                            value={newThread.liczba_przegranych || 0}
                            readOnly
                        />
                        <button onClick={handleIncrementPrzegrane}>+</button>
                    </div>
                </div>
                <div className={styles.modalButtons}>
                    {/* zawsze sie wylacza, nawet jesli podano nieprawidlowe wartosci */}
                    <button onClick={handleSaveAndClose}>Zapisz</button> 
                    <button onClick={onClose}>Anuluj</button>
                </div>
            </div>
        </div>
    );
};
export default Modal;