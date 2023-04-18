const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const port = 4000;
const jsonParser = express.json();
const fileName = 'employee.json';


// Allow requests only from this client
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

// This is a RESTful GET web service
app.get('/employee', (request, response) => {
    data.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1 );
    response.send(data);
});

// This is a RESTful POST web service
let lastId = data.length > 0 ? data[data.length - 1].id : 0;

app.post('/employee', jsonParser, (request, response) => {
    lastId++;
    const newStudent = { id: lastId, ...request.body };
    data.push(newStudent);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();
});


// This is a RESTful PUT web service to update an employee by ID
app.put('/employee/:id', jsonParser, (req, res) => {
  const id = parseInt(req.params.id);
  const updatedEmployee = { id, ...req.body };
  const index = data.findIndex(employee => employee.id === id);
  if (index === -1) return res.status(404).send('Employee not found');
  data[index] = updatedEmployee;
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  res.send('Employee updated successfully');
});


//This is a RESTful PUT web service to delete an employee by ID
app.delete('/employee/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = data.findIndex(employee => employee.id === id);
  if (index === -1) return res.status(404).send(`Employee with ID ${id} not found`);
  data.splice(index, 1);
  res.send(`Employee with ID ${id} has been deleted`);
});


  

app.listen(port);
console.log(`server listening on port ${port}`);