const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { 
    id: uuid(), 
    title, 
    url, 
    techs,
    likes: 0 
  }

  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;  
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found.'});
  }

  const repoUpdated = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repoUpdated;
  return response.json(repoUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;  

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex >= 0) {
    repositories.splice(repoIndex, 1);
  }else {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoLike = repositories.findIndex(repo => repo.id === id);

  if (repoLike === -1) {
    return response.status(400).json({ error: 'Repository ID does not exists.' });
  }

  repositories[repoLike].likes++;

  return response.json(repositories[repoLike]);

});

module.exports = app;
