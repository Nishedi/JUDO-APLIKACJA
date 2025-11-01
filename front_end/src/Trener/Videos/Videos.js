import React, { useRef, useState, useEffect, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import styles from './Videos.module.css';
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from "react-router-dom";
import BackButton from '../../BackButton';
import { sharedStyles2 } from '../../CommonFunction';

const Videos = () => {
    const { supabase, globalVariable } = useContext(GlobalContext);
    
    const type = globalVariable.id_trenera ? "zawodnik" : "trener";
    console.log("TYPE:", type);
    const [isUploading, setIsUploading] = useState(false);
    const [videoFile, setVideoFile] = useState(null); 
    const [analiseName, setAnaliseName] = useState("");
    const [videoHeaders, setVideoHeaders] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const navigate = useNavigate();

    const onSelectPlayer = (selectedList) => {
        setSelectedPlayers(selectedList);
    };

    const onRemovePlayer = (selectedList) => {
        setSelectedPlayers(selectedList);
    };
    
    const downloadPlayers = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id_trenera', globalVariable.id);
        if (zawodnicy && zawodnicy.length !== 0) {
            setPlayers(zawodnicy.map(zawodnik => { return { name: `${zawodnik.imie} ${zawodnik.nazwisko}`, grupa: zawodnik.grupa, id: zawodnik.id }; }));
        }
    }

    const downloadVideoHeaders = async () => {
        
        if (type === "trener") {
            const { data: headers, error: headersError } = await supabase
                .from('analizy_wideo')
                .select('id, nazwa_analizy, id_zawodnika')
                .eq('id_trenera', globalVariable.id);

            if (headersError) {
                console.error('Błąd podczas pobierania nagłówków wideo:', headersError.message);
                return;
            }
            const zawodnikIds = headers
                .filter(h => h.id_zawodnika != null) 
                .map(h => h.id_zawodnika);
            const { data: zawodnicy, error: zawodnicyError } = await supabase
                .from('zawodnicy')
                .select('id, imie, nazwisko')
                .in('id', zawodnikIds);

            if (zawodnicyError) {
                console.error('Błąd podczas pobierania zawodników:', zawodnicyError.message);
                return;
            }

            const headersWithNames = headers.map(h => {
            const zawodnik = zawodnicy.find(z => z.id === h.id_zawodnika);
                return {
                    ...h,
                    imie: zawodnik?.imie || null,
                    nazwisko: zawodnik?.nazwisko || null
                };
            });

            setVideoHeaders(headersWithNames);
        }else{
            const { data: headers, error: headersError } = await supabase
                .from('analizy_wideo')
                .select('id, nazwa_analizy')
                .eq('id_zawodnika', globalVariable.id);

            if (headersError) {
                console.error('Błąd podczas pobierania nagłówków wideo:', headersError.message);
                return;
            }
            setVideoHeaders(headers);
        }
    }

    useEffect(() => {
        downloadVideoHeaders();
        if(type === "trener")
            downloadPlayers();
    }, []);

    const handleUpload = async () => {
        if (videoFile) {
            await uploadVideo(videoFile);
            downloadVideoHeaders();
        } else {
            alert('Proszę wybrać plik wideo do przesłania.');
        }
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const uploadVideo = async (file) => {
        setIsUploading(true);
        const pathsToUpload = await uploadChunks(file);
        if (pathsToUpload.length > 0) {
            if(type === "zawodnik"){
                const {data, error} = await supabase
                .from('analizy_wideo')
                .insert([
                    { nazwa_analizy: analiseName, linki_wideo: pathsToUpload, id_zawodnika: globalVariable.id, id_trenera: globalVariable.id_trenera },
                ])
                .select()
            if (error) {
                alert('Błąd podczas zapisywania analizy wideo: ' + error.message);
            } else {
                alert('Analiza wideo została zapisana pomyślnie!');
                setAnaliseName("");
                // setVideoFile(null);
            }
            }else if(type === "trener"){
                const {data, error} = await supabase
                    .from('analizy_wideo')
                    .insert([
                        { nazwa_analizy: analiseName, linki_wideo: pathsToUpload, id_trenera: globalVariable.id, id_zawodnika: selectedPlayers[0]?.id },
                    ])
                    .select()
                if (error) {
                    alert('Błąd podczas zapisywania analizy wideo: ' + error.message);
                } else {
                    alert('Analiza wideo została zapisana pomyślnie!');
                    setAnaliseName("");
                    // setVideoFile(null);
                    setSelectedPlayers([]);
                }
            }
        }
        
        setIsUploading(false);
    };

    const uploadChunks = async (file) => {
        const chunkSize = 25 * 1024 * 1024;
        let chunks = [];
        let pathsToUpload = [];

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
                pathsToUpload.push(data.path);
            }
        }
        if (pathsToUpload.length > 0) {
            console.log('Wszystkie pliki zostały zapisane:', pathsToUpload);
            return pathsToUpload;
        } else {
            console.error('Nie zapisano żadnych plików.');
            return [];
        }
    };

    const handleThreadClick = (id) => {
        navigate(`/trener/videos/${id}`);
    };

    const VideoFrame = ({index, frame}) => {
        return (
            <div
                key={index}
                className={styles.analysisCard}
                
                onClick={() => handleThreadClick(frame.id)}>
                <div className={styles.analysisInfo}>
                    <div className={styles.analysisName}>
                        {frame.nazwa_analizy}
                    </div>
                    {frame?.id_zawodnika && 
                        <div className={styles.analysisPlayerName}>
                            Zawodnik: {frame.imie} {frame.nazwisko}
                        </div>}
                </div>
            </div>
        )
    };

    return (
        <div  className={styles.background}>
            <div className={styles.navbar}>
                <div>
                    <BackButton path={type === "trener" ? "/trener/playerview" : "/player/dayview"} />
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
                     {type === "trener" && <div>
                        Wybierz zawodnika
                        <Multiselect
                            options={players}
                            selectedValues={selectedPlayers}
                            onSelect={onSelectPlayer}
                            onRemove={onRemovePlayer}             
                            singleSelect={true}
                            displayValue="name"
                            placeholder='Wybierz zawodnika'
                            style={sharedStyles2}
                        />
                        {/* {errors.selectedOptions && <div className={styles.error_message}>{errors.selectedOptions}</div>} */}
                        </div>}
                                             
                    <div className={styles.button_container}>
                        <button onClick={handleUpload}>{isUploading ? 'Wysyłanie' : 'Wyślij'}</button>
                    </div>
                </div>
            </div>
            {videoHeaders.length > 0 && (
                <div className={styles.video_list}>
                    {videoHeaders.map((header, index) => (
                        <VideoFrame key={index} frame={header} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Videos;
