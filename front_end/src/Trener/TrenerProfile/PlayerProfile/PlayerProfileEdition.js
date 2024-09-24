import styles from './PlayerProfileEdition.module.css';
import React, { useState, useContext } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalContext';

const PlayerProfileEdition = () => {
    const {viewedPlayer, setViewedPlayer, supabase, globalVariable, setGlobalVariable} = useContext(GlobalContext);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 100;
    const years = [];


   
   for (let i = currentYear; i >= oldestYear; i--) {
       years.push(i);
   }

   // Funkcja obsługująca wysłanie formularza
   const handleSubmit = async (e) => {
       e.preventDefault(); // Zapobiega domyślnej akcji wysłania formularza

       setError('');

       const { firstname, lastname, gender, year, weight } = e.target;

       try {
           // Zaktualizowanie danych użytkownika w Supabase
           const { data, error } = await supabase
               .from('zawodnicy')
               .update({
                   imie: firstname.value,
                   nazwisko: lastname.value,
                   plec: gender.value,
                   rocznik: year.value,
                   kategoria_wagowa: weight.value,
               })
               .eq('id', viewedPlayer.id); // Użyj ID użytkownika do aktualizacji

            if (error) {
               console.error('Błąd podczas aktualizacji danych: UPDATE', error);
               throw error;
            }

           // Zaktualizowanie stanu globalnego
           setViewedPlayer({
               ...viewedPlayer,
               imie: firstname.value,
               nazwisko: lastname.value,
               plec: gender.value,
               rocznik: year.value,
               kategoria_wagowa: weight.value,
           });

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
                   <RxHamburgerMenu />
               </div>
               <div className={styles.profilDiv}>
                   <div className={styles.end}>Edycja danych</div>
                   <div className={styles.uppercase}>
                       {viewedPlayer.imie} {viewedPlayer.nazwisko}
                    </div>
               </div>
           </div>
           {/* Body */}
           <div className={styles.userdetails}>
               <div>
                   <h2>Dane użytkownika</h2>
               </div>
               <div>
                   <form onSubmit={handleSubmit}>
                       <label>Imię:</label>
                       <input type="text" name="firstname" defaultValue={viewedPlayer.imie} required />

                       <label>Nazwisko:</label>
                       <input type="text" name="lastname" defaultValue={viewedPlayer.nazwisko} required />

                       <label>Płeć:</label>
                       <select name="gender" defaultValue={viewedPlayer.plec} required>
                           <option value="Mężczyzna">Mężczyzna</option>
                           <option value="Kobieta">Kobieta</option>
                       </select>

                       <label>Rocznik:</label>
                       <select name="year" defaultValue={viewedPlayer.rocznik} required>
                           {years.map(year => (
                               <option key={year} value={year}>{year}</option>
                           ))}
                       </select>

                       <label>Kategoria wagowa:</label>
                       <input type="text" name="weight" defaultValue={viewedPlayer.kategoria_wagowa} required />

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

export default PlayerProfileEdition;
