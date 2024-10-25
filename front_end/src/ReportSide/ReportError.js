import styles from "./ReportError.module.css";
import { useState, useContext } from "react";
import { GlobalContext } from '../GlobalContext';
import { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton';

const ReportError = () => {
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
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div >
                    <BackButton />
                </div>
                <div className="left_navbar">
                    <div className={styles.writing_div}>
                        Zgłaszanie błędu
                    </div>
                </div>  
                <div></div>
            </div>
            <div>
                <div className={styles.input_container}>
                    <div>Opis błędu</div>
                    <textarea
                        id="multiline-input"
                        value={comment}
                        onChange={onCommentChange}
                        rows={5}  // Ustaw liczbę widocznych wierszy
                        className={styles.multiLineInput}
                        placeholder="Opisz błąd"
                    />
                    <input className={styles.pickPDF} type="file" onChange={setFile}/>
                    
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={handleUploadClick}>Wyślij</button>
                </div>
            </div>
        </div>
    );
}
export default ReportError;