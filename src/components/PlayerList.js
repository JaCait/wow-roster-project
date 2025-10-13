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

    const handleSubmit = async (e) => {
        e.preventDefault(); // zapobiega przeładowaniu strony

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

    return(
        <div>
            <h2 className="text-lg font-semibold mb-2">Players</h2>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>
                        {player.name} - {player.server} - {player.class} - {player.spec}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-64'>
                <label> Name:
                    <input 
                        type="text"
                        name="playerName"
                        value={playerData.playerName}
                        onChange={handleInputChange}
                    />
                </label>
                <label> Server:
                    <input
                        type="text"
                        name="playerServer"
                        value={playerData.playerServer}
                        onChange={handleInputChange}
                    />
                </label>
                <label> Class:
                    <select
                        style={{color: classColors[playerData.playerClass] || "#ffffff"}}
                        name="playerClass" 
                        value={playerData.playerClass} 
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Class</option>
                        {Object.keys(classSpecs).map((cls) => (
                            <option key={cls} value={cls} style={{color: classColors[cls]}}>{cls}</option>
                        ))}
                    </select>
                </label>
                <label> Spec:
                    <select
                        style={{color: classColors[playerData.playerClass] || "#ffffff"}}
                        name="playerSpec"
                        value={playerData.playerSpec}
                        onChange={handleInputChange}
                        isDisabled={!playerData.playerClass}
                    >
                        <option value="" hidden>Spec</option>
                        {playerData.playerClass && 
                        classSpecs[playerData.playerClass].map((spec) => (
                            <option key={spec} value={spec} >{spec}</option>
                        ))
                        }
                    </select>
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}