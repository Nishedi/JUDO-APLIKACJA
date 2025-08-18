// import React, { useRef, useState, useEffect, useContext } from "react";
// import { GlobalContext } from '../../GlobalContext';
// import styles from './Video.module.css';
// import BackButton from '../../BackButton';
// import { useParams } from "react-router-dom";

// const Video = () => {
//     const { supabase } = useContext(GlobalContext);
//     const videoRef = useRef(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [videoUrl, setVideoUrl] = useState(null);
//     const [screenshot, setScreenshot] = useState(false);
//     const [color, setColor] = useState("red");
//     const { id_video } = useParams();
//     const [videoInfo, setVideoInfo] = useState(null);

//     // Tablica canvasów (screenshots)
//     const [canvases, setCanvases] = useState([]);
//     const [activeCanvasIdx, setActiveCanvasIdx] = useState(null);
//     const canvasRefs = useRef([]);

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

//     // Dodawanie nowego canvas po screenshocie
//     const handleScreenshot = () => {
//         const video = videoRef.current;
//         if (!video) return;
//         const width = video.videoWidth;
//         const height = video.videoHeight;
//         // Tworzymy nowy canvas
//         setCanvases(prev => ([...prev, { image: null, width, height }]));
//         setScreenshot(true);
//         setTimeout(() => {
//             // Rysujemy klatkę z video na nowym canvasie
//             const idx = canvases.length;
//             canvasRefs.current[idx] = canvasRefs.current[idx] || React.createRef();
//             const canvas = canvasRefs.current[idx].current;
//             if (canvas) {
//                 canvas.width = width;
//                 canvas.height = height;
//                 const ctx = canvas.getContext("2d");
//                 ctx.drawImage(video, 0, 0, width, height);
//                 // Zapisz obraz bazowy
//                 const image = canvas.toDataURL("image/png");
//                 setCanvases(prev => {
//                     const copy = [...prev];
//                     copy[idx].image = image;
//                     return copy;
//                 });
//                 setActiveCanvasIdx(idx);
//             }
//         }, 50);
//     };

//     // Funkcje rysowania
//     const getCanvasPos = (e, idx) => {
//         const canvas = canvasRefs.current[idx].current;
//         const rect = canvas.getBoundingClientRect();
//         let clientX, clientY;
//         if (e.touches && e.touches.length > 0) {
//             clientX = e.touches[0].clientX;
//             clientY = e.touches[0].clientY;
//         } else {
//             clientX = e.clientX;
//             clientY = e.clientY;
//         }
//         const x = (clientX - rect.left) * (canvas.width / rect.width);
//         const y = (clientY - rect.top) * (canvas.height / rect.height);
//         return { x, y };
//     };

//     const [isDrawing, setIsDrawing] = useState(false);

//     const startDrawing = (e, idx) => {
//         if (activeCanvasIdx !== idx) return;
//         const ctx = canvasRefs.current[idx].current.getContext("2d");
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 3;
//         ctx.lineJoin = "round";
//         ctx.lineCap = "round";
//         const pos = getCanvasPos(e, idx);
//         ctx.beginPath();
//         ctx.moveTo(pos.x, pos.y);
//         setIsDrawing(true);
//     };

//     const draw = (e, idx) => {
//         if (!isDrawing || activeCanvasIdx !== idx) return;
//         const ctx = canvasRefs.current[idx].current.getContext("2d");
//         ctx.strokeStyle = color;
//         ctx.lineWidth = 3;
//         const pos = getCanvasPos(e, idx);
//         ctx.lineTo(pos.x, pos.y);
//         ctx.stroke();
//     };

//     const stopDrawing = (e, idx) => {
//         if (activeCanvasIdx !== idx) return;
//         setIsDrawing(false);
//     };

//     // Cofnij zmiany tylko na aktywnym canvasie
//     const handleEraseAll = () => {
//         if (activeCanvasIdx === null) return;
//         const baseImage = canvases[activeCanvasIdx].image;
//         const canvas = canvasRefs.current[activeCanvasIdx].current;
//         if (baseImage && canvas) {
//             const ctx = canvas.getContext("2d");
//             const img = new window.Image();
//             img.src = baseImage;
//             img.onload = () => {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//                 ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//             };
//         }
//     };

