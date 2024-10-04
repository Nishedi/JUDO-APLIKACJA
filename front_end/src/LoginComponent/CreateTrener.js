import React, {useState} from "react";
import {useContext} from "react";
import {GlobalContext} from "../GlobalContext";
import bcrypt from "bcryptjs";

const CreateTrener = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [checkAdminPassword, setCheckAdminPassword] = useState("");
    const adminPassword = "admin";
    const {supabase} = useContext(GlobalContext);
    const [hashedPassword, setHashedPassword] = useState("");

    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    }

    const handlePasswordChange = async (event) => {
        setPassword(event.target.value);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleSurnameChange = (event) => {
        setSurname(event.target.value);
    }

    const handleCheckAdminPasswordChange = (event) => {
        setCheckAdminPassword(event.target.value);
    }

    const tryCreate = async () => {
        if(checkAdminPassword !== adminPassword){
            console.error("Błędne hasło admina");
            return;
        }
        const hashed = await bcrypt.hash(password, 10);
        setHashedPassword(hashed);
        let { data, error } = await supabase
            .from('trenerzy')
            .insert([
                { login: login, haslo: hashed, imie: name, nazwisko: surname }
            ]);
        if(error){
            console.error("Błąd dodawania trenera", error);
            return;
        }
        console.log("Dodano trenera", data);
    }

    const checkMatching = async () => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const match = await bcrypt.compare(password, hashedPassword);
        console.log("Czy hasła pasują?", match);
    }

    return (
        <div>
            <input type="text" value={login} onChange={handleLoginChange} placeholder="login"/>
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="haslo" />
            <button>Zaszyfruj haslo</button>
            <input type="text" value={name} onChange={handleNameChange} placeholder="imie"/>
            <input type="text" value={surname} onChange={handleSurnameChange} placeholder="nazwisko" />
            <input type="text" value={checkAdminPassword} onChange={handleCheckAdminPasswordChange} placeholder="haslo admina"/>
            <button onClick={tryCreate}>Dodaj trenera</button>
            <button onClick={checkMatching}>Sprawdz czy pasują</button>
            <button onClick={async ()=>{
                if(hashedPassword){
                    console.log(hashedPassword);
                } else{
                    await bcrypt.hash(password, 10).then((hashed)=>{
                        console.log(hashed);
                    });
                }
               }}>Pokaż zaszyfrowane hasło</button>
        </div>
    )
}

export default CreateTrener;