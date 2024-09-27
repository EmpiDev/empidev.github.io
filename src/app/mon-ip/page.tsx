"use client";
import { useState, useEffect } from "react";

async function fetchIp() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP:", error);
        return null;
    }
}

async function fetchGeoInfo(ip: string) {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des informations géographiques:", error);
        return null;
    }
}

export default function MonIp() {
    const [ip, setIp] = useState<string | null>(null);
    interface GeoInfo {
        city: string;
        regionName: string;
        country: string;
    }

    const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadIpInfo = async () => {
            setLoading(true);
            setError(null);
            const ip = await fetchIp();
            if (ip) {
                setIp(ip);
                const geoInfo = await fetchGeoInfo(ip);
                setGeoInfo(geoInfo);
            } else {

                setError("Impossible de récupérer l'adresse IP.");
            }
            setLoading(false);
        };

        loadIpInfo();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center bg-gray-300 rounded-lg space-y-4 p-8">
                <h1 className="text-3xl font-bold">Mon IP</h1>
                {loading ? (
                    <p className="text-lg">Chargement...</p>
                ) : error ? (
                    <p className="text-lg text-red-500">{error}</p>
                ) : (
                    <>
                        <p className="text-lg">Adresse IP: {ip}</p>
                        {geoInfo && (
                            <div className="space-y-2">
                                <p className="text-lg">
                                    <span className="font-bold">Ville:</span> {geoInfo.city}
                                </p>
                                <p className="text-lg">
                                    <span className="font-bold">Région:</span> {geoInfo.regionName}
                                </p>
                                <p className="text-lg">
                                    <span className="font-bold">Pays:</span> {geoInfo.country}
                                </p>
                            </div>
                        )}
                    </>
                )}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Rafraîchir
                </button>
            </div>
        </div>
    );
}