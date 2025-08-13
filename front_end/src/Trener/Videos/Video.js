import React, { useRef, useState, useEffect, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import styles from './Video.module.css';

import BackButton from '../../BackButton';
import { useParams } from "react-router-dom";

const Video = () => {
    const { supabase } = useContext(GlobalContext);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [screenshot, setScreenshot] = useState(false);
    const [screenshotImage, setScreenshotImage] = useState(null); // zapisany obraz
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("red");
    const { id_video } = useParams();
    const [videoInfo, setVideoInfo] = useState(null);

    useEffect(() => {
        (async () => {
            await downloadVideoInfo();
            
            // loadVideoBlob(
            //     "https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/videos/public/1754994224494481595461_10018500904830921_2817224661189247323_n.mp4"
            // );
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
            setVideoInfo(data);
            console.log('Pobrano informacje o wideo:', data);
            loadAndPlay(data[0].linki_wideo)
        }
    };

    async function loadAndPlay(parts) {
        // parts = array of URLs to each chunk
        const blobs = await Promise.all(parts.map(url =>
        {
            console.log("https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/videos/"+url)
            return fetch("https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/videos/"+url).then(res => res.blob())
        }
            
        ));
        // Połącz blob’y w jeden
        const superBlob = new Blob(blobs, { type: 'video/mp4' });
        const url = URL.createObjectURL(superBlob);
        videoRef.current.src = url;
        // videoRef.current.play();
    }

    const loadVideoBlob = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        setVideoUrl(URL.createObjectURL(blob));
    };

    const uploadVideo = async (file) => {
        setIsUploading(true);
        const { error } = await supabase.storage
            .from('videos')
            .upload(`public/${Date.now()}_${file.name}`, file);

        if (error) {
            console.error('Błąd zapisu:', error.message);
        } else {
            console.log('Plik zapisany!');
        }
        setIsUploading(false);
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) await uploadVideo(file);
    };

    const handlePlay = () => videoRef.current.play();
    const handlePause = () => videoRef.current.pause();
    const handleSpeed = (speed) => videoRef.current.playbackRate = speed;

    const handleScreenshot = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Zapisujemy obraz jako referencję do przywracania
            const img = new Image();
            img.src = canvas.toDataURL("image/png");
            img.onload = () => setScreenshotImage(img);

            setScreenshot(true);
        }
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

        // Obliczamy współrzędne względem canvas
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        return { x, y };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const ctx = canvasRef.current.getContext("2d");
        // ctx.strokeStyle = currentColor; // np. zmienna przechowująca kolor
        // ctx.lineWidth = currentLineWidth; // np. zmienna przechowująca grubość linii
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        const pos = getCanvasPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const pos = getCanvasPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(false);
    };

    const handleSaveImage = () => {
        const link = document.createElement('a');
        link.download = `screenshot_${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    };

    const handleEraseAll = () => {
        if (screenshotImage) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.drawImage(screenshotImage, 0, 0);
        }
    };

    // return (
    //     <div>
    //         <br />
    //         <div className={styles.buttonsContainer}>
    //             <button onClick={handlePlay}>Play</button>
    //             <button onClick={handlePause}>Pause</button>
    //         </div>
    //         <div className={styles.buttonsContainer}>
    //             <button onClick={() => handleSpeed(0.5)}>0.5x</button>
    //             <button onClick={() => handleSpeed(1)}>1x</button>
    //             <button onClick={() => handleSpeed(1.5)}>1.5x</button>
    //             <button onClick={() => handleSpeed(2)}>2x</button>
    //         </div>
    //         <div className={styles.buttonsContainer}>
    //             <button onClick={handleScreenshot}>Zrób screenshot</button>
    //         </div>

    //         {/* Narzędzia do rysowania */}
    //         {screenshot && (
    //             <>
    //             <div className={styles.buttonsContainer}>
    //                 <canvas
    //                     ref={canvasRef}
    //                     style={{
    //                         border: "1px solid #ccc",
    //                         maxWidth: "100%",
    //                         cursor: screenshot ? "crosshair" : "default"
    //                     }}
    //                     onMouseDown={startDrawing}
    //                     onMouseMove={draw}
    //                     onMouseUp={stopDrawing}
    //                     onMouseLeave={stopDrawing}
    //                     onTouchStart={startDrawing}
    //                     onTouchMove={draw}
    //                     onTouchEnd={stopDrawing}
    //                 />
    //             </div>
    //             <div className={styles.buttonsContainer}>
    //                 <label>
    //                     Kolor:
    //                     <input
    //                         type="color"
    //                         value={color}
    //                         onChange={(e) => setColor(e.target.value)}
    //                     />
    //                 </label>
    //                 <button onClick={handleEraseAll}>Cofnij zmiany</button>
    //                 <button onClick={handleSaveImage}>Zapisz obraz</button>
    //             </div>
    //             </>
    //         )}
    //     </div>
    // );
    return (
        <div  className={styles.background}>
            <div className={styles.navbar}>
                <div>
                    <BackButton path="/trener/videos" />
                </div>
                {/* <div className="left_navbar" onClick={() => setIsSidebarOpen(false)}></div> */}
                <div className={styles.writing_div}>
                    Analiza Wideo
                </div> 
            </div>
            <video
                ref={videoRef}
                width={400}
                controls
                crossOrigin="anonymous"
                src={videoUrl}
            />
            
            
        </div>
    );
};

export default Video;
