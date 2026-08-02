import React, { useEffect, useState } from 'react';
import clubApi from '../api/clubApi';

function Clubs() {
    const [clubs, setClubs] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadClubs();
    }, []);

    const loadClubs = async () => {
        try {
            const response = await clubApi.getAll();
            setClubs(response.data);
        } catch (error) {
            console.error(error);
            setMessage('Failed to load clubs.');
        } finally {
            setLoading(false);
        }
    };

    const viewMembers = async (club) => {
        try {
            const response = await clubApi.getMembers(club.id);
            setSelectedClub(club);
            setMembers(response.data);
        } catch (error) {
            console.error(error);
            setMessage('Failed to load members.');
        }
    };

    return (
        <div className="page">
            <h1>Clubs</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Club Name</th>
                        <th>Description</th>
                        <th>Created By</th>
                        <th>Members</th>
                    </tr>
                    </thead>

                    <tbody>
                    {clubs.map((club) => (
                        <tr key={club.id}>
                            <td>{club.name}</td>
                            <td>{club.description}</td>
                            <td>{club.createdById}</td>
                            <td>
                                <button onClick={() => viewMembers(club)}>
                                    View Members
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedClub && (
                <>
                    <h2>{selectedClub.name} Members</h2>

                    <table>
                        <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Role</th>
                        </tr>
                        </thead>

                        <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td>{member.userId}</td>
                                <td>{member.roleInClub}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}

export default Clubs;