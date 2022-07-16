const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs:techs,
    likes: 0
  };
  repositories.push(repository)
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body
  const repository = repositories.find(repository => repository.id === id)

  if(!repository){
    return response.status(404).json({ error: "Repository not found" });
  }
  if(title){
    repository.title = title
  }
  if(url){
    repository.url = url
  }
  if(techs){
    repository.techs = techs
  }
  
  return response.json(repository)
})
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(repository => repository.id === id)
  repositories.splice(indexRepository,1)
  if(indexRepository===-1){
    return response.status(404).json({ error: "Repository not found" });
  }
  return response.status(204).send();
});
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({"likes":likes});
});

module.exports = app;
