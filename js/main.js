import config from "../config/config.js";

const searchForm = document.getElementById("searchForm");
const titleInput = document.getElementById("title");
const artistInput = document.getElementById("artist");

const lyricsContainer = document.getElementById("lyrics");
const songsContainer = document.getElementById("songs");

searchForm.addEventListener("submit", handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const artist = artistInput.value.trim();

  clearResults();

  if (!title || !artist) {
    return;
  }

  await Promise.all([getLyrics(artist, title), getSongs(artist, title, 5)]);
}

function clearResults() {
  lyricsContainer.innerHTML = "<h2>Lyrics</h2>";
  songsContainer.innerHTML = "<h2>Videos</h2>";
}

async function getLyrics(artist, title) {
  try {
    const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
    console.log(`Fetching lyrics from: ${lyricsUrl}`);
    const response = await fetch(lyricsUrl);

    if (!response.ok) {
      throw new Error(`Lyrics API Error: ${response.status}`);
    }

    const data = await response.json();

    const lyricsElement = document.createElement("pre");

    lyricsElement.textContent = data.lyrics || "Lyrics not found.";

    lyricsContainer.appendChild(lyricsElement);
  } catch (error) {
    console.error("Error fetching lyrics:", error);

    lyricsContainer.innerHTML += `
      <p>Error fetching lyrics.</p>
    `;
  }
}

async function getSongs(artist, title, maxResults = 5) {
  try {
    const query = encodeURIComponent(`${artist}-${title}`);

    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${config.GOOGLE_API_KEY}&type=video&part=snippet&maxResults=${maxResults}&q=${query}`;
    console.log(`Fetching songs from: ${youtubeApiUrl}`);
    const response = await fetch(youtubeApiUrl);

    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      songsContainer.innerHTML += `
        <p>No videos found.</p>
      `;
      return;
    }

    data.items.forEach((item) => {
      const iframe = document.createElement("iframe");

      iframe.src = `https://www.youtube.com/embed/${item.id.videoId}`;
      iframe.width = "300";
      iframe.height = "170";
      iframe.allowFullscreen = true;

      songsContainer.appendChild(iframe);
    });
  } catch (error) {
    console.error("Error fetching songs:", error);

    songsContainer.innerHTML += `
      <p>Error fetching songs.</p>
    `;
  }
}
