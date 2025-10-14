const API_URL = 'http://localhost:5000/api/players';

export async function getPlayers() {
    const res = await fetch(API_URL);
    return res.json();
}

export async function addPlayer(playerData) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
    });
    return res.json();
}

export async function deletePlayer(uid) {
    const res = await fetch(`${API_URL}/${uid}`, { 
        method: "DELETE",
    });
    return res.json();
}