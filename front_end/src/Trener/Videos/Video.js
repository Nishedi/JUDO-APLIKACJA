import React, { useRef, useState, useEffect, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';
import styles from './Video.module.css';
import BackButton from '../../BackButton';
import { useParams } from "react-router-dom";

const ImageProcessing = ({ image, width, height, comment, onCommentChange, onUrlChange, url, updateVideoInfo, onRemove, onMoveScreenshot }) => {
    const { supabase } = useContext(GlobalContext);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("red");
    const [firstUpload, setFirstUpload] = useState();
    const [isSaved, setIsSaved] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if(canvasRef.current && url){
            getImageFromUrl(width, height);
        }
        else 
        if (canvasRef.current && image) {
            const ctx = canvasRef.current.getContext("2d");
            const img = new window.Image();
            img.src = image;
            img.onload = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
            };
        }
    }, [image, width, height]);

    const getImageFromUrl = async (width, height) => {
        if (!url) return;
        
        setIsSaved(true);
        const publicImageUrl = `https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/videos/${url}`;
        
        const response = await fetch(publicImageUrl);
        if (!response.ok) {
            console.error('Nie udało się pobrać obrazka z Supabase:', response.status);
            return;
        }

        const blob = await response.blob();
        const imgURL = URL.createObjectURL(blob);

        const ctx = canvasRef.current.getContext("2d");
        const img = new window.Image();
        img.onload = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            // (opcjonalnie) zwolnij URL po załadowaniu
            URL.revokeObjectURL(imgURL);
        };
        img.src = imgURL;
    };

    const getCanvasPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);
        return { x, y };
    };

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        const pos = getCanvasPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        const pos = getCanvasPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        if (isDrawing) setIsDrawing(false);
    };

    const handleEraseAll = () => {
        if (canvasRef.current && image) {
            const ctx = canvasRef.current.getContext("2d");
            const img = new window.Image();
            img.src = image;
            img.onload = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
            };
        }
    };

    const handleSaveImage = async () => {
        if (!canvasRef.current) return;
        
        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;
            if(url || firstUpload){
                const fn = url || firstUpload;
                const {deleteddata, deletedError} = await supabase.storage
                    .from('videos')
                    .remove(fn);
                    if(deletedError){
                        console.error('Błąd usuwania starego pliku:', deletedError);
                    }
                    if(deleteddata){
                        console.log('Usunięto stary plik:', deleteddata);
                    }
            }
            const fileName = `user-uploads/screenshot_${Date.now()}.png`;
            const { data, error } = await supabase.storage
                .from('videos')
                .upload(fileName, blob, { 
                    contentType: 'image/png'
                });

            if (error) {
                alert(`Błąd zapisu: ${error.message}`);
            } 
            if(data)
            {   
                console.log('Zapisano plik:', data);
                setIsSaved(true);
                setFirstUpload(data.path);
                onUrlChange(data.path);
            }
        }, 'image/png');
    };


    return (
        <div style={{position: "relative", marginBottom: "30px", width: "100%" }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: "2px solid #ccc",
                    width: width,
                    height: "auto",
                    maxWidth: "100vw",
                    display: "block",
                    cursor: "crosshair",
                    marginBottom: "5px"
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <div className={styles.buttonsContainer} style={{padding:"5px 10px" }}>
                <div >Kolor:</div>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ marginLeft: 8 }}
                />
                <button onClick={handleEraseAll} style={{ marginLeft: 8 }}>Cofnij zmiany</button>
            </div>
            <div style={{padding:"5px 10px" }}>
                Komentarz
                <textarea
                    rows={4}
                    className={styles.multiLineInput}
                    placeholder="Wpisz komentarz"
                    value={comment}
                    onChange={e => onCommentChange(e.target.value)}
                    style={{  width: "100%" }}
                />
            </div>
            <div className={styles.buttonsContainer} style={{padding:"5px 10px" }}>
                <button onClick={handleSaveImage} >Zapisz</button>
                {isSaved && (<button onClick={() => setIsModalOpen(true)} className={styles.redButton} style={{ width: "30%" }}>Usuń</button>)}
            </div>
            {isModalOpen && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal_content}>
                        <h2>Czy na pewno chcesz usunąć ten fragment analizy?</h2>
                        <div className={styles.modal_buttons}>
                            <button onClick={() => {onRemove(); setIsModalOpen(false);}}>Tak</button>
                            <button onClick={() => setIsModalOpen(false)}>Nie</button>
                        </div>
                    </div>
                </div>
            )}
            {isSaved&&(<div className={styles.buttonsContainer} style={{padding:"5px 10px" }}>
                <button onClick={() => onMoveScreenshot("up")} >Przesuń w górę</button>
                <button onClick={() => onMoveScreenshot("down")} style={{ marginLeft: 8 }}>Przesuń w dół</button>
            </div>)}
            
                

        </div>
    )
};

