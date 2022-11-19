import { useState, useEffect } from 'react';
import axios from 'axios';

const Player = () => {
      // setup state
  const [playlist, setPlaylist] = useState([]);
  const [song, setSong] = useState({title: "", 
      artist: "",
      album: "",
      year: "",
      genre: "",
      rating: 0
      });
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(true);

  const fetchPlaylist = async() => {
    try {      
      const response = await axios.get("/api/playlist");
      console.log(response.data[0]);
      setPlaylist(response.data);
      if (response.data.length !== 0) {
        setSong(response.data[0]);
        
      }
      
    } catch(error) {
      setError("error retrieving playlist: " + error);
    }
  };

  // fetch ticket data
  useEffect(() => {
    fetchPlaylist();
  },[]);
  
  useEffect(() => {
    fetchSong();
    setUpdate(false);
  },[update]);
  
  const fetchSong = async() => {
    if(playlist.length !== 0) {
      console.log(index);
      setSong(playlist[index]);
    }
  };
  
  const next = async() => {
      if (index === playlist.length - 1) {
          setIndex(0);
      } else if (playlist.length === 0) {
        setIndex(0);
      } else {
          let newIndex = index + 1;
          setIndex(newIndex);
      }
      console.log(index);
      setUpdate(true);
  };
  
  const previous = async() => {
      if (index === 0) {
          setIndex(playlist.length - 1);
      } else if (playlist.length === 0) {
        setIndex(0);
      } else {
          let newIndex = index - 1;
          setIndex(newIndex);
      }
      
      console.log(index);
      setUpdate(true);
  };

  // render results
  return (
    <div className="App">
      {error}
      <h1><strong>Music Player</strong></h1>
      <h2>Now Playing:</h2>
      <div className="playlist"><div className="playlistSongs">
      <div key={song.id} className="song">
          <div className="title">
            <p><strong>Title:</strong> {song.title} </p>
            <p><strong>Artist:</strong> {song.artist} </p>
            <p><strong>Album:</strong> {song.album}</p>
          </div>
          <button onClick={e => previous()}>Previous</button>
          <button onClick={e => next()}>Next</button>
      </div>
      </div></div>
    </div>
  );
};

export default Player;