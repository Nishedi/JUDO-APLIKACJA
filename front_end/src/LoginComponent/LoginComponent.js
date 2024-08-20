import './LoginComponent.css';
import React, { useState } from 'react';
const LoginComponent = () => {
    const [login, setLogin] = useState("Login");
    const [password, setPassword] = useState("Hasło");

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const tryLogin = () => {
        console.log(login, password);
    }
    return (
        <div className="background">
            <div >
                <div className="allTitle">
                    <p className="mainTitle">Judo tracker</p>
                    <p className="logowanie">LOGOWANIE</p>
                </div>
            </div>
            <div className="test2">
                <div className="inputs-placer">
                    <input onChange={handleLoginChange} className = "custom_input" type="text" placeholder={login} />
                    <input onChange={handlePasswordChange} className = "custom_input" type="password" placeholder={password} />
                </div>
                <div className="buttonPlacement">
                    <button onClick={tryLogin} className="button">Zaloguj</button>
                </div>
            </div>                                 
        </div>
    );
};

export default LoginComponent;