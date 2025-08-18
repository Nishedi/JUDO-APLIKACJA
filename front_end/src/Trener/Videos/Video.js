// import React, { useRef, useState, useEffect, useContext } from "react";
// import { GlobalContext } from '../../GlobalContext';
// import styles from './Video.module.css';

// import BackButton from '../../BackButton';
// import { useParams } from "react-router-dom";

// const Video = () => {
//     const { supabase } = useContext(GlobalContext);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const imgRef = useRef(null); // ref do obrazka screenshotu
//     const [isUploading, setIsUploading] = useState(false);
//     const [videoUrl, setVideoUrl] = useState(null);
//     const [screenshot, setScreenshot] = useState(false);
//     const [screenshotImage, setScreenshotImage] = useState(null); // zapisany obraz
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [color, setColor] = useState("red");
//     const { id_video } = useParams();
//     const [videoInfo, setVideoInfo] = useState(null);

//     useEffect(() => {
//         (async () => {
//             await downloadVideoInfo();
//         })();
//     }, []);

//     const downloadVideoInfo = async () => {
//         const {data, error} = await supabase
//             .from('analizy_wideo')
//             .select('*')
//             .eq('id', id_video);

//         if (error) {
//             console.error('Błąd pobierania informacji o wideo:', error.message);
//         } else {
//             setVideoInfo(data);
//             loadAndPlay(data[0].linki_wideo);
//         }
//     };

//     async function loadAndPlay(parts) {
//         const blobs = await Promise.all(parts.map(url =>
//             fetch("https://akxozdmzzqcviqoejhfj.supabase.co/storage/v1/object/public/videos/"+url).then(res => res.blob())
//         ));
//         const superBlob = new Blob(blobs, { type: 'video/mp4' });
//         const url = URL.createObjectURL(superBlob);
//         videoRef.current.src = url;
//     }   

//     const handlePlay = () => videoRef.current.play();
//     const handlePause = () => videoRef.current.pause();
//     const handleSpeed = (speed) => videoRef.current.playbackRate = speed;

//     const handleScreenshot = () => {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         if (video && canvas) {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//             const ctx = canvas.getContext("2d");
//             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//             const dataUrl = canvas.toDataURL("image/png");
//             setScreenshotImage(dataUrl); // zapisujemy dataUrl zamiast Image
//             setScreenshot(true);
//         }
//     };

//     const getCanvasPos = (e) => {
//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();

//         let clientX, clientY;

//         if (e.touches && e.touches.length > 0) {
//             clientX = e.touches[0].clientX;
//             clientY = e.touches[0].clientY;
//         } else {
//             clientX = e.clientX;
//             clientY = e.clientY;
//         }

//         // Obliczamy współrzędne względem canvas
//         const x = (clientX - rect.left) * (canvas.width / rect.width);
//         const y = (clientY - rect.top) * (canvas.height / rect.height);

//         return { x, y };
//     };

//     const startDrawing = (e) => {
//         e.preventDefault();
//         const ctx = canvasRef.current.getContext("2d");
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 3;
//         ctx.lineJoin = "round";
//         ctx.lineCap = "round";
//         const pos = getCanvasPos(e);
//         ctx.beginPath();
//         ctx.moveTo(pos.x, pos.y);
//         setIsDrawing(true);
//     };

//     const draw = (e) => {
//         e.preventDefault();
//         if (!isDrawing) return;
//         const ctx = canvasRef.current.getContext("2d");
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 3;
//         const pos = getCanvasPos(e);
//         ctx.lineTo(pos.x, pos.y);
//         ctx.stroke();
//     };

//     const stopDrawing = (e) => {
//         e.preventDefault();
//         setIsDrawing(false);
//     };

//     const handleSaveImage = () => {
//         const link = document.createElement('a');
//         link.download = `screenshot_${Date.now()}.png`;
//         link.href = canvasRef.current.toDataURL("image/png");
//         link.click();
//     };

//     const handleEraseAll = () => {
//         if (screenshotImage) {
//             const ctx = canvasRef.current.getContext("2d");
//             // Wczytaj obraz screenshotu (dataUrl) na canvas
//             const img = new window.Image();
//             img.src = screenshotImage;
//             img.onload = () => {
//                 ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//                 ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
//             };
//         }
//     };

