import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChampions } from '../services/champions';
import { createTeam } from '../services/teams';
import calcTeamStrength from '../helpers/calcTeamStrength';
import '../css/CreateDraft.css';

const ROLES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'];

const EMPTY_SLOTS = { Top: null, Jungle: null, Mid: null, Bot: null, Support: null };

const CreateDraft = () => {
  const [champions, setChampions] = useState([]);
  const [selectedChampions, setSelectedChampions] = useState(EMPTY_SLOTS);
  const [activeRole, setActiveRole] = useState('Top');
  const [roleFilter, setRoleFilter] = useState('All');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllChampions().then(setChampions);
  }, []);

  const selectedIds = new Set(
    Object.values(selectedChampions).filter(Boolean).map(c => c.id)
  );

  const filteredChampions = roleFilter === 'All'
    ? champions
    : champions.filter(c => c.role === roleFilter);

  const handleChampionClick = (champ) => {
    // Deselect if already in the active role slot
    if (selectedChampions[activeRole]?.id === champ.id) {
      setSelectedChampions(prev => ({ ...prev, [activeRole]: null }));
      setError('');
      return;
    }

    // Block if champion is already in another slot
    if (selectedIds.has(champ.id)) {
      setError(`${champ.name} is already in your draft.`);
      return;
    }

    // Block if champion's role doesn't match the active slot
    if (champ.role !== activeRole) {
      setError(`${champ.name} is a ${champ.role} — select the ${champ.role} slot first.`);
      return;
    }

    setSelectedChampions(prev => ({ ...prev, [activeRole]: champ }));
    setError('');

    // Auto-advance to next empty role
    const nextEmpty = ROLES.find(r => r !== activeRole && !selectedChampions[r]);
    if (nextEmpty) setActiveRole(nextEmpty);
  };

  const pickedChamps = Object.values(selectedChampions).filter(Boolean);
  const totalBeCost = pickedChamps.reduce((sum, c) => sum + c.be_cost, 0);
  const strength = pickedChamps.length === 5 ? calcTeamStrength(pickedChamps) : 0;

  const handleSubmit = async () => {
    if (!teamName.trim()) { setError('Please enter a team name.'); return; }
    if (pickedChamps.length < 5) { setError('Select a champion for every role.'); return; }

    const payload = {
      name: teamName,
      top_id: selectedChampions.Top.id,
      jungle_id: selectedChampions.Jungle.id,
      mid_id: selectedChampions.Mid.id,
      bot_id: selectedChampions.Bot.id,
      support_id: selectedChampions.Support.id,
      total_be_cost: totalBeCost,
      team_strength_pct: strength,
    };

    await createTeam(payload);
    navigate('/');
  };

  return (
    <div className="create-draft">
      <h2>Create Your Draft</h2>

      <div className="team-name-input">
        <input
          type="text"
          placeholder="Enter team name..."
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
        />
      </div>

      {/* Team role slots */}
      <div className="team-slots">
        {ROLES.map(role => {
          const champ = selectedChampions[role];
          return (
            <div
              key={role}
              className={`role-slot ${activeRole === role ? 'active' : ''}`}
              onClick={() => setActiveRole(role)}
            >
              <span className="role-slot-label">{role}</span>
              {champ ? (
                <img className="role-slot-img" src={champ.icon_url} alt={champ.name} />
              ) : (
                <div className="role-slot-empty">+</div>
              )}
              <span className="role-slot-name">{champ ? champ.name : '—'}</span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="draft-stats">
        <div className="draft-stat">
          <div className="draft-stat-label">Total Cost</div>
          <div className="draft-stat-value">{totalBeCost.toLocaleString()} BE</div>
        </div>
      </div>

      <div className="strength-bar-container">
        <div className="draft-stat-label">Team Strength — {pickedChamps.length === 5 ? `${strength}%` : `${pickedChamps.length}/5 picked`}</div>
        <div className="strength-bar-track">
          <div
            className="strength-bar-fill"
            style={{
              width: `${strength}%`,
              backgroundColor: strength >= 75 ? '#4caf50' : strength >= 50 ? '#c89b3c' : '#e05252',
            }}
          />
        </div>
      </div>

      {error && <div className="draft-error">{error}</div>}

      {/* Role filter tabs */}
      <div className="role-tabs">
        {['All', ...ROLES].map(r => (
          <button
            key={r}
            className={`role-tab ${roleFilter === r ? 'active' : ''}`}
            onClick={() => setRoleFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Champion grid */}
      <div className="champion-grid">
        {filteredChampions.map(champ => {
          const isSelected = selectedIds.has(champ.id);
          const isWrongRole = champ.role !== activeRole;
          return (
            <div
              key={champ.id}
              className={`champion-icon ${isSelected ? 'selected' : ''} ${!isSelected && isWrongRole ? 'disabled' : ''}`}
              onClick={() => handleChampionClick(champ)}
            >
              <img src={champ.icon_url} alt={champ.name} />
              <span>{champ.name}</span>
            </div>
          );
        })}
      </div>

      <div className="draft-submit">
        <button className="btn-gold" onClick={handleSubmit}>Save Draft</button>
      </div>
    </div>
  );
};

export default CreateDraft;
