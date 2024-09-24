import styles from './TrenerProfile.module.css';
import React from 'react';
import { LiaAccessibleIcon } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import BackButton from '../../BackButton';

const TrenerProfile = () => {

    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);

    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    const handleEditClick = () => {
        setIsClicked(!isClicked);
        navigate('/trener/profileedition'); // Przekierowanie do strony edycji profilu
    }

    return (
        <div className = {styles.background}>
        {/* Navbar */}
        <div className={styles.navbar}>
                <div className={styles.burger}>
                    <BackButton path="/trener/playerview"/>
                </div>
                <div className={styles.profilDiv}>
                    <div className={styles.end} >
                        Twoj profil
                    </div>
                    <div className={styles.uppercase}>
                    {globalVariable.imie} {globalVariable.nazwisko}
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
                <p>Imię: <strong>{globalVariable.imie}</strong></p>
                <div className={styles.line}></div>

                <p>Nazwisko: <strong>{globalVariable.nazwisko}</strong></p>
                <div className={styles.line}></div>
                
                <p>Login: <strong>{globalVariable.login}</strong></p>
                <div className={styles.line}></div>
            </div>
            <div className={styles.buttoncenter}>
                <button 
                    className={`${styles.buttonUser} ${isClicked ? styles.clicked : ''}`}
                    onClick={handleEditClick}>
                    Edytuj profil
                </button>
            </div>

            </div>
        </div>

        </div>
    );
}
export default TrenerProfile;