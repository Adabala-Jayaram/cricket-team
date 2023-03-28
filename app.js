const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(` server get running at https://localhost:3000/`);
    });
  } catch (e) {
    console.log("DB Error ${e.message}");
  }
};

initializeDBAndServer();

//Get Players API
app.get("/players/", async (request, response) => {
  const allPlayersQuery = `
      SELECT * 
      FROM cricket_team;`;
  const playersArray = await db.all(allPlayersQuery);
  response.send(playersArray);
});

// Create Player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO 
  cricket_team(player_name, jersey_number, role)
  values(
      ${playerName},
      ${jerseyNumber}, 
      ${role}
    ); `;

  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//Get Player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerFromTeam = `
  SELECT * 
  FROM cricket_team 
  WHERE player_id = ${playerId};`;
  const playerDetails = await db.get(getPlayerFromTeam);
  response.send(playerDetails);
});

// Update Player Details API
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `
 UPDATE 
 cricket_team
 SET 
 player_name = ${playerName},
 jersey_number = ${jerseyNumber},
 role = ${role};`;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

//Delete player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
     DELETE FROM 
     cricket_team
     WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
