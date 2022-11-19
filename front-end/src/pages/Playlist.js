import { useState, useEffect } from 'react';
import axios from 'axios';

const Playlist = () => {
    // setup state
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(true);

  const fetchPlaylist = async() => {
    try {      
      const response = await axios.get("/api/playlist");
      console.log(response.data);
      setPlaylist(response.data);
    } catch(error) {
      setError("error retrieving playlist: " + error);
    }
  };

  // fetch ticket data
  useEffect(() => {
    fetchPlaylist();
  },[]);
  
  useEffect(() => {
    fetchPlaylist();
    setUpdate(false);
  },[update]);
  
  const deleteFromPlaylist = async(song) => {
    try {
      await axios.delete("/api/playlist/" + song.id);
      setUpdate(true);
    } catch(error) {
      setError("error deleting a song" + error);
    }
  };

  // render results
  return (
    <div className="App">
      {error}
      <h1><strong>Song Playlist</strong></h1>
      <div className="playlist">
      <div className="playlistSongs">
      {playlist.map(song => (
        <div key={song.id} className="playlistSong">
          <div className="title">
            <p><strong>Title:</strong> {song.title} <strong>Artist:</strong> {song.artist} <strong>Album:</strong> {song.album}</p>
          </div>
          <button onClick={e => deleteFromPlaylist(song)}>Remove</button>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
};

export default Playlist;