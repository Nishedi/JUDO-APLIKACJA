import { useState, useContext, act, useEffect } from "react";
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton';
import { Checkbox } from 'primereact/checkbox';

const style = {
    background: {
        display: "flex", // Używamy flexa, więc usuwamy grid
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#D7DFEE",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px 0 20px",
        backgroundImage: "linear-gradient(90deg, #1D61DC 0%, #103476 47%)",
        color: "#FFFFFF",
        fontFamily: "Poppins-Medium",
        fontSize: "20px",
        height: "80px",
        minHeight: "80px",
    },
    input_container: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        fontFamily: "Montserrat-Medium",
        color: "#103476",
        fontSize: "14px",
        width: "100%",
        padding: "10px",
    },
    writing_div: {
        display: "flex",
        justifyContent: "right",
        fontFamily: "Kodchasan-SemiBold",
        fontSize: "20px",
    },
    multiLineInput: {
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        lineHeight: "1.5",
        resize: "vertical",
        overflowWrap: "break-word",
        fontFamily: "Roboto-Regular",
        borderRadius: "4px",
        borderColor: "#CCC",
    },
    pickPDF: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        marginTop: "20px",
    },
    button: {
        backgroundImage: "linear-gradient(90deg, #1D61DC 0%, #103476 47%)",
        color: "#fff",
        borderColor: "#D7DFEE",
        borderRadius: "5px",
        fontFamily: "Montserrat-Semibold",
        fontSize: "12px",
        padding: "10px",
        width: "50%",
        border: "0px",
    },
    contentbackground: {
        padding: "5px 20px",
        backgroundColor:" #ffffff",
        borderRadius: "20px",
        margin: "10px 20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
    activity: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        fontFamily: "Montserrat-Medium",
        color: "#103476",
        fontSize: "14px",
    },



    
};

const Smssending = () => {
    const {smsList, viewedPlayer,supabase} = useContext(GlobalContext);
    const [listOfActivities, setListOfActivities] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
       loadSMS();
    }, []);

    const handleCheckboxClick = (id) => {
        setListOfActivities((prev) =>
            prev.map((activity) =>
                activity.id === id ? { ...activity, isChecked: !activity.isChecked } : activity
            )
        );
    };
    
    const loadSMS = () => {
        if (smsList && smsList.length === 0) return;
        const sortedActivities = smsList
            .map((activity) => {
                const day = activity.data.split('.')[0].padStart(2, '0');
                const month = activity.data.split('.')[1].padStart(2, '0');
                const year = activity.data.split('.')[2].split(' ')[0];
                const hour = activity.czas_rozpoczęcia.split(':')[0];
                const minute = activity.czas_rozpoczęcia.split(':')[1];
                const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
    
                return { ...activity, date, isChecked: true };
            })
            .sort((a, b) => a.date - b.date);
    
        setListOfActivities(sortedActivities);
    };
    
    const onCommentChange = (e) => {
        setComment(e.target.value);
    }

    async function sendSMS() {
        const phoneNumbers = [];
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('numer_telefonu')
            .eq('id', viewedPlayer.id);
        if (error) {
            console.error('Błąd podczas pobierania zawodników:', error);
            return;
        }
        if (zawodnicy && zawodnicy.length !== 0) {
            phoneNumbers.push(zawodnicy.map(zawodnik => zawodnik.numer_telefonu));
        }
        else{
            alert("Nie można wysłać smsa, ponieważ nie wybrano zawodników");
            return
        }
        const phoneQuery = phoneNumbers.flat().join(',');
        const params = {
            from: 'judotracker',
            to: phoneQuery,
            msg: comment,
            test: '0'
        };
    
        try {
            const response = await fetch('https://judotracker-backend.netlify.app/.netlify/functions/api/send-sms', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            
            return data;
        } catch (error) {
            console.error('Błąd przy wysyłaniu SMS:', error);
        }
    }

    const loadActivitiesToComment = () => {
        const selectedActivities = listOfActivities.filter(activity => activity.isChecked);
        
        const formattedActivities = selectedActivities.map(activity => {
            const [day, month] = activity.data.split('.');
            const time = activity.czas_rozpoczęcia;
    
            const details =  activity.rodzaj_aktywności;
    
            return `${day}.${month} ${time}, ${details}`;
        }).join('\n');
    
        setComment(prev => prev.trim() === '' ? `Przypomnienie o aktywnościach:\n${formattedActivities}` : `${prev}\nPrzypomnienie o aktywnościach:\n${formattedActivities}`);
    };
    
        
    return (
        <div style={style.background}>
            <div style={style.navbar}>
                <div >
                    <BackButton />
                </div>
                <div style={style.writing_div}>
                    Wysyłanie wiadomości sms
                </div>
                
            </div>
            <div>
                <div style = {style.contentbackground}>
                    {listOfActivities.map((activity) => (
                        <div style={style.activity}>
                        <strong>
                            {(() => {
                                const [day, month] = activity.data.split('.');
                                const time = activity.czas_rozpoczęcia;
                                const details =  activity.rodzaj_aktywności;
                                return `${day}.${month} ${time}, ${details}`;
                            })()}
                        </strong>
                        <Checkbox 
                            inputId={`activity-${activity.id || activity.data}`} 
                            checked={activity.isChecked}
                            onChange={() => handleCheckboxClick(activity.id)} 
                        />
                    </div>
                    ))}
                    
                </div>
                <div style={style.buttonContainer}>
                    <button style={style.button} onClick={()=>setComment("")}>Wyczyść treść</button>
                    <button style={style.button} onClick={loadActivitiesToComment}>Wczytaj aktywności do treści</button>
                </div>
                <div style={style.input_container}>
                    <div>Treść</div>
                    <textarea
                        id="multiline-input"
                        value={comment}
                        onChange={onCommentChange}
                        rows={5}
                        style={style.multiLineInput}
                        placeholder="Treść wiadomości"
                    />
                    <div style={{ textAlign: "right", fontSize: "12px", color: "#666", marginTop: "4px" }}>
                        Uwaga!<br/> W przypadku dłuższej wiadomości koszt SMS-a wzrośnie.<br/>
                        Liczba znaków: {comment.length}/160<br/>(sugerowane 160,  400 max)
                        
                    </div>

                    
                </div>
                <div style={style.buttonContainer}>
                    <button style={style.button} onClick={sendSMS}>Wyślij przypomnienie</button>
                </div>
            </div>
        </div>
    );
}
export default Smssending;