//     const handleSaveImage = () => {
//         if (activeCanvasIdx === null) return;
//         const canvas = canvasRefs.current[activeCanvasIdx].current;
//         const link = document.createElement('a');
//         link.download = `screenshot_${Date.now()}.png`;
//         link.href = canvas.toDataURL("image/png");
//         link.click();
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
//             {canvases.length > 0 && (
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px" }}>
//                     {canvases.map((canvasData, idx) => (
//                         <div key={idx} style={{ position: "relative" }}>
//                             <canvas
//                                 ref={canvasRefs.current[idx] = canvasRefs.current[idx] || React.createRef()}
//                                 width={canvasData.width}
//                                 height={canvasData.height}
//                                 style={{
//                                     border: activeCanvasIdx === idx ? "3px solid #f00" : "1px solid #ccc",
//                                     maxWidth: "300px",
//                                     cursor: activeCanvasIdx === idx ? "crosshair" : "pointer"
//                                 }}
//                                 onClick={() => setActiveCanvasIdx(idx)}
//                                 onMouseDown={e => startDrawing(e, idx)}
//                                 onMouseMove={e => draw(e, idx)}
//                                 onMouseUp={e => stopDrawing(e, idx)}
//                                 onMouseLeave={e => stopDrawing(e, idx)}
//                                 onTouchStart={e => startDrawing(e, idx)}
//                                 onTouchMove={e => draw(e, idx)}
//                                 onTouchEnd={e => stopDrawing(e, idx)}
//                             />
//                             {activeCanvasIdx === idx && (
//                                 <div style={{
//                                     position: "absolute", top: 0, left: 0, background: "#fff8", padding: 4, fontSize: 12
//                                 }}>Edytujesz</div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//             {activeCanvasIdx !== null && (
//                 <>
//                     <div className={styles.buttonsContainer}>
//                         <label>
//                             Kolor:
//                             <input
//                                 type="color"
//                                 value={color}
//                                 onChange={(e) => setColor(e.target.value)}
//                             />
//                         </label>
//                         <button onClick={handleEraseAll}>Cofnij zmiany</button>
//                         <button onClick={handleSaveImage}>Zapisz obraz</button>
//                     </div>
                    
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

const ImageProcessing = ({ image, width, height }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("red");
    const [comment, setComment] = useState("");

    useEffect(() => {
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

    const handleSaveImage = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `screenshot_${Date.now()}.png`;
            link.href = canvasRef.current.toDataURL("image/png");
            link.click();
        }
    };

    return (
        <div style={{ position: "relative", marginBottom: 32 }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: "2px solid #ccc",
                    maxWidth: "300px",
                    cursor: "crosshair"
                }}
                onMouseDown={(e) => startDrawing(e)}
                onMouseMove={(e) => draw(e)}
                onMouseUp={(e) => stopDrawing(e)}
                onMouseLeave={(e) => stopDrawing(e)}
                onTouchStart={(e) => startDrawing(e)}
                onTouchMove={(e) => draw(e)}
                onTouchEnd={(e) => stopDrawing(e)}
            />
            <div className={styles.buttonsContainer} style={{ marginTop: 8 }}>
                <label>
                    Kolor:
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ marginLeft: 8 }}
                    />
                </label>
                <button onClick={handleEraseAll} style={{ marginLeft: 8 }}>Cofnij zmiany</button>
                <button onClick={handleSaveImage} style={{ marginLeft: 8 }}>Zapisz obraz</button>
            </div>
            <div style={{ marginTop: 8 }}>Komentarz</div>
            <textarea
                rows={4}
                className={styles.multiLineInput}
                placeholder="Wpisz komentarz"
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: "100%", maxWidth: "300px" }}
            />
        </div>
    )
};

const Video = () => {
    const { supabase } = useContext(GlobalContext);
    const videoRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const { id_video } = useParams();
    const [videoInfo, setVideoInfo] = useState(null);
    const [screenshots, setScreenshots] = useState([]);

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

    const handleScreenshot = () => {
        const video = videoRef.current;
        if (!video) return;
        const width = video.videoWidth;
        const height = video.videoHeight;

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        const ctx = offscreenCanvas.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);
        const image = offscreenCanvas.toDataURL("image/png");

        setScreenshots(prev => ([...prev, { image, width, height }]));
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
            {screenshots.length > 0 && (
                <div>
                    {screenshots.map((data, idx) => (
                        <ImageProcessing
                            key={idx}
                            image={data.image}
                            width={data.width}
                            height={data.height}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Video;