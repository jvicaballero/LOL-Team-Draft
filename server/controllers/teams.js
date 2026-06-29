import { pool } from "../config/database.js";

const getAllTeams = async (req, res) => {
  const getQuery = `SELECT * FROM teams`;

  try {
    const result = await pool.query(getQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTeamById = async (req, res) => {
  const { id } = req.params;
  const getQuery = `SELECT * FROM teams WHERE id = $1`;

  try {
    const result = await pool.query(getQuery, [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTeam = async (req, res) => {
  const { name, top_id, jungle_id, mid_id, bot_id, support_id, total_be_cost, team_strength_pct } = req.body;
  const insertQuery = `INSERT INTO teams (name, top_id, jungle_id, mid_id, bot_id, support_id, total_be_cost, team_strength_pct)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`;

  try {
    const result = await pool.query(insertQuery, [name, top_id, jungle_id, mid_id, bot_id, support_id, total_be_cost, team_strength_pct]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, top_id, jungle_id, mid_id, bot_id, support_id, total_be_cost, team_strength_pct } = req.body;
  const updateQuery = `UPDATE teams
    SET name = $1, top_id = $2, jungle_id = $3, mid_id = $4, bot_id = $5, support_id = $6, total_be_cost = $7, team_strength_pct = $8
    WHERE id = $9
    RETURNING *`;

  try {
    const result = await pool.query(updateQuery, [name, top_id, jungle_id, mid_id, bot_id, support_id, total_be_cost, team_strength_pct, id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTeam = async (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM teams WHERE id = $1 RETURNING *`;

  try {
    const result = await pool.query(deleteQuery, [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam };
