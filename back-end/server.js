const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

let playlist = [];


// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  year: String,
  genre: String,
  rating: Number
});

songSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
songSchema.set('toJSON', {
  virtuals: true
});

const Song = mongoose.model('Song', songSchema);

app.get('/api/songs', async (req, res) => {
  try {
    let songs = await Song.find();
    res.send({songs: songs});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/songs', async (req, res) => {
    let rating = req.body.rating;
    if (rating > 10) {
      rating = 10;
    } else if (rating < 0) {
      rating = 0;
    }
  
    const song = new Song({
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    year: req.body.year,
    genre: req.body.genre,
    rating: rating
  });
  try {
    await song.save();
    res.send({song:song});
    console.log("Song Added");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/songs/:id', async (req, res) => {
  try {
    await Song.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
    console.log("Deleted Song");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/songs/:id/:rating', async (req, res) => {
  try {
    await Song.updateOne({
      _id: req.params.id
    },
    { $set: { rating: req.params.rating } }
    );
    res.sendStatus(200);
    console.log("Changed Rating");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Playlist API

app.get('/api/playlist', (req, res) => {
  res.send(playlist);
});

app.post('/api/playlist', (req, res) => {
    const song = new Song({
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    year: req.body.year,
    genre: req.body.genre,
    rating: req.body.rating
  });
  
  let item = playlist.find(item => item === song);
    
    if (item === undefined) {
        playlist.push(song);
        console.log("Song added to playlist!");
    }
  
});

app.delete('/api/playlist/:id', async (req, res) => {
  console.log("deleting...");
    let id = req.params.id;
    const result = playlist.filter(item => item.id !== id);
    playlist = result;
    
    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));