import styles from './PlayerProfile.module.css';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalContext';
import BackButton from '../../../BackButton';

const PlayerProfile = () => {
    const {viewedPlayer, setViewedPlayer} = useContext(GlobalContext);
    const navigate = useNavigate();
    const handleEditClick = () => {
        setViewedPlayer({...viewedPlayer});
        navigate('/trener/playerprofileedition'); // Przekierowanie do strony edycji profilu
    }

    return (
        <div className = {styles.background}>
        {/* Navbar */}
        <div className={styles.navbar}>
                <div className={styles.burger}>
                    <BackButton path="/trener/playermonthview/week"/>
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
            <div className={styles.userdetails1}>
                <p>Imię: <strong>{viewedPlayer.imie}</strong></p>
                <div className={styles.line}></div>

                <p>Nazwisko: <strong>{viewedPlayer.nazwisko}</strong></p>
                <div className={styles.line}></div>
                
                <p>Login: <strong>{viewedPlayer.login}</strong></p>
                <div className={styles.line}></div>

                <p>Płeć: <strong>{viewedPlayer.plec}</strong></p>
                <div className={styles.line}></div>

                <p>Rocznik: <strong>{viewedPlayer.rocznik}</strong></p>
                <div className={styles.line}></div>
                
                <p>Kategoria wagowa: <strong>{viewedPlayer.kategoria_wagowa}</strong></p>

            </div>
            <div className={styles.buttoncenter}>
                <button className={styles.buttonUser} onClick={handleEditClick}>
                    Edytuj profil
                </button>
            </div>

            </div>
        </div>

        </div>
    );
}
export default PlayerProfile;