import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    // setup state
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState(0);
  const [update, setUpdate] = useState(true);

  const fetchSongs = async() => {
    try {      
      const response = await axios.get("/api/songs");
      console.log(response.data.songs);
      setSongs(response.data.songs);
    } catch(error) {
      setError("error retrieving songs: " + error);
    }
  };
  
  const createSong = async() => {
    try {
      
      if (rating > 10) {
        setRating(10);
      } else if (rating < 0) {
        setRating(0);
      }
      
      await axios.post("/api/songs", 
      {title: title, 
      artist: artist,
      album: album,
      year: year,
      genre: genre,
      rating: rating
      });
    } catch(error) {
      setError("error adding a ticket: " + error);
    }
  };
  
  const deleteOneSong = async(song) => {
    try {
      await axios.delete("/api/songs/" + song.id);
    } catch(error) {
      setError("error deleting a song" + error);
    }
  };

  // fetch ticket data
  useEffect(() => {
    fetchSongs();
  },[]);
  
  useEffect(() => {
    fetchSongs();
    setUpdate(false);
  },[update]);

  const addSong = async(e) => {
    e.preventDefault();
    await createSong();
    fetchSongs();
    setTitle("");
    setArtist("");
    setAlbum("");
    setYear("");
    setGenre("");
    setRating(0);
  };

  const deleteSong = async(song) => {
    await deleteOneSong(song);
    fetchSongs();
  };
  
  const incrementRating = async(song) => {
    let rating = song.rating;
    if (song.rating !== 10) {
      rating += 1;
    }
    
    try {
      await axios.put("/api/songs/" + song.id + "/" + rating);
      setUpdate(true);
    } catch(error) {
      setError("error incrementing rating" + error);
    }
  };
  
  const decrementRating = async(song) => {
    let rating = song.rating;
    if (song.rating !== 0) {
      rating -= 1;
    }
    
    try {
      await axios.put("/api/songs/" + song.id + "/" + rating);
      setUpdate(true);
    } catch(error) {
      setError("error decrementing rating" + error);
    }
  };

  // render results
  return (
    <div className="App">
      {error}
      <h1><strong>Enter a song to your database!</strong></h1>
      <p>Welcome to the Song Database! You can store your own song and create a custom playlist! You can also play through your playlist!</p>
      <form onSubmit={addSong}>
        <div>
          <label>
            Title: 
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Artist: 
            <input type="text" value={artist} onChange={e=>setArtist(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Album: 
            <input type="text" value={album} onChange={e=>setAlbum(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Year: 
            <input type="text" value={year} onChange={e=>setYear(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Genre: 
            <input type="text" value={genre} onChange={e=>setGenre(e.target.value)} />
          </label>
          <label>
            Rating: 
            <input type="number" value={rating} onChange={e=>setRating(e.target.value)} />
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      <h1><strong>Songs</strong></h1>
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
            <p><strong>Rating:</strong> {song.rating} / 10</p>
          </div>
          <button onClick={e => decrementRating(song)}>Rating -</button>
          <button onClick={e => incrementRating(song)}>Rating +</button>
          <button onClick={e => deleteSong(song)}>Delete</button>
        </div>
      ))}
      </div>
      </div>
    </div>
  );

};

export default Home;