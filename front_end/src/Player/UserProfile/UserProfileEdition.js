import styles from './UserProfileEdition.module.css';
import React, { useState, useContext } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

const UserProfileEdition = () => {
   const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
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

       if (password !== confirmPassword) {
           setError('Hasła nie są takie same');
           return;
       }

       setError('');

       const { firstname, lastname, login, gender, year, weight } = e.target;

       try {
           // Zaktualizowanie danych użytkownika w Supabase
           const { data, error } = await supabase
               .from('users')
               .update({
                   imie: firstname.value,
                   nazwisko: lastname.value,
                   login: login.value,
                   plec: gender.value,
                   rocznik: year.value,
                   kategoria_wagowa: weight.value,
                   haslo: password // Pamiętaj o bezpiecznym przechowywaniu haseł
               })
               .eq('id', globalVariable.id); // Użyj ID użytkownika do aktualizacji

            if (error) {
               console.error('Błąd podczas aktualizacji danych: UPDATE', error);
               throw error;
            }

           // Zaktualizowanie stanu globalnego
           setGlobalVariable({
               ...globalVariable,
               imie: firstname.value,
               nazwisko: lastname.value,
               login: login.value,
               plec: gender.value,
               rocznik: year.value,
               kategoria_wagowa: weight.value,
           });

           // Zmiana flagi na zakończenie edycji
           navigate('/player/userprofile');
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
                       <input type="text" name="firstname" defaultValue={globalVariable.imie} required />

                       <label>Nazwisko:</label>
                       <input type="text" name="lastname" defaultValue={globalVariable.nazwisko} required />

                       <label>Płeć:</label>
                       <select name="gender" defaultValue={globalVariable.plec} required>
                           <option value="Mężczyzna">Mężczyzna</option>
                           <option value="Kobieta">Kobieta</option>
                       </select>

                       <label>Rocznik:</label>
                       <select name="year" defaultValue={globalVariable.rocznik} required>
                           {years.map(year => (
                               <option key={year} value={year}>{year}</option>
                           ))}
                       </select>

                       <label>Kategoria wagowa:</label>
                       <input type="text" name="weight" defaultValue={globalVariable.kategoria_wagowa} required />

                       <label>Login:</label>
                       <input type="text" name="login" defaultValue={globalVariable.login} required />

                       <label>Hasło:</label>
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

export default UserProfileEdition;
