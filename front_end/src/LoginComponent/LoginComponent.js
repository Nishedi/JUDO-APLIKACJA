import './LoginComponent.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { FaUser } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js'

const LoginComponent = () => {
    const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const navigate = useNavigate();
    const [login, setLogin] = useState("Login");
    const [password, setPassword] = useState("Hasło");
    const [isLogged, setIsLogged] = useState(null);

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
        setIsLogged(null);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setIsLogged(null);
    }

    const tryLogin = async () => {
        let { data: dane_trenera, error } = await supabase
            .from('trenerzy')
            .select('*')
            .eq('login',  login) 
        
        if(dane_trenera.length!==0 && dane_trenera[0].haslo === password){
            setIsLogged(true);
            setGlobalVariable(dane_trenera[0]);
          //  navigate('/trener/playerView');
            navigate('/player/dayview');
        }else{
            setIsLogged(false);
            setPassword("Hasło");
        }
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
                    {isLogged === false 
                    ? (<><input onChange={handleLoginChange} className = "custom_input_incorrect" type="text" placeholder={login} />
                    <input onChange={handlePasswordChange} className = "custom_input_incorrect" type="password" placeholder={password} /></>)
                    : (<><input onChange={handleLoginChange} className = "custom_input_correct" type="text" placeholder={login} />
                        <input onChange={handlePasswordChange} className = "custom_input_correct" type="password" placeholder={password} />
                        
                        </>)
                    }
                </div>
                <div className="buttonPlacement">
                    <button onClick={tryLogin} className="button">Zaloguj</button>
                    {isLogged === false && <p className="error">Niepoprawne dane logowania</p>}
                </div>
            </div>                                 
        </div>
    );
};

export default LoginComponent;