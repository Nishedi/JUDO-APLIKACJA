import React, { useRef, useState, useEffect, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import styles from './Videos.module.css';
import { RxHamburgerMenu } from "react-icons/rx";
import BackButton from '../../BackButton';
const Videos = () => {
    const { supabase, globalVariable } = useContext(GlobalContext);
    const [isUploading, setIsUploading] = useState(false);
    const [videoFile, setVideoFile] = useState(null); 
    const [analiseName, setAnaliseName] = useState("");
    const [pathsToUpload, setPathsToUpload] = useState([]);
    
    const handleUpload = async () => {
        if (videoFile) await uploadVideo(videoFile);
        else alert('Proszę wybrać plik wideo do przesłania.');
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const uploadVideo = async (file) => {
        setIsUploading(true);
        if (await uploadChunks(file)) {
            const {data, error} = await supabase
                .from('analizy_wideo')
                .insert([
                    { nazwa_analizy: analiseName, linki_wideo: pathsToUpload, id_trenera: globalVariable.id },
                ])
                .select()
            if (error) {
                alert('Błąd podczas zapisywania analizy wideo: ' + error.message);
            } else {
                alert('Analiza wideo została zapisana pomyślnie!');
                setAnaliseName("");
                setVideoFile(null);
                setPathsToUpload([]);
            }
        }
        
        setIsUploading(false);
    };

    const uploadChunks = async (file) => {
        const chunkSize = 25 * 1024 * 1024;
        let chunks = [];
        for (let start = 0; start < file.size; start += chunkSize) {
            chunks.push(file.slice(start, start + chunkSize));
        }

        for (let i = 0; i < chunks.length; i++) {
            const originalName = file.name.replace(/\.mp4$/i, ""); // usuwa .mp4 z końca
            const fileName = `${Date.now()}_${originalName}_${i}.mp4`;
            const {data, error} = await supabase.storage
            .from('videos')
            .upload(`public/${fileName}`, chunks[i]);
            if (error) {
                console.error('Błąd zapisu:', error.message);
            } else {
                console.log('Plik zapisany!');
            }
            if (data) {
                console.log('Dane:', data.path);
                setPathsToUpload(prev => [...prev, data.path]);
            }
        }
        if (pathsToUpload.length > 0) {
            console.log('Wszystkie pliki zostały zapisane:', pathsToUpload);
            return true;
        }else {
            console.error('Nie zapisano żadnych plików.');
            return false;
        }
    };

    
    return (
        <div  className={styles.background}>
            <div className={styles.navbar}>
                <div>
                    <BackButton path="/trener/playerview" />
                </div>
                {/* <div className="left_navbar" onClick={() => setIsSidebarOpen(false)}></div> */}
                <div className="left_navbar" >
                    <div className={styles.writing_div}>
                        Analiza Wideo
                    </div>
                </div>  
            </div>
            <div className={styles.white_container}>
                <div className={styles.input_container}>
                    Wybierz wideo:
                    <input type="file" accept="video/*" onChange={(e) => handleFileChange(e)} />
                    Nazwa analizy:
                    <input
                        id="multiline-input"
                        value={analiseName}
                        onChange={(e) => setAnaliseName(e.target.value)}
                        placeholder="Wpisz nazwę analizy"
                     />
                    <div className={styles.button_container}>
                        <button onClick={handleUpload}>{isUploading ? 'Wysyłanie' : 'Wyślij'}</button>
                    </div>
                </div>
                 
                
            </div>
        </div>
    );
};

export default Videos;
