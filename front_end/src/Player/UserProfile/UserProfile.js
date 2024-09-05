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
                <div className={styles.profileDetails}>
                <p><strong>Imię:</strong> {globalVariable.firstname}</p>
                <p><strong>Nazwisko:</strong> {globalVariable.lastname}</p>
                <p><strong>Login:</strong> {globalVariable.login}</p>
                <p><strong>Płeć:</strong> {globalVariable.gender}</p>
                <p><strong>Rocznik:</strong> {globalVariable.year}</p>
                <p><strong>Kategoria wagowa:</strong> {globalVariable.weight}</p>
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