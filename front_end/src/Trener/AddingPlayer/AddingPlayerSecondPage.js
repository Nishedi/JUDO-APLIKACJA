import { GlobalContext } from '../../GlobalContext';
import React, { useContext, useState} from 'react';
import styles from './AddingPlayer.module.css';
import { createClient } from '@supabase/supabase-js'

const AddingPlayerSecondPage = () => {
    const { newPlayer, globalVariable } = useContext(GlobalContext);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const handleLoginChange = (e) => {
        setLogin(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        console.log(password)
    }
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const checkDataAndCreateNewUser = async () => {
        if (login === "" || password === "" || confirmPassword === "") {
            alert("Wypełnij wszystkie pola");
            return;
        }
        if (password !== confirmPassword) {
            alert("Hasła nie są takie same");
            return;
        }
        const regex = /^[A-Za-z0-9.]*$/;
        if (regex.test(login) === false) {
            alert("Login może zawierać tylko litery i cyfry");
            return;
        }
        if (password.length < 8) {
            alert("Hasło musi mieć conajmniej 8 znaków");
            return;
        }
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}.$/;
        // if (passwordRegex.test(password) === false) {
        //     alert("Hasło musi zawierać conajmniej jedną dużą literę, jedną małą literę i jedną cyfrę");
        //     return;
        // }
        const newUser = {
            "name": newPlayer.name,
            "surname": newPlayer.surname,
            "gender": newPlayer.gender, 
            "weightCategory": newPlayer.weightCategory, 
            "yearOfBirth": newPlayer.yearOfBirth,
            "login": login,
            "password": password
        }
        
        const { data, error } = await supabase
            .from('zawodnicy')
            .insert([
                { 
                    id_trenera: `${globalVariable.id}`,
                    imie: `${newUser.name}`,
                    nazwisko: `${newUser.surname}`,
                    login: `${newUser.login}`,
                    haslo: `${newUser.password}`,
                    kategoria_wagowa: `${newUser.weightCategory}`,
                    rocznik: `${newUser.yearOfBirth}`,
                    plec: `${newUser.gender}`,
                    waga: '74',
                    samopoczucie: '5',
                    stan_treningow: '5/5'

                },
            ])
            .select()
        if(error){
            console.log("Problem podczas dodawania nowego zawodnika");
            console.log(error);
            return;
        }

        if(data[0].id_trenera !== globalVariable.id
            || data[0].imie !== `${newUser.name}`
            || data[0].nazwisko !== `${newUser.surname}`
            || data[0].login !==  `${newUser.login}`
            || data[0].haslo !== `${newUser.password}`
            || data[0].kategoria_wagowa !== `${newUser.weightCategory}`
            || data[0].rocznik != newUser.yearOfBirth
            || data[0].plec != `${newUser.gender}`
            || data[0].waga != 74
            || data[0].samopoczucie != 5
            || data[0].stan_treningow != '5/5'
        ){
            console.log(data);
            alert("Wystąpił błąd, nie udało się dodać zawodnika");
        }
    }
    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                DANE ZAWODNIKA
            </div>
            <div className={styles.content}>
                <div className={styles.inputs}>
                    <div className={styles.input_container}>
                        <div>LOGIN</div>
                        <input type="text" 
                        className={styles.input} 
                        placeholder={'Podaj login'} 
                        value={login} 
                        onChange={handleLoginChange}/>
                    </div>
                    <div className={styles.input_container}>
                        <div>HASŁO</div>
                        <input type="password" 
                        className={styles.input} 
                        placeholder={'Podaj hasło'} 
                        value={password} 
                        onChange={handlePasswordChange} />
                    </div>
                    <div className={styles.input_container}>
                        <div>POWTÓRZ HASŁO</div>
                        <input type="password" 
                        className={styles.input} 
                        placeholder={'Podaj hasło'} 
                        value={confirmPassword} 
                        onChange={handleConfirmPasswordChange} />
                    </div>
                </div>
                <button onClick={checkDataAndCreateNewUser} className={styles.button}>Dalej</button>
            </div>
        </div>
    );
}
export default AddingPlayerSecondPage;