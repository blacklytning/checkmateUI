import './App.css';
import { useEffect, useState } from "react";
import background from './assets/wall.jpg';
import usernames from "./usernames";
import { FaChessKing, FaChessBishop, FaChessKnight, FaWhatsapp } from 'react-icons/fa';
import { SiLichess } from "react-icons/si";

function App() {
  const [blitzRatings, setBlitzRatings] = useState([]);
  const [bulletRatings, setBulletRatings] = useState([]);
  const [rapidRatings, setRapidRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("blitz");

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsResults = await Promise.all(
        usernames.map(async (username) => {
          try {
            const res = await fetch(`https://lichess.org/api/user/${username}`);
            const data = await res.json();
            return {
              username: data.username,
              blitzRating: data.perfs?.blitz?.rating || "N/A",
              bulletRating: data.perfs?.bullet?.rating || "N/A",
              rapidRating: data.perfs?.rapid?.rating || "N/A",
            };
          } catch (err) {
            console.error(`Failed to fetch ${username}`, err);
            return { username, blitzRating: "Error", bulletRating: "Error", rapidRating: "Error" };
          }
        })
      );

      setBlitzRatings(
        ratingsResults
          .filter(u => typeof u.blitzRating === 'number')
          .sort((a, b) => b.blitzRating - a.blitzRating)
      );
      setBulletRatings(
        ratingsResults
          .filter(u => typeof u.bulletRating === 'number')
          .sort((a, b) => b.bulletRating - a.bulletRating)
      );
      setRapidRatings(
        ratingsResults
          .filter(u => typeof u.rapidRating === 'number')
          .sort((a, b) => b.rapidRating - a.rapidRating)
      );
    };

    fetchRatings();
  }, []);

  const renderTable = (ratings, type) => (
    <div className="max-w-4xl mx-auto bg-purple-950 bg-opacity-30 p-8 rounded-2xl shadow-xl">
      {ratings.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b border-purple-700">
              <th className="py-4 px-6 text-left text-2xl">Rank</th>
              <th className="py-4 px-6 text-left text-2xl">Username</th>
              <th className="py-4 px-6 text-left text-2xl">Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((user, index) => (
              <tr key={`${type}-${user.username}`} className="border-b border-purple-700">
                <td className="py-4 px-6 text-xl">{index + 1}</td>
                <td className="py-4 px-6 text-xl flex items-center space-x-2">
                  <SiLichess size={20} className="text-purple-300" />
                  <a
                    href={`https://lichess.org/@/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-purple-500"
                  >
                    {user.username}
                  </a>
                </td>
                <td className="py-4 px-6 text-xl">{user[`${type}Rating`]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-xl">Loading {type.charAt(0).toUpperCase() + type.slice(1)} leaderboard...</p>
      )}
    </div>
  );

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${background}), linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1))`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-white text-6xl md:text-7xl">
            Checkmate Club
          </span>
        </h1>
        
        <p className="text-xl md:text-xl mb-10">Where Every Move Counts.</p>
        
        <a
          href="https://chat.whatsapp.com/HoAX4sKNxqpH8ba1faGuAh"
          target="_blank"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-4 px-8 rounded-2xl transition text-lg md:text-xl flex items-center justify-center space-x-4"
        >
          <FaWhatsapp size={24} />
          <span>Join the Club</span>
        </a>
        
        <a href="#leaderboard" className="mt-12 text-purple-300 underline hover:text-purple-500 text-lg md:text-xl">
          ↓ View Leaderboard
        </a>
      </div>

      {/* Leaderboard Section */}
      <div id="leaderboard" className="min-h-screen bg-black px-6 py-16">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 text-purple-400">Leaderboard</h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-6">
          <button
            onClick={() => setActiveTab("blitz")}
            className={`py-2 px-6 text-lg md:text-2xl font-semibold rounded-xl flex items-center space-x-2 ${activeTab === "blitz" ? "bg-purple-700 text-white" : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"}`}
          >
            <FaChessKing size={24} />
            <span>Blitz</span>
          </button>
          <button
            onClick={() => setActiveTab("bullet")}
            className={`py-2 px-6 text-lg md:text-2xl font-semibold rounded-xl flex items-center space-x-2 ${activeTab === "bullet" ? "bg-purple-700 text-white" : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"}`}
          >
            <FaChessBishop size={24} />
            <span>Bullet</span>
          </button>
          <button
            onClick={() => setActiveTab("rapid")}
            className={`py-2 px-6 text-lg md:text-2xl font-semibold rounded-xl flex items-center space-x-2 ${activeTab === "rapid" ? "bg-purple-700 text-white" : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"}`}
          >
            <FaChessKnight size={24} />
            <span>Rapid</span>
          </button>
        </div>

        {/* Render Leaderboard */}
        {activeTab === "blitz" && renderTable(blitzRatings, "blitz")}
        {activeTab === "bullet" && renderTable(bulletRatings, "bullet")}
        {activeTab === "rapid" && renderTable(rapidRatings, "rapid")}
      </div>
    </div>
  );
}

export default App;