//     return (
//         <div className={styles.background}>
//             <div className={styles.navbar}>
//                 <div>
//                     <BackButton path="/trener/videos" />
//                 </div>
//                 <div className={styles.writing_div}>
//                     Analiza Wideo
//                 </div>
//             </div>
//             <video
//                 ref={videoRef}
//                 width={400}
//                 controls
//                 crossOrigin="anonymous"
//                 src={videoUrl}
//             />
//             <div className={styles.buttonsContainer}>
//                 <button onClick={handlePlay}>Play</button>
//                 <button onClick={handlePause}>Pause</button>
//             </div>
//             <div className={styles.buttonsContainer}>
//                 <button onClick={() => handleSpeed(0.5)}>0.5x</button>
//                 <button onClick={() => handleSpeed(1)}>1x</button>
//                 <button onClick={() => handleSpeed(1.5)}>1.5x</button>
//                 <button onClick={() => handleSpeed(2)}>2x</button>
//             </div>
//             <div className={styles.buttonsContainer}>
//                 <button onClick={handleScreenshot}>Zrób screenshot</button>
//             </div>
//             {screenshot && (
//                 <>
//                 <div className={styles.buttonsContainer}>
//                     <canvas
//                         ref={canvasRef}
//                         style={{
//                             border: "1px solid #ccc",
//                             maxWidth: "100%",
//                             cursor: screenshot ? "crosshair" : "default"
//                         }}
//                         onMouseDown={startDrawing}
//                         onMouseMove={draw}
//                         onMouseUp={stopDrawing}
//                         onMouseLeave={stopDrawing}
//                         onTouchStart={startDrawing}
//                         onTouchMove={draw}
//                         onTouchEnd={stopDrawing}
//                     />
//                 </div>
//                 <div className={styles.buttonsContainer}>
//                     <label>
//                         Kolor:
//                         <input
//                             type="color"
//                             value={color}
//                             onChange={(e) => setColor(e.target.value)}
//                         />
//                     </label>
//                     <button onClick={handleEraseAll}>Cofnij zmiany</button>
//                     <button onClick={handleSaveImage}>Zapisz obraz</button>
//                 </div>
                
//                 </>
//             )}
//         </div>
//     );
// };

// export default Video;

import React, { useRef, useState, useEffect, useContext } from "react";
import { GlobalContext } from '../../GlobalContext';
import styles from './Video.module.css';

import BackButton from '../../BackButton';
import { useParams } from "react-router-dom";

const Video = () => {
    const { supabase } = useContext(GlobalContext);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [screenshot, setScreenshot] = useState(false);
    const [screenshotImage, setScreenshotImage] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("red");
    const { id_video } = useParams();
    const [videoInfo, setVideoInfo] = useState(null);
    const [needScreenshot, setNeedScreenshot] = useState(false); // steruje czy trzeba zrobić screenshot

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
            setVideoInfo(data);
            loadAndPlay(data[0].linki_wideo);
        }
    };

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

    // kliknięcie przycisku - tylko ustawienie flagi
    const handleScreenshot = () => {
        setScreenshot(true); // wyświetl canvas
        setNeedScreenshot(true); // zrób screenshot po renderze
    };

    // efekt wykona się TYLKO gdy canvas jest widoczny i needScreenshot == true
    useEffect(() => {
        if (screenshot && needScreenshot && canvasRef.current && videoRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            setScreenshotImage(dataUrl);
            setNeedScreenshot(false); // reset flagi
        }
    }, [screenshot, needScreenshot]);

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
            const img = new window.Image();
            img.src = screenshotImage;
            img.onload = () => {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            };
        }
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
                width={400}
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
            {screenshot && (
                <>
                <div className={styles.buttonsContainer}>
                    <canvas
                        ref={canvasRef}
                        style={{
                            border: "1px solid #ccc",
                            maxWidth: "100%",
                            cursor: screenshot ? "crosshair" : "default"
                        }}
                        onMouseDown={(e) => startDrawing(e)}
                        onMouseMove={(e) => draw(e)}
                        onMouseUp={(e) => stopDrawing(e)}
                        onMouseLeave={(e) => stopDrawing(e)}
                        onTouchStart={(e) => startDrawing(e)}
                        onTouchMove={(e) => draw(e)}
                        onTouchEnd={(e) => stopDrawing(e)}
                    />
                </div>
                <div className={styles.buttonsContainer}>
                    <label>
                        Kolor:
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </label>
                    <button onClick={handleEraseAll}>Cofnij zmiany</button>
                    <button onClick={handleSaveImage}>Zapisz obraz</button>
                </div>
                
                </>
            )}
        </div>
    );
};

export default Video;