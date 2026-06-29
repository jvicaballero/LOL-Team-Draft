import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllChampions } from "../services/champions";
import { getTeamById, updateTeam } from "../services/teams";
import calcTeamStrength from "../helpers/calcTeamStrength";
import "../css/CreateDraft.css";

const ROLES = ["Top", "Jungle", "Mid", "Bot", "Support"];

const EditDraft = () => {
  const { id } = useParams();
  const [champions, setChampions] = useState([]);
  const [selectedChampions, setSelectedChampions] = useState({
    Top: null,
    Jungle: null,
    Mid: null,
    Bot: null,
    Support: null,
  });
  const [activeRole, setActiveRole] = useState("Top");
  const [roleFilter, setRoleFilter] = useState("All");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  // Will use the hook useNavigate to handle switching between pages
  // It handles going back to the homepage without doing a hard reload of the page.
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const champsData = await getAllChampions();
      const teamData = await getTeamById(id);
      setChampions(champsData);
      setTeamName(teamData.name);

      const champMap = {};
      champsData.forEach((c) => {
        champMap[c.id] = c;
      });

      setSelectedChampions({
        Top: champMap[teamData.top_id] || null,
        Jungle: champMap[teamData.jungle_id] || null,
        Mid: champMap[teamData.mid_id] || null,
        Bot: champMap[teamData.bot_id] || null,
        Support: champMap[teamData.support_id] || null,
      });
    };
    fetchData();
  }, [id]);

  const selectedIds = new Set(
    Object.values(selectedChampions)
      .filter(Boolean)
      .map((c) => c.id),
  );

  const filteredChampions =
    roleFilter === "All"
      ? champions
      : champions.filter((c) => c.role === roleFilter);

  const handleChampionClick = (champ) => {
    if (selectedChampions[activeRole]?.id === champ.id) {
      setSelectedChampions((prev) => ({ ...prev, [activeRole]: null }));
      setError("");
      return;
    }
    if (selectedIds.has(champ.id)) {
      setError(`${champ.name} is already in your draft.`);
      return;
    }
    if (champ.role !== activeRole) {
      setError(
        `${champ.name} is a ${champ.role} — select the ${champ.role} slot first.`,
      );
      return;
    }
    setSelectedChampions((prev) => ({ ...prev, [activeRole]: champ }));
    setError("");
    const nextEmpty = ROLES.find(
      (r) => r !== activeRole && !selectedChampions[r],
    );
    if (nextEmpty) setActiveRole(nextEmpty);
  };

  const pickedChamps = Object.values(selectedChampions).filter(Boolean);
  const totalBeCost = pickedChamps.reduce((sum, c) => sum + c.be_cost, 0);
  const strength =
    pickedChamps.length === 5 ? calcTeamStrength(pickedChamps) : 0;

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }
    if (pickedChamps.length < 5) {
      setError("Select a champion for every role.");
      return;
    }

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

    await updateTeam(id, payload);
    navigate("/");
  };

  return (
    <div className="create-draft">
      <h2>Edit Draft</h2>

      <div className="team-name-input">
        <input
          type="text"
          placeholder="Enter team name..."
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      <div className="team-slots">
        {ROLES.map((role) => {
          const champ = selectedChampions[role];
          return (
            <div
              key={role}
              className={`role-slot ${activeRole === role ? "active" : ""}`}
              onClick={() => setActiveRole(role)}
            >
              <span className="role-slot-label">{role}</span>
              {champ ? (
                <img
                  className="role-slot-img"
                  src={champ.icon_url}
                  alt={champ.name}
                />
              ) : (
                <div className="role-slot-empty">+</div>
              )}
              <span className="role-slot-name">{champ ? champ.name : "—"}</span>
            </div>
          );
        })}
      </div>

      <div className="draft-stats">
        <div className="draft-stat">
          <div className="draft-stat-label">Total Cost</div>
          <div className="draft-stat-value">
            {totalBeCost.toLocaleString()} BE
          </div>
        </div>
      </div>

      <div className="strength-bar-container">
        <div className="draft-stat-label">
          Team Strength —{" "}
          {pickedChamps.length === 5
            ? `${strength}%`
            : `${pickedChamps.length}/5 picked`}
        </div>
        <div className="strength-bar-track">
          <div
            className="strength-bar-fill"
            style={{
              width: `${strength}%`,
              backgroundColor:
                strength >= 75
                  ? "#4caf50"
                  : strength >= 50
                    ? "#c89b3c"
                    : "#e05252",
            }}
          />
        </div>
      </div>

      {error && <div className="draft-error">{error}</div>}

      <div className="role-tabs">
        {["All", ...ROLES].map((r) => (
          <button
            key={r}
            className={`role-tab ${roleFilter === r ? "active" : ""}`}
            onClick={() => setRoleFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="champion-grid">
        {filteredChampions.map((champ) => {
          const isSelected = selectedIds.has(champ.id);
          const isWrongRole = champ.role !== activeRole;
          return (
            <div
              key={champ.id}
              className={`champion-icon ${isSelected ? "selected" : ""} ${!isSelected && isWrongRole ? "disabled" : ""}`}
              onClick={() => handleChampionClick(champ)}
            >
              <img src={champ.icon_url} alt={champ.name} />
              <span>{champ.name}</span>
            </div>
          );
        })}
      </div>

      <div className="draft-submit">
        <button className="btn-gold" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditDraft;
