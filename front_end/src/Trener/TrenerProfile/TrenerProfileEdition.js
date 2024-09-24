import styles from './TrenerProfileEdition.module.css';
import React, { useState, useContext } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import BackButton from '../../BackButton';

const TrenerProfileEdition = () => {
   const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const currentYear = new Date().getFullYear();
   const oldestYear = currentYear - 100;
   const years = [];

   const [isClicked, setIsClicked] = useState(false);

   const handleClick = () => {
         setIsClicked(!isClicked);
    };

   
   for (let i = currentYear; i >= oldestYear; i--) {
       years.push(i);
   }

   // Funkcja obsługująca wysłanie formularza
   const handleSubmit = async (e) => {
       e.preventDefault(); // Zapobiega domyślnej akcji wysłania formularza

       // Sprawdzenie, czy pola haseł są zgodne (jeśli oba są wypełnione)
    if (password && confirmPassword && password !== confirmPassword) {
        setError('Hasła nie są takie same');
        return;
    }

       setError('');

       const { firstname, lastname, login} = e.target;

       try {
            const updates = {};
            if (firstname.value) {
                updates.imie = firstname.value;
            }
            if (lastname.value) {
                updates.nazwisko = lastname.value;
            }
            if (login.value) {
                updates.login = login.value;
            }
           
           
            // Jeżeli oba pola hasła są wypełnione, zaktualizuj hasło
           if (password === '' && confirmPassword === '') {
            // Jeśli oba pola są puste, nie zmieniaj hasła
            console.log('Hasło nie zostało zmienione, ponieważ oba pola są puste'); 
            }
            
            else if (password && !confirmPassword) {
            // Jeśli tylko `password` jest wypełnione, ale nie `confirmPassword`, ignoruj zmianę hasła
            console.log('Hasło nie zostało zmienione, ponieważ confirmPassword jest puste');
            }
            else if (password && confirmPassword) {
                updates.haslo = password; 
                console.log('hasło zostało zaktualizowane', password);
            }
            

        console.log('updates', updates);



          // Jeśli updates nie zawiera hasła, nie aktualizuj hasła w bazie danych
        if (Object.keys(updates).length > 0) {
            const { data, error } = await supabase
                .from('trenerzy')
                .update(updates) // Użyj zaktualizowanego obiektu
                .eq('id', globalVariable.id); // Użyj ID użytkownika do aktualizacji

            if (error) {
                console.error('Błąd podczas aktualizacji danych: UPDATE', error);
                throw error;
            }
        }

           // Zaktualizowanie stanu globalnego
           setGlobalVariable({
               ...globalVariable,
               imie: firstname.value,
               nazwisko: lastname.value,
               login: login.value,
           });

           // Zmiana flagi na zakończenie edycji
           navigate('/trener/userprofile');
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
                           <button 
                                onClick={handleClick} 
                                className={`${styles.buttonEdit} ${isClicked ? styles.clicked : ''}`}
                                type="submit">Zapisz</button>
                       </div>
                   </form>
               </div>
           </div>
       </div>
   );
};

export default TrenerProfileEdition;
