import styles from './PlayerProfile.module.css';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalContext';
import BackButton from '../../../BackButton';

const PlayerProfile = () => {
    const { supabase } = useContext(GlobalContext);
    const {viewedPlayer, setViewedPlayer} = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleEditClick = () => {
        setViewedPlayer({...viewedPlayer});
        navigate('/trener/playerprofileedition'); // Przekierowanie do strony edycji profilu
    }

    const removePlayer = async () => {
        const { error } = await supabase
            .from('zawodnicy')
            .delete()
            .eq('id', viewedPlayer.id);

        if (error) {
            console.error('Error removing player:', error);
        } else {
            setViewedPlayer(null);
            navigate('/trener/playerview');
        }
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

                <p>Numer telefonu: <strong>{viewedPlayer.numer_telefonu}</strong></p>
                <div className={styles.line}></div>
                
                <p>Login: <strong>{viewedPlayer.login}</strong></p>
                <div className={styles.line}></div>

                <p>Płeć: <strong>{viewedPlayer.plec}</strong></p>
                <div className={styles.line}></div>

                <p>Rocznik: <strong>{viewedPlayer.rocznik}</strong></p>
                <div className={styles.line}></div>
                
                <p>Kategoria wagowa: <strong>{viewedPlayer.kategoria_wagowa}</strong></p>
                {viewedPlayer?.grupa && (
                    <div>
                        <div className={styles.line}></div>
                        <p>Grupa: <strong>{viewedPlayer.grupa}</strong></p>
                    </div>
                )}
                    
            </div>
             {isModalOpen && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal_content}>
                        <h2>Czy na pewno chcesz usunąć tego zawodnika?</h2>
                        <div className={styles.modal_buttons}>
                            <button onClick={() => {setIsModalOpen(false); removePlayer() }}>Tak</button>
                            <button onClick={() => setIsModalOpen(false)}>Nie</button>
                        </div>
                    </div>
                </div>    
                )}
            <div className={styles.buttoncenter}>
                <button className={styles.buttonUser} onClick={handleEditClick}>
                    Edytuj profil
                </button>
                <button className={styles.redButton} onClick={()=>setIsModalOpen(true)}>
                    Usuń zawodnika
                </button>
            </div>

            </div>
        </div>

        </div>
    );
}
export default PlayerProfile;