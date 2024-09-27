import styles from './AddingPlayer.module.css';
import { Dropdown } from 'primereact/dropdown';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';
import BackButton from '../../BackButton';

const AddingPlayerFirstPage = () => {
    const navigate = useNavigate();
    const { setNewPlayer } = useContext(GlobalContext);
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedWeightCategory, setSelectedWeightCategory] = useState("Wybierz kategorię wagową");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [yearOfBirth, setYearOfBirth] = useState("");
    const genders = [
        { name: "Mężczyzna", value: "Mężczyzna" },
        { name: "Kobieta", value: "Kobieta" }
    ];

    const weightCategories = {
        "Mężczyzna": ["-60kg", "-66kg", "-73kg", "-81kg", "-90kg", "-100kg", "+100kg"],
        "Kobieta": ["-48kg", "-52kg", "-57kg", "-63kg", "-70kg", "-78kg", "+78kg"]
    };

    const handleGenderChange = (e) => {
        setSelectedGender(e.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSurnameChange = (e) => {
        setSurname(e.target.value);
    };

    const handleYearOfBirthChange = (e) => {
        setYearOfBirth(e.target.value);
    };

    const checkDataAndGoFurther = () => {
        if (name === "" || surname === "" || selectedGender === "" || yearOfBirth === "" || selectedWeightCategory === "Wybierz kategorię wagową") {
            alert("Wypełnij wszystkie pola");
            return;
        } 
        const regex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/;
        if (!regex.test(name) || !regex.test(surname)) {
            alert("Imię i nazwisko musi zaczynać się z wielkiej litery i nie może zawierać cyfr");
            return;
        }
        const currentYear = new Date().getFullYear();
        if (yearOfBirth < 1930 || yearOfBirth > currentYear) {
            alert(`Rok urodzenia musi być z przedziału 1930-${currentYear}`);
            return;
        }
        setNewPlayer({"name": name, "surname": surname, "gender": selectedGender, "weightCategory": selectedWeightCategory, "yearOfBirth": yearOfBirth});
        navigate('/trener/addingplayerlogininfo');
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div className={styles.toLeft}>
                    <BackButton />
                </div>
                DANE ZAWODNIKA
            </div>
            <div className={styles.content}>
                <div className={styles.inputs}>
                    <div className={styles.input_container}>
                        <div>IMIĘ</div>
                        <input type="text" 
                        className={styles.input} 
                        placeholder={'Podaj imię zawodnika'} 
                        value={name} 
                        onChange={handleNameChange}/>
                    </div>
                    <div className={styles.input_container}>
                        <div>NAZWISKO</div>
                        <input type="text" 
                        className={styles.input} 
                        placeholder={'Podaj nazwisko zawodnika'} 
                        value={surname} 
                        onChange={handleSurnameChange} />
                    </div>
                    <div className={styles.input_container}>
                        <div>PŁEĆ</div>                        
                        <Dropdown
                            value={selectedGender}
                            onChange={handleGenderChange}
                            options={genders}
                            optionLabel="name"
                            placeholder="Wybierz płeć"
                            className={`${styles.customDropdown} p-dropdown`}
                            panelStyle={{ backgroundColor: '#F8F8F8', borderRadius: '10px', padding: '5px 10px' }}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <div>KATEGORIA WAGOWA</div>
                        {selectedGender === "Mężczyzna" ? 
                            <Dropdown
                                value={selectedWeightCategory} 
                                onChange={(e) => setSelectedWeightCategory(e.value)}  
                                options={weightCategories["Mężczyzna"].map(category => ({ label: category, value: category }))}  
                                placeholder="Wybierz kategorię wagową"
                                className={`${styles.customDropdown} p-dropdown`}
                                panelStyle={{ backgroundColor: '#F8F8F8', borderRadius: '10px', padding: '5px 10px' }}
                            />
                            :
                            <Dropdown
                                value={selectedWeightCategory} 
                                onChange={(e) => setSelectedWeightCategory(e.value)}  
                                options={weightCategories["Kobieta"].map(category => ({ label: category, value: category }))}  
                                placeholder="Wybierz kategorię wagową"
                                className={`${styles.customDropdown} p-dropdown`}
                                panelStyle={{ backgroundColor: '#F8F8F8', borderRadius: '10px', padding: '5px 10px' }}
                            />
                        }
                    </div>
                    <div className={styles.input_container}>
                        <div>ROCZNIK</div>
                        <input type="number" 
                        className={styles.input}
                        placeholder={'Podaj rok urodzenia zawodnika'}
                        value={yearOfBirth}
                        onChange={handleYearOfBirthChange} />
                    </div>
                </div>
                <button onClick={checkDataAndGoFurther} className={styles.button}>Dodaj</button>
            </div>
        </div>
    );
};

export default AddingPlayerFirstPage;
