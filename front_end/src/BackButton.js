import styles from './BackButton.module.css';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import React from 'react';

const BackButton = ({path}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (path) {
            navigate(path);
        } else {
            navigate(-1);
        }
    };

    return (
        <div onClick={handleBack} className={styles.backbutton}>
            <IoMdArrowBack size={30} color="white" />
        </div>
    );
};
export default BackButton;