const Video = () => {
    const { supabase } = useContext(GlobalContext);
    const videoRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const { id_video } = useParams();
    const [screenshots, setScreenshots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); 
    const [parts, setParts] = useState([]);
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: 400 }); // domyślna wysokość

    const handleCommentChange = (idx, newComment) => {
        setScreenshots(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], comment: newComment };
            return updated;
        });
    };


    const handleUrlChange = async (idx, newUrl) => {
        const localScreenshot = screenshots;
        setScreenshots(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], url: newUrl };
            return updated;
        });
        localScreenshot[idx].url = newUrl;
        const images = localScreenshot.map(({ url, comment, width, height }) => ({
            url,
            comment,
            width,
            height
        }));
        const {data, error} = await supabase
            .from('analizy_wideo')
            .update({ zdjecia: images })
            .eq('id', id_video)
            .select();

        if (error) {
            console.error('Błąd aktualizacji informacji o wideo:', error.message);
        } else {
            // console.log('Zaktualizowano informacje o wideo:', data);
        }
    };

    const handleRemoveScreenshot = async (idx) => {
       
        
        const localScreenshot = screenshots.filter((_, i) => i !== idx);
        setScreenshots(localScreenshot);

        const images = localScreenshot.map(({ url, comment, width, height }) => ({
            url,
            comment,
            width,
            height
        }));

        const { data, error } = await supabase
            .from('analizy_wideo')
            .update({ zdjecia: images })
            .eq('id', id_video)
            .select();

        if (error) {
            console.error('Błąd aktualizacji informacji o wideo:', error.message);
        }
        
    };

    const handleMoveScreenshot = async (idx, direction) => {
        
        const localScreenshot = [...screenshots];
        let newIdx = idx;
        console.log(screenshots)

        if (direction === "up" && idx > 0) {
            [localScreenshot[idx - 1], localScreenshot[idx]] = [localScreenshot[idx], localScreenshot[idx - 1]];
            newIdx = idx - 1;
        }
        if (direction === "down" && idx < localScreenshot.length - 1) {
            [localScreenshot[idx + 1], localScreenshot[idx]] = [localScreenshot[idx], localScreenshot[idx + 1]];
            newIdx = idx + 1;
        }

        setScreenshots(localScreenshot);

        const images = localScreenshot.map(({ url, comment, width, height }) => ({
            url,
            comment,
            width,
            height
        }));

        const { data, error } = await supabase
            .from('analizy_wideo')
            .update({ zdjecia: images })
            .eq('id', id_video)
            .select();

        if (error) {
            console.error('Błąd aktualizacji informacji o wideo:', error.message);
        }
    };

    useEffect(() => {
        function handleResize() {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight * 0.6 }); // np. 60% wysokości ekranu
        }
        window.addEventListener('resize', handleResize);
        handleResize(); 

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        (async () => {
            await downloadVideoInfo();
        })();
    }, []);

    const downloadVideoInfo = async () => {
        const {data, error} = await supabase
            .from('analizy_wideo')
            .select('*')
            .eq('id', id_video);

        if (error) {
            console.error('Błąd pobierania informacji o wideo:', error.message);
        } else {
            loadAndPlay(data[0].linki_wideo);
            setParts(data[0].linki_wideo);
            // console.log(data)
            setScreenshots(data[0].zdjecia || []);
        }
    };

    const updateVideoInfo = async () => {
        const images = screenshots.map(({ url, comment, width, height }) => ({
            url,
            comment,
            width,
            height
        }));
        const {data, error} = await supabase
            .from('analizy_wideo')
            .update({ zdjecia: images })
            .eq('id', id_video);

        if (error) {
            console.error('Błąd aktualizacji informacji o wideo:', error.message);
        } else {
            // console.log('Zaktualizowano informacje o wideo:', data);
        }
    }

    async function loadAndPlay(parts) {
        const blobs = await Promise.all(parts.map(url =>
            fetch("https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/videos/"+url).then(res => res.blob())
        ));
        const superBlob = new Blob(blobs, { type: 'video/mp4' });
        const url = URL.createObjectURL(superBlob);
        videoRef.current.src = url;
    }

    const handlePlay = () => videoRef.current.play();
    const handlePause = () => videoRef.current.pause();
    const handleSpeed = (speed) => videoRef.current.playbackRate = speed;

    const handleScreenshot = () => {
        const video = videoRef.current;
        if (!video) return;
        const aspectRatio = video.videoWidth / video.videoHeight;
        const width = canvasSize.width;
        const height = Math.round(width / aspectRatio);

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const ctx = offscreenCanvas.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);
        const image = offscreenCanvas.toDataURL("image/png");

        setScreenshots(prev => ([...prev, { image, width, height, comment: "", url: "" }]));
    };

    const removeAnalysis = async () => {
        setIsModalOpen(false)
        const {data, error} = await supabase
            .from('analizy_wideo')
            .delete()
            .eq('id', id_video);

        if (error) {
            console.error('Błąd usuwania analizy wideo:', error.message);
        } else {
            console.log('Usunięto analizę wideo:', data);
        }

        if(parts<=0){
            navigate('/trener/videos');
            return;
        }

        parts.forEach(async (part) => {
            const {videoData, videoError} = await supabase.storage
                .from('videos')
                .remove(part);

             if (videoError) {
                console.error('Błąd usuwania wideo:', videoError.message);
            } else {
                console.log('Usunięto wideo:', videoData);
            }
            
        });

        if(screenshots.length > 0) {
            screenshots.forEach(async (screenshot) => {
                const {data, error} = await supabase.storage
                    .from('videos')
                    .remove(screenshot.url);

                if (error) {
                    console.error('Błąd usuwania zrzutu ekranu:', error.message);
                } else {
                    console.log('Usunięto zrzut ekranu:', data);
                }
            });
        }

        navigate('/trener/videos');
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div>
                    <BackButton path="/trener/videos" />
                </div>
                <div className={styles.writing_div}>
                    Analiza Wideo
                </div>
            </div>
            <video
                ref={videoRef}
                // width={400}
                controls
                crossOrigin="anonymous"
                src={videoUrl}
            />
            <div className={styles.buttonsContainer}>
                <button onClick={handlePlay}>Play</button>
                <button onClick={handlePause}>Pause</button>
            </div>
            <div className={styles.buttonsContainer}>
                <button onClick={() => handleSpeed(0.5)}>0.5x</button>
                <button onClick={() => handleSpeed(1)}>1x</button>
                <button onClick={() => handleSpeed(1.5)}>1.5x</button>
                <button onClick={() => handleSpeed(2)}>2x</button>
            </div>
            <div className={styles.buttonsContainer}>
                <button onClick={handleScreenshot}>Zrób screenshot</button>
            </div>
            {screenshots.length > 0 && (
                <div>
                    {screenshots.map((data, idx) => (
                        <>
                        <ImageProcessing
                            key={data.url || data.image}
                            image={data.image}
                            url={data.url}
                            width={data.width}
                            height={data.height}
                            comment={data.comment}
                            onCommentChange={newComment => handleCommentChange(idx, newComment)}
                            onUrlChange={newUrl => handleUrlChange(idx, newUrl)}
                            updateVideoInfo={updateVideoInfo}
                            onRemove={() => handleRemoveScreenshot(idx)}
                            onMoveScreenshot={(direction) => handleMoveScreenshot(idx, direction)}
                        />
                        </>
                        
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal_content}>
                        <h2>Czy na pewno chcesz usunąć tą analizę?</h2>
                        <div className={styles.modal_buttons}>
                            <button onClick={() => {setIsModalOpen(false); removeAnalysis();}}>Tak</button>
                            <button onClick={() => setIsModalOpen(false)}>Nie</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.buttonsContainer}>
                <button className={styles.redButton} onClick={() => { setIsModalOpen(true);}}>Usuń analizę</button>
            </div>
            
        </div>
    );
};

export default Video;