import styles from './UserProfileEdition.module.css';
import React from 'react';
import { LiaAccessibleIcon } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';



const UserProfileEdition = () => {
// Zmienne stanu przechowujące wartości pól formularza'
   const {globalVariable, setGlobalVariable} = useContext(GlobalContext);
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

// Dynamiczne uzyskanie bieżącego roku
   const currentYear = new Date().getFullYear();
   const oldestYear = currentYear - 100;

// Generowanie opcji lat od bieżącego roku do 100 lat wstecz
   const years = [];
   for (let i = currentYear; i >= oldestYear; i--) {
       years.push(i);
   }
   
// Funkcja obsługująca wysłanie formularza
   const handleSubmit = (e) => {
   e.preventDefault(); // Zapobiega domyślnej akcji wysłania formularza

   if (password !== confirmPassword) {
       setError('Hasła nie są takie same');
       return;
   }

   // Jeśli hasła są takie same, wyślij formularz
   setError('');
   alert('Formularz został wysłany');

   // Zaktualizowanie danych użytkownika
   setGlobalVariable({
      ...globalVariable,
      firstName: e.target.firstname.value,
      lastName: e.target.lastname.value,
      login: e.target.login.value,
      gender: e.target.gender.value,
      birthYear: e.target.year.value,
      weightCategory: e.target.weight.value
  });

   // Zmiana flagi na zakończenie edycji
   navigate('/player/userprofile');
}


       return (
         <div className = {styles.background}>
            {/* Navbar */}
            <div className={styles.navbar}>
                  <div className={styles.burger}>
                     <RxHamburgerMenu/>
                  </div>
                  <div className={styles.profilDiv}>
                        <div className={styles.end} >
                           Edycja danych 
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
                     <input type="text" name="firstname" />

                     <label>Nazwisko:</label>
                     <input type="text" name="lastname" />

                     <label>Płeć</label>
                     <select name="gender">
                        <option value="Mężczyzna">Mężczyzna</option>
                        <option value="Kobieta">Kobieta</option>
                     </select>

                     <label>Rocznik:</label>
                     <select name="year">
                        {years.map(year =>
                           <option 
                              key={year} value={year}>{year}
                           </option>
                        )}
                        </select>

                     <label>Kategoria wagowa:</label>
                     <input type="text" name="weight" />

                     <label>Login:</label>
                     <input type="text" name="login" />

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
   }
   export default UserProfileEdition;