import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeams, deleteTeam } from '../services/teams';
import { getAllChampions } from '../services/champions';
import '../css/Home.css';

const ROLES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [champions, setChampions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const teamsData = await getAllTeams();
      setTeams(teamsData);

      const champsArray = await getAllChampions();
      const champMap = {};
      champsArray.forEach(c => { champMap[c.id] = c; });
      setChampions(champMap);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteTeam(id);
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>League of Legends</h1>
        <p>Draft Simulator</p>
      </div>

      <div className="home-actions">
        <Link to="/draft/new" className="btn-gold">+ New Draft</Link>
      </div>

      <p className="section-title">Your Drafts</p>

      {teams.length === 0 ? (
        <div className="empty-state">
          <p>No drafts saved yet.</p>
          <Link to="/draft/new" className="btn-gold">Create your first draft</Link>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map(team => (
            <div key={team.id} className="team-card">
              <div className="team-card-name">{team.name}</div>

              <div className="team-card-champions">
                {ROLES.map(role => {
                  const roleKey = `${role.toLowerCase()}_id`;
                  const champ = champions[team[roleKey]];
                  return (
                    <div key={role} className="champ-slot">
                      {champ ? (
                        <>
                          <img src={champ.icon_url} alt={champ.name} />
                          <span>{champ.name}</span>
                        </>
                      ) : (
                        <>
                          <div style={{ width: 52, height: 52, background: '#1e2d3d', border: '1px solid #785a28' }} />
                          <span>{role}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="team-card-stats">
                <div className="stat">
                  <span className="stat-label">Total Cost</span>
                  <span className="stat-value">{team.total_be_cost?.toLocaleString()} BE</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Strength</span>
                  <span className="stat-value">{team.team_strength_pct}%</span>
                </div>
              </div>

              <div className="team-card-actions">
                <Link to={`/draft/${team.id}/edit`} className="btn-outline">Edit</Link>
                <button className="btn-danger" onClick={() => handleDelete(team.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
