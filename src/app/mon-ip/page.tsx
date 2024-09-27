async function fetchIp() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'IP:", error);
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

export default async function MonIp() {
    const ip = await fetchIp();
    const geoInfo = await fetchGeoInfo(ip);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center bg-gray-300 rounded-lg space-y-4 p-8">
                <h1 className="text-3xl font-bold">Mon IP</h1>
                <p>Adresse IP: {ip}</p>
                {geoInfo ? (
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
                ) : (
                    <p>Impossible de récupérer les informations géographiques</p>
                )}
            </div>

          
        </div>
    );
}