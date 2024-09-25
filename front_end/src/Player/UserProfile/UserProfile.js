import styles from './UserProfile.module.css';
import React from 'react';
import { LiaAccessibleIcon } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';
import BackButton from '../../BackButton';

const UserProfile = () => {

    const { globalVariable, setGlobalVariable, supabase } = useContext(GlobalContext);

    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/player/userprofileedition'); // Przekierowanie do strony edycji profilu
    }

    return (
        <div className = {styles.background}>
        {/* Navbar */}
        <div className={styles.navbar}>
                <div className={styles.burger}>
                    <BackButton path="/player/dayview"/>
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

                <p>Płeć: <strong>{globalVariable.plec}</strong></p>
                <div className={styles.line}></div>

                <p>Rocznik: <strong>{globalVariable.rocznik}</strong></p>
                <div className={styles.line}></div>
                
                <p>Kategoria wagowa: <strong>{globalVariable.kategoria_wagowa}</strong></p>

            </div>
            <div className={styles.buttoncenter}>
                <button 
                    className={styles.buttonUser} 
                    onClick={handleEditClick}
                >
                    Edytuj profil
                </button>
            </div>

            </div>
        </div>

        </div>
    );
}
export default UserProfile;