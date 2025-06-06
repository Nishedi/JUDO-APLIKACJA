import styles from './UserProfileEdition.module.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import BackButton from '../../BackButton';
import bcrypt from 'bcryptjs';

const UserProfileEdition = () => {
   const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();
   const weightCategories = {
    "Mężczyzna": ["-60kg", "-66kg", "-73kg", "-81kg", "-90kg", "-100kg", "+100kg"],
    "Kobieta": ["-48kg", "-52kg", "-57kg", "-63kg", "-70kg", "-78kg", "+78kg"]
    };
   const currentYear = new Date().getFullYear();
   const oldestYear = currentYear - 100;
   const years = [];

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

       const { firstname, lastname, login, gender, year, weight, phone_number } = e.target;

        try {
            const updates = {};
            if (firstname.value) {
                updates.imie = firstname.value;
            }else{
                alert('Imię jest wymagane');
            }
            if (lastname.value) {
                updates.nazwisko = lastname.value;
            }else{
                alert('Nazwisko jest wymagane');
            }
            if (login.value) {
                updates.login = login.value;
            }else{
                alert('Login jest wymagany');
            }
            if (gender.value) {
                updates.plec = gender.value;
            }
            if (year.value) {  
                updates.rocznik = year.value;
            }
            if (weight.value) {
                updates.kategoria_wagowa = weight.value;
            }
            if (phone_number.value) {
                updates.numer_telefonu = phone_number.value;
            }
        
            // Jeżeli oba pola hasła są wypełnione, zaktualizuj hasło
        if (password === '' && confirmPassword === '') {
            // Jeśli oba pola są puste, nie zmieniaj hasła
            console.log('Hasło nie zostało zmienione, ponieważ oba pola są puste'); 
            }
            
            else if (password && !confirmPassword) {
                alert('Potwierdź hasło');
            // Jeśli tylko `password` jest wypełnione, ale nie `confirmPassword`, ignoruj zmianę hasła
            console.log('Hasło nie zostało zmienione, ponieważ confirmPassword jest puste');
            }
            else if (password !== confirmPassword) {
                alert('Hasła nie są takie same');
                console.log('Hasła nie są takie same');
            }
            else if (password && confirmPassword) {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;
                if (!regex.test(password)) {
                    alert('Hasło powinno zawierać co najmniej jedną dużą literę, jedną małą literę, jedną cyfrę, jeden znak specjalny oraz mieć co najmniej 7 znaków');
                    return;
                }
                updates.haslo = await bcrypt.hash(password, 10); 
                console.log('hasło zostało zaktualizowane', password);
            }
            
        // Jeśli updates nie zawiera hasła, nie aktualizuj hasła w bazie danych
        if (Object.keys(updates).length > 0) {
            const { error } = await supabase
                .from('zawodnicy')
                .update(updates) // Użyj zaktualizowanego obiektu
                .eq('id', globalVariable.id); // Użyj ID użytkownika do aktualizacji
            if (error) {
                if(error.code === '23505'){
                    alert('Login jest zajęty');
                }
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
            plec: gender.value,
            rocznik: year.value,
            kategoria_wagowa: weight.value,
            numer_telefonu: phone_number.value,
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
                          
                       <label>Numer telefonu:</label>
                       <input type="text" name="phone_number" defaultValue={globalVariable.numer_telefonu} required />
                       
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
                       {globalVariable.plec === "Mężczyzna" ? (
                            <select name="weight" defaultValue={globalVariable.kategoria_wagowa} required>
                                {weightCategories.Mężczyzna.map(weight => (
                                    <option key={weight} value={weight}>{weight}</option>
                                ))}
                            </select>
                            ) : (
                            <select name="weight" defaultValue={globalVariable.kategoria_wagowa} required>
                                {weightCategories.Kobieta.map(weight => (
                                    <option key={weight} value={weight}>{weight}</option>
                                ))}
                            </select>
                            )
                        } 
                       <label>Login:</label>
                       <input type="text" name="login" defaultValue={globalVariable.login} required />

                       <label>Nowe hasło:</label>
                       <input 
                           type="password" 
                           name="new-password"
                           value={password}
                           autoComplete='new-password'
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
