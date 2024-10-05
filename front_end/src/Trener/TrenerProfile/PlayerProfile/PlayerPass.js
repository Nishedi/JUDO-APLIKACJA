import styles from './PlayerPass.module.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalContext';
import BackButton from '../../../BackButton';

const PlayerPass = () => {
    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
    const {viewedPlayer, setViewedPlayer} = useContext(GlobalContext);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');



   // Funkcja obsługująca wysłanie formularza
   const handleSubmit = async (e) => {
       e.preventDefault(); // Zapobiega domyślnej akcji wysłania formularza

      // Walidacja haseł
      if (password === '' || confirmPassword === '') {
        setError('Oba pola muszą być wypełnione');
        return;
    }

    if (password !== confirmPassword) {
        setError('Hasła nie są takie same');
        return;
    }

    if (password.length < 8) {
        setError('Hasło musi mieć co najmniej 8 znaków');
        return;
    }


       setError('');
       try {
            // Aktualizacja hasła w tabeli `players` na Supabase
            const { data, error: supabaseError } = await supabase
                .from('zawodnicy')
                .update({ haslo: password }) // Zakładamy, że hasło jest przechowywane w kolumnie 'haslo'
                .eq('id', viewedPlayer.id); // Zakładamy, że zawodnik jest identyfikowany przez 'id'

            if (supabaseError) {
                throw new Error(supabaseError.message);
            }

            setSuccess('Hasło zostało zaktualizowane');
            console.log('Hasło zostało zaktualizowane', data);


           // Zmiana flagi na zakończenie edycji
           navigate('/trener/playerprofile');
       } catch (error) {
           console.error('Błąd podczas aktualizacji danych:UP2', error);
           setError('Nie udało się zaktualizować danych. Spróbuj ponownie.');
       }
   };

   return (
       <div className={styles.background}>
           {/* Navbar */}
           <div className={styles.navbar}>
               <div className={styles.burger}>
                   <BackButton />
               </div>
               <div className={styles.profilDiv}>
                    <div className={styles.end} >
                        Zmień hasło zawodnika
                    </div>
                    <div className={styles.uppercase}>
                        {viewedPlayer.imie} {viewedPlayer.nazwisko}
                    </div>
                </div>
           </div>
           {/* Body */}
           <div className={styles.userdetails}>
               <div>
                   <h2>Nowe hasło</h2>
               </div>
               <div>
                   <form onSubmit={handleSubmit}>
                   <label>Nowe hasło:</label>
                       <input 
                           type="password" 
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                       />

                       <label>Potwierdź hasło:</label>
                       <input 
                           type="password" 
                           name="confirmPassword" 
                           value={confirmPassword} 
                           onChange={(e) => setConfirmPassword(e.target.value)} 
                       />
                       {error && <p style={{ color: 'red' }}>{error}</p>}
                       <div className={styles.buttoncenter}>
                           <button className={styles.buttonEdit} type="submit">Zapisz</button>
                       </div>
                   </form>
               </div>
           </div>
       </div>
   );
};

export default PlayerPass;
