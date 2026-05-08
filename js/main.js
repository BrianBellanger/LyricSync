import config from "../config/config.js";

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();

  document.getElementById("lyrics").innerHTML = "";
  document.getElementById("songs").innerHTML = "";

  getLyrics(artist, title);
  getSongs(artist, title, 5);
});

async function getLyrics(artist, title) {
  try {
    const response = await fetch("https://api.lyrics.ovh/v1/" + encodeURIComponent(artist) + "/" + encodeURIComponent(title), {method: "GET", headers: {"Content-Type": "application/json"}});
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.lyrics) {
      document.getElementById("lyrics").innerText = data.lyrics;
    } else {
      document.getElementById("lyrics").textContent = "Lyrics not found.";
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    document.getElementById("lyrics").textContent = "Error fetching lyrics.";
  }
}

async function getSongs(artist, title, maxResults) {
  try {
    const key = config.GOOGLE_API_KEY;
    const query = encodeURIComponent(artist + " - " + title);
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${key}&type=video&part=snippet&maxResults=${maxResults}&q=${query}`;
    const response = await fetch(youtubeApiUrl);
    const data = await response.json();
    data.items.forEach((item) => {
      songs = `<iframe src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`;
      document.getElementById("songs").innerHTML += songs;
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    document.getElementById("songs").textContent = "Error fetching songs.";
  }
}
