// This is where my backend will communicate to my database to fetch information

// Usual flow of data:
// Controller — talks to the database, sends back data
// Route — maps a URL to a controller function
// in server/routes/champions.js
// Service (client-side) — wraps the fetch call
// in client/services/champions.js
// Component — calls the service
// in client/components/ChampionsList.jsx

/**
 *  The usual flow of a controller function is to:
 *  1. Create my Query (this case to select all matches from the matches table)
 *  2. Use my already open pool connection to db to query
 *  3. return response with proper status
 *
 */
import { pool } from "../config/database.js";

const getAllChampions = async (req, res) => {
  const getQuery = `SELECT * FROM champions`;

  try {
    const result = await pool.query(getQuery);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching champions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllChampions };
