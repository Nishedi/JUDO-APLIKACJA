import './LoginComponent.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import bcrypt from 'bcryptjs';

const LoginComponent = () => {
    const { setGlobalVariable, supabase } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isLogged, setIsLogged] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLoginChange = (event) => {
        setLogin(event.target.value.trim());
        setIsLogged(null);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value.trim());
        setIsLogged(null);
    }

    useEffect(() => {
        
    }, []);

    const tryLogin = async () => {
        let { data: dane_trenera, error } = await supabase
            .from('trenerzy')
            .select('*')
            .eq('login',  login) 
        
        if(dane_trenera.length!==0 && await bcrypt.compare(password, dane_trenera[0].haslo)){
            setIsLogged(true);
            setGlobalVariable(dane_trenera[0]);
            navigate('/trener/playerView');
        }else{
            let { data: dane_zawodnika, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('login',  login)

            if(dane_zawodnika.length!==0 && await bcrypt.compare(password, dane_zawodnika[0].haslo)){
                setIsLogged(true);
                setGlobalVariable({
                    ...dane_zawodnika[0],
                    viewedDate: new Date()
                });
                    navigate('/player/dayview');
            }else{
                setIsLogged(false);
                setPassword("Hasło");
            }
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
                    <input 
                        onChange={handleLoginChange}  
                        className = {isLogged === false ? "custom_input_incorrect" : "custom_input_correct"}
                        type="text" 
                        placeholder={"Login"} 
                        value={login} 
                    />
                    <>
                        <div style={{ position: 'relative', display: 'inline-block', width: '80%' }}>
                            <input
                                onChange={handlePasswordChange}
                                className={isLogged === false ? "custom_input_incorrect" : "custom_input_correct"}
                                type={showPassword ? "text" : "password"}
                                placeholder={"Hasło"}
                                value={password}
                                style={{ paddingRight: '60px', boxSizing: 'border-box', width: '100%' }}
                                aria-label="Hasło"
                            />
                            <button
                            type="button"
                            className="showPasswordButton"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()} /* zapobiega odfokusowaniu inputa przy kliknięciu */
                            aria-pressed={showPassword}
                            aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                padding: '4px 8px',
                                cursor: 'pointer',
                                width: 'auto',
                            }}
                            >
                            {showPassword ? "Ukryj" : "Pokaż"}
                            </button>
                        </div>
                        </>
                    
                    
                </div>
                <div className="buttonPlacement">
                    <button onClick={tryLogin} className="button">Zaloguj</button>
                    {isLogged === false && <p className="error">Niepoprawne dane logowania</p>}
                </div>
                <div className={"club_name"}>Klub Sportowy POHL JUDO Przemęt</div> 
            </div>                                 
        </div>
    );
};

export default LoginComponent;