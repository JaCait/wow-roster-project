import React, { useEffect, useState } from 'react';
import { getPlayers, addPlayer, deletePlayer } from '../api/players';
import Select from 'react-select';

export default function PlayerList() {
    useEffect(() => {
        async function fetchPlayers() {
            const data = await getPlayers();
            setPlayers(data);
        }
        fetchPlayers();
    }, []);

    const [players, setPlayers] = useState([]);
    const [playerData, setPlayerData] = useState({
        playerName: "",
        playerServer: "",
        playerClass: "",
        playerSpec: "",
    });
    const [deleteId, setDeleteId] = useState("");

    const classSpecs = {
        "Death Knight": ["Blood", "Frost", "Unholy"],
        "Demon Hunter": ["Havoc", "Vengeance"],
        "Druid": ["Balance", "Feral", "Guardian", "Restoration"],
        "Evoker": ["Augmentation", "Devastation", "Preservation"],
        "Hunter": ["Beast Mastery", "Marksmanship", "Survival"],
        "Mage": ["Arcane", "Fire", "Frost"],
        "Monk": ["Brewmaster", "Mistweaver", "Windwalker"],
        "Paladin": ["Holy", "Protection", "Retribution"],
        "Priest": ["Discipline", "Holy", "Shadow"],
        "Rogue": ["Assassination", "Outlaw", "Subtlety"],
        "Shaman": ["Elemental", "Enhancement", "Restoration"],
        "Warlock": ["Affliction", "Demonology", "Destruction"],
        "Warrior": ["Arms", "Fury", "Protection"]
    }
    
    const classColors = {
        "Death Knight": "#C41E3A",
        "Demon Hunter": "#A330C9",
        "Druid": "#FF7C0A",
        "Evoker": "#33937F",
        "Hunter": "#AAD372",
        "Mage": "#3FC7EB",
        "Monk": "#00FF98",
        "Paladin": "#F48CBA",
        "Priest": "#FFFFFF",
        "Rogue": "#FFF468",
        "Shaman": "#0070DD",
        "Warlock": "#8788EE",
        "Warrior": "#C69B6D"
    } 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlayerData((prevPlayerData) => ({
            ...prevPlayerData,
            [name]: value,
        }));
    }

    const handleClassChange = (e) => {
        const selectedClass = e.target.value;
        setPlayerData((prevPlayerData) => ({
            ...prevPlayerData,
            playerClass: selectedClass,
            playerSpec: selectedClass ? classSpecs[selectedClass][0] : "",
        }));
    }

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        try {
            const newPlayer = await addPlayer(playerData);
            setPlayers(prev => [...prev, newPlayer]);
            setPlayerData({
                playerName: "",
                playerServer: "",
                playerClass: "",
                playerSpec: "",
            });
        } catch (err) {
            console.error('Error: ', err);
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();

        if(!deleteId) return;
        try {
            const deletedPlayer = await deletePlayer(deleteId);
            setPlayers(prev => prev.filter(player => player.id !== deleteId))
            setDeleteId("");
        } catch (err) {
            console.log('Error: ' + err);
        }
    };

    return(
        <div>
            <h2 className="text-lg font-semibold mb-2">Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id} name={player.id}>
                        {player.name} - {player.server} - {player.class} - {player.spec}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddSubmit} className='flex flex-col gap-2 w-64'>
                <label> Name:
                    <input 
                        type="text"
                        name="playerName"
                        value={playerData.playerName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label> Server:
                    <input
                        type="text"
                        name="playerServer"
                        value={playerData.playerServer}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label> Class:
                    <select
                        style={{color: classColors[playerData.playerClass] || "#ffffff"}}
                        name="playerClass" 
                        value={playerData.playerClass} 
                        onChange={handleClassChange}
                        required
                    >
                        <option value="" hidden>Class</option>
                        {Object.keys(classSpecs).map((cls) => (
                            <option key={cls} value={cls} style={{color: classColors[cls]}}>{cls}</option>
                        ))}
                    </select>
                </label>
                {playerData.playerClass &&
                    <label> Spec:
                        <select
                            style={{color: classColors[playerData.playerClass] || "#ffffff"}}
                            name="playerSpec"
                            value={playerData.playerSpec}
                            onChange={handleInputChange}
                            isDisabled={!playerData.playerClass}
                        >
                            {playerData.playerClass && 
                            classSpecs[playerData.playerClass].map((spec) => (
                                <option key={spec} value={spec} >{spec}</option>
                            ))
                            }
                        </select>
                    </label>
                }
                
                <button type="submit">Add</button>
            </form>
            <form onSubmit={handleDeleteSubmit}>
                <label> id:
                    <input
                        type="text"
                        name="playerId"
                        onChange={(e) => setDeleteId(e.target.value)}
                    />
                </label>
                <button type="submit">Delete</button>
            </form>
        </div>
    );
}