import styles from './UserProfileEdition.module.css';
import React from 'react';
import { LiaAccessibleIcon } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';


const UserProfileEdition = () => {
// Zmienne stanu przechowujące wartości pól formularza
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');

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
   // Możesz tu dodać kod obsługi, np. wysyłkę danych na serwer
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
                           Twoj profil 
                        </div>
                        <div className={styles.uppercase}>
                           Aleksander Brzeczyszczykiewicz
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
                        <button type="submit">Zapisz</button>
                     </div>
                  </form>
               </div>
            </div>

         </div>
       );
   }
   export default UserProfileEdition;