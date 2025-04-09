import React, {useEffect, useState} from 'react';

const MatchResults = () => {
    const competitionId = "c1d31f66-f643-48f0-92ae-8dbe55bc3d01";
    const teamId = "7930be13-7c33-4925-ad11-d79eb361e975";
    const [matchIds, setMatchIds] = useState([]); // State to hold match IDs
    const [matchDetails, setMatchDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State to manage loading
    const [error, setError] = useState(null); // State to manage errors

    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const fetchMatchIdsAndDetails = async () => {
            try {
                const response = await fetch('https://open.faceit.com/data/v4/players/25681e1f-1f16-4b30-aa31-ce81933d8378/history?limit=1000', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`, // Send API key in the Authorization header
                        'Content-Type': 'application/json' // Ensure proper format
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch matches');
                }
                const data = await response.json();

                // Filter match_ids based on competition_id
                const filteredMatchIds = data.items
                    .filter(item => item.competition_id === competitionId)
                    .map(item => item.match_id);
                setMatchIds(filteredMatchIds); // Set match IDs in state\

                const matchDetailsArray = await Promise.all(
                    filteredMatchIds.map(async matchId => {
                        const matchResponse = await fetch(`https://open.faceit.com/data/v4/matches/${matchId}/stats`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${apiKey}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (!matchResponse.ok) {
                            throw new Error(`Failed to fetch details for match ID: ${matchId}`);
                        }

                        const matchData = await matchResponse.json();
                        const getWinResult = (winnerTeamId) => {
                            if (winnerTeamId === teamId) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }

                        return {
                            faction1: matchData.rounds[0].teams[0].team_stats.Team,
                            faction2: matchData.rounds[0].teams[1].team_stats.Team,
                            map: matchData.rounds[0].round_stats.Map,
                            score: matchData.rounds[0].round_stats.Score,
                            winner: getWinResult(matchData.rounds[0].round_stats.Winner),
                        };
                    })
                );

                setMatchDetails(matchDetailsArray);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMatchIdsAndDetails();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section id="match-results">
            <h2>Match Results</h2>
            <table className="results-table">
                <thead>
                <tr>
                    <th>Team 1</th>
                    <th>Team 2</th>
                    <th>Map</th>
                    <th>Score</th>
                    <th>Result</th>
                </tr>
                </thead>
                <tbody>
                {matchDetails.map((matchDetail, index) => (
                    <tr key={index}>
                        <td>{matchDetail.faction1}</td>
                        <td>{matchDetail.faction2}</td>
                        <td>{matchDetail.map}</td>
                        <td>{matchDetail.score}</td>
                        <td className={matchDetail.winner === 1 ? 'win' : 'loss'}>
                            {matchDetail.winner === 1 ? 'Win' : 'Lose'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
};

export default MatchResults;