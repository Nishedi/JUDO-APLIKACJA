import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import React from 'react';

const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const path = location.pathname;
        // Sprawdzenie roli użytkownika na podstawie ścieżki
        if (path.startsWith('/trener')) {
            navigate('/trener/playerview'); // Cofnij do widoku trenera
        } else if (path.startsWith('/player')) {
            navigate('/player/dayview'); // Cofnij do widoku zawodnika
        } else {
            navigate(-1); // W innym przypadku cofnięcie o jedną stronę
        }
    };

    return (
        <div onClick={handleBack} style={{ cursor: 'pointer' }}>
            <IoMdArrowBack size={30} color="white" />
        </div>
    );
};
export default BackButton;