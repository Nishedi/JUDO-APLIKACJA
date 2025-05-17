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
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({}); // Obiekt przechowujący błędy
    const [selectedGroup, setSelectedGroup] = useState("Wybierz grupę zawodnika");
    
    const genders = [
        { name: "Mężczyzna", value: "Mężczyzna" },
        { name: "Kobieta", value: "Kobieta" }
    ];

    const weightCategories = {
        "Mężczyzna": ["-60kg", "-66kg", "-73kg", "-81kg", "-90kg", "-100kg", "+100kg"],
        "Kobieta": ["-48kg", "-52kg", "-57kg", "-63kg", "-70kg", "-78kg", "+78kg"]
    };

    const groups = [
        { name: "Senior", value: "Senior" },
        { name: "Młodszy senior", value: "Młodszy senior" },
        { name: "Junior", value: "Junior" },
        { name: "Młodzik", value: "Młodzik" },
        { name: "Dzieci", value: "Dzieci" }
    ];

    const handleGenderChange = (e) => {
        setSelectedGender(e.value);
    };

    const handleGroupChange = (e) => {
        setSelectedGroup(e.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSurnameChange = (e) => {
        setSurname(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleYearOfBirthChange = (e) => {
        setYearOfBirth(e.target.value);
    };

    const checkDataAndGoFurther = () => {
        let validationErrors = {};

        // Sprawdzanie, czy pola nie są puste
        if (name === "") {
            validationErrors.name = "Proszę podać imię zawodnika";
        }

        if (surname === "") {
            validationErrors.surname = "Proszę podać nazwisko zawodnika";
        }

        if (selectedGender === "") {
            validationErrors.gender = "Proszę wybrać płeć";
        }

        if (selectedWeightCategory === "Wybierz kategorię wagową") {
            validationErrors.weightCategory = "Proszę wybrać kategorię wagową";
        }

        if (yearOfBirth === "") {
            validationErrors.yearOfBirth = "Proszę podać rok urodzenia zawodnika";
        }
        const phoneRegex = /^[0-9]{9}$/;
        if (!phoneRegex.test(phone)) {
            validationErrors.phone = "Numer telefonu musi mieć 9 cyfr";
        }
        if (phone === "") {
            validationErrors.phone = "Proszę podać numer telefonu zawodnika";
        } else if (phone.length < 9) {
            validationErrors.phone = "Numer telefonu musi mieć conajmniej 9 cyfr";
        } else if (phone.length > 9) {
            validationErrors.phone = "Numer telefonu nie może mieć więcej niż 9 cyfr";
        } else if (isNaN(phone)) {
            validationErrors.phone = "Numer telefonu może zawierać tylko cyfry";
        }
        // Walidacja imienia i nazwiska: musi zaczynać się wielką literą i nie zawierać cyfr
        const regex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$/;
        if (!regex.test(name.trim())) {
            validationErrors.name = "Imię musi zaczynać się wielką literą i nie może zawierać cyfr";
        }
        if (!regex.test(surname.trim())) {
            validationErrors.surname = "Nazwisko musi zaczynać się wielką literą i nie może zawierać cyfr";
        }

        // Walidacja roku urodzenia
        const currentYear = new Date().getFullYear();
        if (yearOfBirth < 1930 || yearOfBirth > currentYear) {
            validationErrors.yearOfBirth = `Rok urodzenia musi być z przedziału 1930-${currentYear}`;
        }

        // Jeśli są błędy, ustawiamy je w stanie i nie przechodzimy dalej
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Jeśli nie ma błędów, kontynuujemy
        setNewPlayer({
            "name": name,
            "surname": surname,
            "gender": selectedGender,
            "weightCategory": selectedWeightCategory,
            "yearOfBirth": yearOfBirth,
            "group": selectedGroup,
            "phone": phone
        });
        
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
            <div className={styles.white_container}>
                <div className={styles.inputs}>
                    <div className={styles.input_container}>
                        <div>IMIĘ</div>
                        <input 
                            type="text" 
                            className={styles.input} 
                            placeholder={'Podaj imię zawodnika'} 
                            value={name} 
                            onChange={handleNameChange}
                            style={{
                                borderColor: errors.name ? 'red' : ''
                            }}
                        />
                    {errors.name && <div className={styles.error_message}>{errors.name}</div>}
                </div>
                    
                    <div className={styles.input_container}>
                        <div>NAZWISKO</div>
                        <input 
                            type="text" 
                            className={styles.input} 
                            placeholder={'Podaj nazwisko zawodnika'} 
                            value={surname} 
                            onChange={handleSurnameChange}style={{
                                borderColor: errors.surname ? 'red' : ''
                            }}
                        />
                        {errors.surname && <div className={styles.error_message}>{errors.surname}</div>}
                    </div>
                    <div className={styles.input_container}>
                        <div>Numer telefonu</div>
                        <input 
                            type="number" 
                            className={styles.input} 
                            placeholder={'Podaj numer telefonu'} 
                            value={phone} 
                            onChange={handlePhoneChange}style={{
                                borderColor: errors.phone ? 'red' : ''
                            }}
                        />
                        {errors.phone && <div className={styles.error_message}>{errors.phone}</div>}
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
                            style={{
                                borderColor: errors.gender ? 'red' : ''
                            }}
                        />
                        {errors.gender && <div className={styles.error_message}>{errors.gender}</div>}
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
                                style={{
                                    borderColor: errors.weightCategory ? 'red' : ''
                                }}
                        />
                            :
                            <Dropdown
                                value={selectedWeightCategory} 
                                onChange={(e) => setSelectedWeightCategory(e.value)}  
                                options={weightCategories["Kobieta"].map(category => ({ label: category, value: category }))}  
                                placeholder="Wybierz kategorię wagową"
                                className={`${styles.customDropdown} p-dropdown`}
                                panelStyle={{ backgroundColor: '#F8F8F8', borderRadius: '10px', padding: '5px 10px' }}
                                style={{
                                    borderColor: errors.weightCategory ? 'red' : ''
                                }}
                        />
                        }
                        {errors.weightCategory && <div className={styles.error_message}>{errors.weightCategory}</div>}
                    </div>

                    <div className={styles.input_container}>
                        <div>ROCZNIK</div>
                        <input 
                            type="number" 
                            className={styles.input}
                            placeholder={'Podaj rok urodzenia zawodnika'}
                            value={yearOfBirth}
                            onChange={handleYearOfBirthChange} style={{
                                borderColor: errors.yearOfBirth ? 'red' : ''
                            }}
                        />
                        {errors.yearOfBirth && <div className={styles.error_message}>{errors.yearOfBirth}</div>}
                    </div>
                    <div className={styles.input_container}>
                        <div>GRUPA</div>                        
                        <Dropdown
                            value={selectedGroup}
                            onChange={handleGroupChange}
                            options={groups}
                            optionLabel="name"
                            placeholder="Wybierz grupę"
                            className={`${styles.customDropdown} p-dropdown`}
                            panelStyle={{ backgroundColor: '#F8F8F8', borderRadius: '10px', padding: '5px 10px' }}
                            style={{
                                borderColor: errors.gender ? 'red' : ''
                            }}
                        />
                        {errors.gender && <div className={styles.error_message}>{errors.gender}</div>}
                    </div>
                </div>
                <button onClick={checkDataAndGoFurther} className={styles.button}>Dodaj</button>
            </div>
        </div>
    );
};

export default AddingPlayerFirstPage;