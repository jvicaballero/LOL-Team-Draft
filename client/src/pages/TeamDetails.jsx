import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTeamById, deleteTeam } from '../services/teams';
import { getAllChampions } from '../services/champions';
import '../css/TeamDetails.css';
import '../css/Home.css';

const ROLES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [champMap, setChampMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const teamData = await getTeamById(id);
      const champsArray = await getAllChampions();
      const map = {};
      champsArray.forEach(c => { map[c.id] = c; });
      setTeam(teamData);
      setChampMap(map);
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    await deleteTeam(id);
    navigate('/');
  };

  if (!team) return null;

  return (
    <div className="team-details">
      <Link to="/" className="back-link">← Back to all drafts</Link>

      <div className="team-details-header">
        <h2>{team.name}</h2>
        <div className="team-details-actions">
          <Link to={`/draft/${id}/edit`} className="btn-outline">Edit</Link>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="team-details-champions">
        {ROLES.map(role => {
          const champ = champMap[team[`${role.toLowerCase()}_id`]];
          return (
            <div key={role} className="team-details-slot">
              <span className="team-details-slot-label">{role}</span>
              {champ && <img src={champ.icon_url} alt={champ.name} />}
              <span className="team-details-slot-name">{champ?.name}</span>
            </div>
          );
        })}
      </div>

      <div className="team-details-stats">
        <div className="stat">
          <span className="stat-label">Total Cost</span>
          <span className="stat-value">{team.total_be_cost?.toLocaleString()} BE</span>
        </div>
        <div className="stat">
          <span className="stat-label">Team Strength</span>
          <span className="stat-value">{team.team_strength_pct}%</span>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
