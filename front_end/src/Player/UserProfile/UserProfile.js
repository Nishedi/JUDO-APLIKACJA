import styles from './UserProfile.module.css';
import React from 'react';
import { LiaAccessibleIcon } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import { useContext } from 'react';

const UserProfile = () => {

    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);

    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/player/userprofileedition'); // Przekierowanie do strony edycji profilu
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
                    {globalVariable.firstname} {globalVariable.lastname}
                    </div>
                </div>
        </div>
        {/* Body */}
        <div className={styles.userdetails}>
            <div>
                <h2>Dane użytkownika</h2>
            </div>
            <div>
                <div className={styles.userdetails}>
                <p>Imię: {globalVariable.firstname}</p>
                <p>Nazwisko:{globalVariable.lastname}</p>
                <p>Login: {globalVariable.login}</p>
                <p>Płeć: {globalVariable.gender}</p>
                <p>Rocznik: {globalVariable.year}</p>
                <p>Kategoria wagowa:{globalVariable.weight}</p>
            </div>
            <div className={styles.buttoncenter}>
                <button onClick={handleEditClick}>
                    Edytuj profil
                </button>
            </div>

            </div>
        </div>

        </div>
    );
}
export default UserProfile;