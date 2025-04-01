import { useState, useContext } from "react";
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton';

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



    
};

const Smssending = () => {
    const {supabase} = useContext(GlobalContext);
    const {globalVariable } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [file, setfile] = useState(null);

    const onCommentChange = (e) => {
        setComment(e.target.value);
    }

    const setFile = (e) => {
        setfile(e.target.files[0]);
    }

    const handleUploadClick = async () => {
        if(!comment && !file) return;
        const isFile = file ? true : false;
        const { data, error } = await supabase
            .from('bledy')
            .insert([
                { imie: globalVariable.imie, 
                    nazwisko: globalVariable.nazwisko,
                    tresc: comment,
                    plik: isFile,
                },
            ])
            .select();
            if(data){
                if(file){
                    addPDF(data[0].id);
                }
                navigate(-1);
            }
    
        }

    const addPDF = async (id) => {
        const suffix =new Date().getDate()+""+new Date().getMonth()+""+new Date().getFullYear()+""+
        new Date().getHours()+""+new Date().getMinutes()+""+ new Date().getSeconds()
        +""+new Date().getMilliseconds();
        const {data, error} = await supabase
        .storage
        .from('errors')
        .upload(id+"_"+globalVariable.imie+"_"+globalVariable.nazwisko+"_"+suffix, file);
        if(error){
            console.log(error);
        }
    }
        
    return (
        <div style={style.background}>
            <div style={style.navbar}>
                <div >
                    <BackButton />
                </div>
                <div style={style.writing_div}>
                    Zgłaszanie błędu
                </div>
                <div></div>
            </div>
            <div>
                <div style={style.input_container}>
                    <div>Opis błędu</div>
                    <textarea
                        id="multiline-input"
                        value={comment}
                        onChange={onCommentChange}
                        rows={5}  // Ustaw liczbę widocznych wierszy
                        style={style.multiLineInput}
                        placeholder="Opisz błąd"
                    />
                    <input style={style.pickPDF} type="file" onChange={setFile}/>
                    
                </div>
                <div style={style.buttonContainer}>
                    <button style={style.button} onClick={handleUploadClick}>Wyślij</button>
                </div>
            </div>
        </div>
    );
}
export default Smssending;