import { useState, useEffect } from 'react';
import axios from 'axios';

const Database = () => {
  // setup state
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");

  const fetchSongs = async() => {
    try {      
      const response = await axios.get("/api/songs");
      console.log(response.data.songs);
      setSongs(response.data.songs);
    } catch(error) {
      setError("error retrieving songs: " + error);
    }
  };

  // fetch ticket data
  useEffect(() => {
    fetchSongs();
  },[]);
  
  const addToPlaylist = async(song) => {
    try {
      await axios.post("/api/playlist", 
      {title: song.title, 
      artist: song.artist,
      album: song.album,
      year: song.year,
      genre: song.genre,
      rating: song.rating
      });
    } catch (e) {
        setError("error adding to playlist:" + e);
    }
  };
  

  // render results
  return (
    <div className="App">
      {error}
      <h1><strong>Song Database</strong></h1>
      <div className="main">
      <div className="songs">
      {songs.map(song => (
        <div key={song.id} className="song">
          <div className="title">
            <p><strong>Title:</strong> {song.title}</p>
            <p><strong>Artist:</strong> {song.artist}</p>
            <p><strong>Album:</strong> {song.album}</p>
            <p><strong>Year:</strong> {song.year}</p>
            <p><strong>Genre:</strong> {song.genre}</p>
            <p><strong>Genre:</strong> {song.rating}</p>
          </div>
          <button onClick={e => addToPlaylist(song)}>Add To Playlist</button>
        </div>
      ))}   
      </div>
      </div>
    </div>
  );
};

export default Database;