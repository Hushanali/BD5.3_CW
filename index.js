let express = require('express');
let { track } = require('./models/track.model');
let { sequelize } = require('./lib/index');
let app = express();

app.use(express.json());

// Data
let movieData = [
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: 4,
  },
  {
    name: 'Naina Da Kya Kasoor',
    genre: 'Pop',
    release_year: 2018,
    artist: 'Amit Trivedi',
    album: 'Andhadhun',
    duration: 3,
  },
  {
    name: 'Ghoomar',
    genre: 'Traditional',
    release_year: 2018,
    artist: 'Shreya Ghoshal',
    album: 'Padmaavat',
    duration: 3,
  },
  {
    name: 'Bekhayali',
    genre: 'Rock',
    release_year: 2019,
    artist: 'Sachet Tandon',
    album: 'Kabir Singh',
    duration: 6,
  },
  {
    name: 'Hawa Banke',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Darshan Raval',
    album: 'Hawa Banke (Single)',
    duration: 3,
  },
  {
    name: 'Ghungroo',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'War',
    duration: 5,
  },
  {
    name: 'Makhna',
    genre: 'Hip-Hop',
    release_year: 2019,
    artist: 'Tanishk Bagchi',
    album: 'Drive',
    duration: 3,
  },
  {
    name: 'Tera Ban Jaunga',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Tulsi Kumar',
    album: 'Kabir Singh',
    duration: 3,
  },
  {
    name: 'First Class',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 4,
  },
  {
    name: 'Kalank Title Track',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Arijit Singh',
    album: 'Kalank',
    duration: 5,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await track.bulkCreate(movieData);

    res.status(200).json({ message: 'Database seeding successful.' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error while seeding the Data.', error: error.message });
  }
});

// 1
async function fetchAllTracks() {
  let tracks = await track.findAll();
  return { tracks };
}

app.get('/tracks', async (req, res) => {
  try {
    let response = await fetchAllTracks();

    if (response.tracks.length === 0) {
      return res.status(404).json({ message: 'No tracks found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function addNewTrack(newTrack) {
  let trackData = track.create(newTrack);
  return trackData;
}

app.post('/tracks/new', async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let response = await addNewTrack(newTrack);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3
async function updateDataById(updateData, id) {
  let trackDetails = await track.findOne({ where: { id } });
  if (!trackDetails) {
    return {};
  }

  trackDetails.set(updateData);
  let trackUpdated = await trackDetails.save();

  return { message: 'Track updated successfully', trackUpdated };
}

app.post('/tracks/update/:id', async (req, res) => {
  try {
    let updateData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateDataById(updateData, id);

    if (!response.message) {
      return res.status(404).json({ message: 'Track not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4
async function deleteTrackById(id) {
  let destroyTrack = await track.destroy({ where: { id } });

  if (destroyTrack === 0) {
    return {};
  }

  return { message: 'Track deleted successfully.' };
}

app.post('/tracks/delete', async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteTrackById(id);

    if (!response.message) {
      return res.status(404).json({ message: 'Track not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PORT
app.listen(3000, () => {
  console.log('Server is running on Port 3000');
});
