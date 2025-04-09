import React, { useState, useEffect } from 'react';
import levelIcon1 from '../assets/images/level-icon-1.png';
import levelIcon2 from '../assets/images/level-icon-2.png';
import levelIcon3 from '../assets/images/level-icon-3.png';
import levelIcon4 from '../assets/images/level-icon-4.png';
import levelIcon5 from '../assets/images/level-icon-5.png';
import levelIcon6 from '../assets/images/level-icon-6.png';
import levelIcon7 from '../assets/images/level-icon-7.png';
import levelIcon8 from '../assets/images/level-icon-8.png';
import levelIcon9 from '../assets/images/level-icon-9.png';
import levelIcon10 from '../assets/images/level-icon-10.png';

const TeamRoster = () => {
    const [players, setPlayers] = useState([]); // Array to store multiple players
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define your team members with both nickname and role.
    const teamMembers = [
        { nickname: 'sublimage', role: 'AWPer' },
        { nickname: '-Pr1ck', role: 'Rifler' },
        { nickname: 'Maliuvera', role: 'In Game Leader' },
        { nickname: '-aR1za', role: 'Rifler' },
        { nickname: 'ez4nighty06', role: 'Rifler' },
    ];

    // Helper function to choose an Elo icon based on the Elo value
    const getEloIcon = (elo) => {
        if (elo >= 2001) {
            return levelIcon10;
        } else if (elo >= 1751) {
            return levelIcon9;
        } else if (elo >= 1531) {
            return levelIcon8;
        } else if (elo >= 1351) {
            return levelIcon7;
        } else if (elo >= 1201) {
            return levelIcon6;
        } else if (elo >= 1051) {
            return levelIcon5;
        } else if (elo >= 901) {
            return levelIcon4;
        } else if (elo >= 751) {
            return levelIcon3;
        } else if (elo >= 501) {
            return levelIcon2;
        } else if (elo >= 100) {
            return levelIcon1;
        }
    };

    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY;

        // Map over each team member to generate fetch promises.
        const fetchPlayers = teamMembers.map((member) =>
            fetch(`https://open.faceit.com/data/v4/players?nickname=${member.nickname}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data for ${member.nickname}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    // Add the role from our teamMembers list into the fetched data.
                    return { ...data, role: member.role };
                })
        );

        // Run all fetch calls concurrently
        Promise.all(fetchPlayers)
            .then((arrayOfPlayers) => {
                setPlayers(arrayOfPlayers);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!players || players.length === 0) return <p>No player data available.</p>;

    return (
        <section id="team-roster">
            <h2>Team Roster</h2>
            <div className="cards-container">
                {players.map((player, index) => (
                    <div key={player.guid ? player.guid : index} className="player-card">
                        <img src={player.avatar} alt={`${player.nickname}`} />
                        <h3>{player.nickname}</h3>
                        {/* Display the custom role from our mapping */}
                        <p>{player.role}</p>
                        <div className="faceit-stats">
                            <img
                                src={getEloIcon(player.games.cs2.faceit_elo)}
                                alt="Faceit Level Icon"
                                className="faceit-level-icon"
                            />
                            <p>{player.games.cs2.faceit_elo} Elo</p>
                        </div>
                        <a href={player.faceit_url} target="_blank" rel="noopener noreferrer">
                            <button>Profile</button>
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TeamRoster;
