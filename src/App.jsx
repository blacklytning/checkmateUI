import "./App.css";
import { useEffect, useState } from "react";
import background from "./assets/wall.jpg";
import { fetchUsernamesFromTeam } from "./usernames";
import {
    FaChessKing,
    FaChessQueen,
    FaChessRook,
    FaChessBishop,
    FaChessKnight,
    FaChessPawn,
    FaWhatsapp,
} from "react-icons/fa";
import { SiLichess } from "react-icons/si";

// Array of chess icons to choose randomly
const chessIcons = [
    FaChessKing,
    FaChessQueen,
    FaChessRook,
    FaChessBishop,
    FaChessKnight,
    FaChessPawn,
];

// Utility to assign a random icon to each user
const assignRandomIcons = (users) => {
    return users.map((user) => {
        const Icon = chessIcons[Math.floor(Math.random() * chessIcons.length)];
        return { ...user, icon: Icon };
    });
};

function App() {
    const [blitzRatings, setBlitzRatings] = useState([]);
    const [bulletRatings, setBulletRatings] = useState([]);
    const [rapidRatings, setRapidRatings] = useState([]);
    const [activeTab, setActiveTab] = useState("blitz");

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const usernames = await fetchUsernamesFromTeam();
                const usernamesString = usernames.join(',');

                const response = await fetch(`https://lichess.org/api/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: usernamesString
                });
                const usersData = await response.json();

                const results = usersData.map(user => {
                    // Helper function to process rating
                    const processRating = (rating, games) => {
                        // If rating is 1500 and games is 0, set to -9999 to ensure they're at the end
                        if (rating === 1500 && games === 0) return -9999;
                        return rating;
                    };

                    return {
                        username: user.username,
                        blitzRating: processRating(user.perfs?.blitz?.rating || 1500, user.perfs?.blitz?.games || 0),
                        bulletRating: processRating(user.perfs?.bullet?.rating || 1500, user.perfs?.bullet?.games || 0),
                        rapidRating: processRating(user.perfs?.rapid?.rating || 1500, user.perfs?.rapid?.games || 0),
                        rapidGames: user.perfs?.rapid?.games || 0,
                        blitzGames: user.perfs?.blitz?.games || 0,
                        bulletGames: user.perfs?.bullet?.games || 0,
                    };
                });

                const withIcons = assignRandomIcons(results);

                // Simple sort by rating (highest to lowest)
                setBlitzRatings([...withIcons].sort((a, b) => b.blitzRating - a.blitzRating));
                setBulletRatings([...withIcons].sort((a, b) => b.bulletRating - a.bulletRating));
                setRapidRatings([...withIcons].sort((a, b) => b.rapidRating - a.rapidRating));
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchRatings();
    }, []);

    const renderTable = (ratings, type) => (
        <div className="overflow-x-auto max-w-full md:max-w-4xl mx-auto bg-purple-950 bg-opacity-30 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            {ratings.length > 0 ? (
                <table className="min-w-full table-auto border-collapse text-sm sm:text-base">
                    <thead>
                        <tr className="border-b border-purple-700">
                            <th className="py-3 px-2 text-left">Rank</th>
                            <th className="py-3 px-2 text-left">Username</th>
                            <th className="py-3 px-2 text-left">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((user, index) => {
                            const Icon = user.icon;
                            return (
                                <tr
                                    key={`${type}-${user.username}`}
                                    className="border-b border-purple-700"
                                >
                                    <td className="py-3 px-2">{index + 1}</td>
                                    <td className="py-3 px-2 flex items-center space-x-2">
                                        <Icon size={16} className="text-purple-300" />
                                        <a
                                            href={`https://lichess.org/@/${user.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-300 hover:text-purple-500 break-all"
                                        >
                                            {user.username}
                                        </a>
                                    </td>
                                    <td className="py-3 px-2">
                                        {user[`${type}Rating`] === -9999
                                            ? <span>N/A</span>
                                            : user[`${type}Rating`]}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-base sm:text-lg">
                    Loading leaderboard...
                </p>
            )}
        </div>
    );

    return (
        <div className="text-white">
            {/* Hero Section */}
            <div
                className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 text-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url(${background})`,
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white">
                    Checkmate Club
                </h1>

                <p className="text-lg sm:text-xl mb-8 px-2">Where Every Move Counts.</p>

                <a
                    href="https://chat.whatsapp.com/HoAX4sKNxqpH8ba1faGuAh"
                    target="_blank"
                    className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-xl transition text-sm sm:text-base flex items-center space-x-3"
                >
                    <FaWhatsapp size={20} />
                    <span>Join the Club</span>
                </a>
                <a
                    href="https://lichess.org/team/checkmate-club-apsit"
                    target="_blank"
                    className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-xl transition text-sm sm:text-base flex items-center space-x-3"
                >
                    <SiLichess size={20} />
                    <span>Join Lichess Team</span>
                </a>
                <a
                    href="#leaderboard"
                    className="mt-30 text-purple-300 underline hover:text-purple-500 text-sm sm:text-base"
                >
                    ↓ View Leaderboard
                </a>
            </div>

            {/* Leaderboard Section */}
            <div
                id="leaderboard"
                className="min-h-screen bg-black px-4 py-12 sm:py-16"
            >
                <h2 className="text-3xl sm:text-5xl font-bold text-center mb-10 text-purple-400">
                    Leaderboard
                </h2>

                {/* Tabs */}
                <div className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
                    <button
                        onClick={() => setActiveTab("blitz")}
                        className={`py-1 px-4 sm:px-5 text-sm sm:text-base font-semibold rounded-lg flex items-center space-x-2 ${activeTab === "blitz"
                                ? "bg-purple-700 text-white"
                                : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"
                            }`}
                    >
                        <FaChessKing size={18} />
                        <span>Blitz</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("bullet")}
                        className={`py-1 px-4 sm:px-5 text-sm sm:text-base font-semibold rounded-lg flex items-center space-x-2 ${activeTab === "bullet"
                                ? "bg-purple-700 text-white"
                                : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"
                            }`}
                    >
                        <FaChessBishop size={18} />
                        <span>Bullet</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("rapid")}
                        className={`py-1 px-4 sm:px-5 text-sm sm:text-base font-semibold rounded-lg flex items-center space-x-2 ${activeTab === "rapid"
                                ? "bg-purple-700 text-white"
                                : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"
                            }`}
                    >
                        <FaChessKnight size={18} />
                        <span>Rapid</span>
                    </button>
                </div>

                {/* Render Table */}
                {activeTab === "blitz" && renderTable(blitzRatings, "blitz")}
                {activeTab === "bullet" && renderTable(bulletRatings, "bullet")}
                {activeTab === "rapid" && renderTable(rapidRatings, "rapid")}
            </div>
        </div>
    );
}

export default App;

