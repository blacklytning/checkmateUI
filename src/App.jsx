import { useEffect, useState } from "react";
import background from "./assets/wall.jpg";
import { Link as ScrollLink } from "react-scroll";

const usernames = [
  "blacklytning",
  "DrNykterstein",
  "Hikaru",
  "AlirezaFirouzja2003",
];

function App() {
  const [blitzRatings, setBlitzRatings] = useState([]);
  const [bulletRatings, setBulletRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      const results = await Promise.all(
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
      const sortedBlitz = results
        .filter((u) => typeof u.blitzRating === "number")
        .sort((a, b) => b.blitzRating - a.blitzRating);

      const sortedBullet = results
        .filter((u) => typeof u.bulletRating === "number")
        .sort((a, b) => b.bulletRating - a.bulletRating);

      setBlitzRatings(sortedBlitz);
      setBulletRatings(sortedBullet);
    };

    fetchRatings();
  }, []);

  return (
    <div className="text-white scroll-smooth">
      {/* Hero Section */}
      <div
        className="relative min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.8)), url(${background})`,
        }}
      >
        <h1 className="text-5xl font-extrabold mb-6 text-white shadow-md">
          Welcome to Checkmate Club
        </h1>
        <p className="text-xl mb-10 text-purple-300">
          Where Every Move Counts.
        </p>
        <a
          href="https://chat.whatsapp.com/HoAX4sKNxqpH8ba1faGuAh"
          target="_blank"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-6 rounded-2xl transition"
        >
          Join the Club
        </a>
        <ScrollLink
          to="leaderboard"
          smooth={true}
          duration={500}
          offset={-20}
          className="mt-10 text-purple-300 underline hover:text-purple-500 cursor-pointer"
        >
          ↓ View Leaderboard
        </ScrollLink>

        {/* Smooth Fade to Black */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      </div>

      {/* Leaderboard Section */}
      <div id="leaderboard" className="min-h-screen bg-black px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-400">
          Blitz Leaderboard
        </h2>

        {/* Blitz Table */}
        <div className="overflow-x-auto max-w-4xl mx-auto bg-purple-950 bg-opacity-30 p-6 rounded-2xl shadow-xl mb-12">
          <table className="w-full text-left border-collapse">
            <thead className="text-purple-300">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Blitz Rating</th>
              </tr>
            </thead>
            <tbody>
              {blitzRatings.length > 0 ? (
                blitzRatings.map((user, index) => (
                  <tr
                    key={user.username}
                    className="border-t border-purple-700 hover:bg-purple-800 hover:bg-opacity-30 transition"
                  >
                    <td className="py-3 px-4 font-semibold">{index + 1}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://lichess.org/@/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 hover:underline"
                      >
                        {user.username}
                      </a>
                    </td>
                    <td className="py-3 px-4">{user.blitzRating}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading leaderboard...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bullet Table */}
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-400">
          Bullet Leaderboard
        </h2>
        <div className="overflow-x-auto max-w-4xl mx-auto bg-purple-950 bg-opacity-30 p-6 rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead className="text-purple-300">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Bullet Rating</th>
              </tr>
            </thead>
            <tbody>
              {bulletRatings.length > 0 ? (
                bulletRatings.map((user, index) => (
                  <tr
                    key={user.username}
                    className="border-t border-purple-700 hover:bg-purple-800 hover:bg-opacity-30 transition"
                  >
                    <td className="py-3 px-4 font-semibold">{index + 1}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://lichess.org/@/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 hover:underline"
                      >
                        {user.username}
                      </a>
                    </td>
                    <td className="py-3 px-4">{user.bulletRating}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading leaderboard...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

