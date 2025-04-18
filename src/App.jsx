import { useEffect, useState } from "react";
import background from './assets/wall.jpg';

const usernames = [
  "blacklytning",
  "DrNykterstein",
  "blapboi",
  "Fa_Mulan"
]; // your custom usernames here

function App() {
  const [blitzRatings, setBlitzRatings] = useState([]);
  const [bulletRatings, setBulletRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("blitz"); // Track the active tab

  // Fetch data for Blitz and Bullet
  useEffect(() => {
    const fetchRatings = async () => {
      const blitzResults = await Promise.all(
        usernames.map(async (username) => {
          try {
            const res = await fetch(`https://lichess.org/api/user/${username}`);
            const data = await res.json();
            return {
              username: data.username,
              blitzRating: data.perfs?.blitz?.rating || "N/A",
              bulletRating: data.perfs?.bullet?.rating || "N/A",
            };
          } catch (err) {
            console.error(`Failed to fetch ${username}`, err);
            return { username, blitzRating: "Error", bulletRating: "Error" };
          }
        })
      );
      // Sort blitz ratings
      const blitzSorted = blitzResults
        .filter(u => typeof u.blitzRating === 'number')
        .sort((a, b) => b.blitzRating - a.blitzRating);
      setBlitzRatings(blitzSorted);
      
      // Sort bullet ratings
      const bulletSorted = blitzResults
        .filter(u => typeof u.bulletRating === 'number')
        .sort((a, b) => b.bulletRating - a.bulletRating);
      setBulletRatings(bulletSorted);
    };

    fetchRatings();
  }, []);

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${background}), linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">Welcome to the Checkmate Club</h1>
        <p className="text-xl md:text-xl mb-10">Where Every Move Counts.</p>
        <a
          href="https://chat.whatsapp.com/HoAX4sKNxqpH8ba1faGuAh"
          target="_blank"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-4 px-8 rounded-2xl transition text-lg md:text-xl"
        >
          Join the Club
        </a>
        <a href="#leaderboard" className="mt-12 text-purple-300 underline hover:text-purple-500 text-lg md:text-xl">
          ↓ View Leaderboard
        </a>
      </div>

      {/* Leaderboard Section */}
      <div id="leaderboard" className="min-h-screen bg-black px-6 py-16">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-12 text-purple-400">Leaderboard</h2>

        {/* Tabs for Blitz and Bullet */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("blitz")}
            className={`py-2 px-6 text-lg md:text-2xl font-semibold mr-4 rounded-xl ${activeTab === "blitz" ? "bg-purple-700 text-white" : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"}`}
          >
            Blitz
          </button>
          <button
            onClick={() => setActiveTab("bullet")}
            className={`py-2 px-6 text-lg md:text-2xl font-semibold rounded-xl ${activeTab === "bullet" ? "bg-purple-700 text-white" : "bg-transparent text-purple-400 hover:bg-purple-700 hover:text-white"}`}
          >
            Bullet
          </button>
        </div>

        {/* Leaderboard Tables */}
        {activeTab === "blitz" && (
          <div className="max-w-4xl mx-auto bg-purple-950 bg-opacity-30 p-8 rounded-2xl shadow-xl">
            {blitzRatings.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-4 px-6 text-left text-2xl">Rank</th>
                    <th className="py-4 px-6 text-left text-2xl">Username</th>
                    <th className="py-4 px-6 text-left text-2xl">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {blitzRatings.map((user, index) => (
                    <tr key={user.username} className="border-b border-purple-700">
                      <td className="py-4 px-6 text-xl">{index + 1}</td>
                      <td className="py-4 px-6 text-xl">
                        <a
                          href={`https://lichess.org/@/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-300 hover:text-purple-500"
                        >
                          {user.username}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-xl">{user.blitzRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-xl">Loading Blitz leaderboard...</p>
            )}
          </div>
        )}

        {activeTab === "bullet" && (
          <div className="max-w-4xl mx-auto bg-purple-950 bg-opacity-30 p-8 rounded-2xl shadow-xl">
            {bulletRatings.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-4 px-6 text-left text-2xl">Rank</th>
                    <th className="py-4 px-6 text-left text-2xl">Username</th>
                    <th className="py-4 px-6 text-left text-2xl">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {bulletRatings.map((user, index) => (
                    <tr key={user.username} className="border-b border-purple-700">
                      <td className="py-4 px-6 text-xl">{index + 1}</td>
                      <td className="py-4 px-6 text-xl">
                        <a
                          href={`https://lichess.org/@/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-300 hover:text-purple-500"
                        >
                          {user.username}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-xl">{user.bulletRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-xl">Loading Bullet leaderboard...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

