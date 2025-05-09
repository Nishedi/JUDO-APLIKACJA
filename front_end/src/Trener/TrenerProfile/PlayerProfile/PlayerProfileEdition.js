import styles from './PlayerProfileEdition.module.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalContext';
import BackButton from '../../../BackButton';

const PlayerProfileEdition = () => {
    const {viewedPlayer, setViewedPlayer, supabase} = useContext(GlobalContext);
    const weightCategories = {
        "Mężczyzna": ["-60kg", "-66kg", "-73kg", "-81kg", "-90kg", "-100kg", "+100kg"],
        "Kobieta": ["-48kg", "-52kg", "-57kg", "-63kg", "-70kg", "-78kg", "+78kg"]
    };
    const groups = [
        { name: "Brak grupy", value: "Brak grupy" },
        { name: "Senior", value: "Senior" },
        { name: "Młodszy senior", value: "Młodszy senior" },
        { name: "Junior", value: "Junior" },
        { name: "Młodzik", value: "Młodzik" },
        { name: "Dzieci", value: "Dzieci" },
    ];

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState();
    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 100;
    const years = [];

    
   
   for (let i = currentYear; i >= oldestYear; i--) {
       years.push(i);
   }

   const handlePassChange = () => {
       navigate('/trener/playerpass');
    }

   // Funkcja obsługująca wysłanie formularza
   const handleSubmit = async (e) => {
       e.preventDefault(); // Zapobiega domyślnej akcji wysłania formularza

       setError('');

       const { firstname, lastname, gender, year, weight } = e.target;

       try {
        const grupa = selectedGroup === "Brak grupy" ? null : selectedGroup;
           // Zaktualizowanie danych użytkownika w Supabase
           const { data, error } = await supabase
               .from('zawodnicy')
               .update({
                   imie: firstname.value,
                   nazwisko: lastname.value,
                   plec: gender.value,
                   rocznik: year.value,
                   kategoria_wagowa: weight.value,
                   grupa: grupa
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
               grupa: grupa
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
                   <BackButton />
               </div>
               <div className={styles.profilDiv}>
                    <div className={styles.end} >
                        Profil zawodnika
                    </div>
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
                       {viewedPlayer.plec === "Mężczyzna" ? (
                            <select name="weight" defaultValue={viewedPlayer.kategoria_wagowa} required>
                            {weightCategories.Mężczyzna.map(weight => (
                                <option key={weight} value={weight}>{weight}</option>
                            ))}
                        </select>
                            ) : (
                            <select name="weight" defaultValue={viewedPlayer.kategoria_wagowa} required>
                                {weightCategories.Kobieta.map(weight => (
                                    <option key={weight} value={weight}>{weight}</option>
                                ))}
                            </select>
                            )
                        } 
                       {error && <p style={{ color: 'red' }}>{error}</p>}
                       <label>Grupa:</label>
                          <select name="group" value={selectedGroup} defaultValue={viewedPlayer?.grupa||"Wybierz grupę zawodnika"} onChange={(e) => setSelectedGroup(e.target.value)} required>

                            {groups.map((group) => (
                                 <option key={group.value} value={group.value}>
                                      {group.value}
                                 </option>
                            ))}
                            </select>
                       <div className={styles.buttoncenter}>
                           <button className={styles.buttonEdit} type="submit">Zapisz</button>
                       </div>
                   </form>
               </div>
           </div>
           <div className={styles.change_password} onClick={handlePassChange}>zmień hasło</div>
       </div>
   );
};

export default PlayerProfileEdition;
