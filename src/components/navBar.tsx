"use client";
import { SetStateAction, useState } from "react";
import Link from "next/link";

export default function NavBar() {
    const [activeLink, setActiveLink] = useState("");



    const handleClick = (linkName: SetStateAction<string>) => {
        setActiveLink(linkName); // Met à jour l'état avec le nom du lien cliqué
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-900 text-gray-100">
            <nav className="flex space-x-4">
                <Link href="/" passHref>
                    <span
                        onClick={() => handleClick("Chronomètre")}
                        className={`text-xl font-bold hover:underline ${activeLink === "Chronomètre" ? "text-blue-500" : ""
                            }`}
                    >
                        Chronomètre
                    </span>
                </Link>
                <Link href="/compte-a-rebours" passHref>
                    <span
                        onClick={() => handleClick("Compte à rebours")}
                        className={`text-xl font-bold hover:underline ${activeLink === "Compte à rebours" ? "text-blue-500" : ""
                            }`}
                    >
                        Compte à rebours
                    </span>
                </Link>

            </nav>
        </div>
    );
}