const express = require('express');
const EventEmitter = require('events');

const app = express();

// Create an instance of EventEmitter
const eventEmitter = new EventEmitter();

let requestCount = 0;

// Define an event listener for the 'count' event
eventEmitter.on('count', () => {
  requestCount++;
  console.log(`Route '/' has been accessed ${requestCount} times.`);
});

// Define a route

app.get('/', (req, res) => {
  // Emit the 'count' event whenever the route is accessed
  eventEmitter.emit('count');
  
  // Send a response
  res.send(`Hello, World! This route has been accessed ${requestCount} times.`);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// http start here

const http=require('http');// step 1: require http module


const fs=require('fs');


// step 2: create http server
const myServer=http.createServer((req,res)=>{// step 2.1: request object stores all the data from the client
    console.log('new request recieved!');

    const log=`${Date.now()}: new request received via ${req.url} \n`;

    fs.appendFile("log.txt",log,(err,data)=>{
        res.end("hello from server again");//step 2.2: res.end()
        if(err){
            console.log("error in writing to file");
        }
    }); 

    res.end("hello from server");//step 2.2: res.end()

});

// step 3: listen 
myServer.listen(8004,()=>{
    console.log("server started!"); //step  3.1 optional 
});

//mongo start here

// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define a Mongoose schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Basic CRUD Routes

// CREATE: Add a new item
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: Get all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ: Get a single item by ID
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE: Update an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete an item by ID
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

