"use client";
import { useState, useRef, useEffect } from "react";

interface TimeMemo {
    time: number;
    note: string;
}

export default function Chrono() {
    const [time, setTime] = useState(0); // Temps écoulé
    const [running, setRunning] = useState(false); // Si le chrono tourne ou non
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Stocke l'ID de l'intervalle
    const lastStartTimeRef = useRef(0); // Stocke l'heure où le chrono est lancé (pas le temps global)
    const [timeMemo, setTimeMemo] = useState<TimeMemo[]>([]);

    function start() {
        setRunning(true);
        lastStartTimeRef.current = Date.now() - time;// On soustrait le temps écoulé pour reprendre là où on s'était arrêté
        intervalRef.current = setInterval(() => {
            setTime(Date.now() - lastStartTimeRef.current); // Calcule le temps écoulé depuis le dernier démarrage
        }, 10);
    }

    function stop() {
        setRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Arrête l'intervalle
            intervalRef.current = null;
        }
    }

    function resetTime() {
        setTime(0); // Réinitialise à zéro
        setRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    // Formater le temps en HH:MM:SS:ms
    function formatTime(ms: number) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor(ms % 1000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    function rememberTime() {
        setTimeMemo((prevTimeMemo) => {
            return [...prevTimeMemo, { time, note: "" }];
        });
    }

    function deleteMemo(index: number) {
        setTimeMemo((prevTimeMemo) => {
            return prevTimeMemo.filter((_, i) => i !== index);
        });
    }


    function exportMemosToCSV() {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Time,Note\n"
            + timeMemo.map(memo => `${formatTime(memo.time)},${memo.note}`).join("\n");
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", encodeURI(csvContent));
        downloadAnchorNode.setAttribute("download", "time_memos.csv");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Chronomètre</h1>
            <p className="text-2xl font-mono mb-4">{formatTime(time)}</p>
            <div className="space-x-4">
                <button
                    onClick={running ? stop : start}
                    className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded"
                >
                    {running ? "Stop" : "Start"}
                </button>
                <button
                    onClick={rememberTime}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                >
                    Retenir
                </button>
                <button
                    onClick={resetTime}
                    className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded"
                >
                    Reset
                </button>
                {timeMemo.length > 0 ? <button

                    onClick={exportMemosToCSV}
                    className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded"
                >
                    Exporter en CSV
                </button> : null}
            </div>

            {timeMemo.length > 0 ? <div className="text-lg justify-between mt-4 flex w-full max-w-md">
                <p className="w-1/3">Time</p>
                <p className="w-1/3">Note</p>
                <button
                    onClick={() => setTimeMemo([])}
                    className="w-1/3 px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded"
                >Tout supprimer</button>
            </div>
                : null}

            <div className="w-full max-w-md">
                {timeMemo.map((memo, index) => (
                    <div key={index} className="flex items-center justify-between text-lg mt-2">
                        <span className="font-bold mr-2">{index + 1}.</span>
                        <span className="font-bold mr-2">{formatTime(memo.time)}</span>
                        <input
                            className="flex-1 px-2 py-1 bg-gray-800 text-gray-100 rounded"
                            type="text"
                            value={memo.note}
                            onChange={(e) => {
                                const newTimeMemo = [...timeMemo];
                                newTimeMemo[index].note = e.target.value;
                                setTimeMemo(newTimeMemo);
                            }}
                        />
                        <button
                            onClick={() => deleteMemo(index)}
                            className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}