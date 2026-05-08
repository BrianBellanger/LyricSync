const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();

  document.getElementById("lyrics").textContent = "";
  document.getElementById("songs").textContent = "";

  getLyrics(artist, title);
  getVideos(artist, title, 5);
});

function getLyrics(artist, title) {
  var apiUrl =
    "https://api.lyrics.ovh/v1/" +
    encodeURIComponent(artist) +
    "/" +
    encodeURIComponent(title);

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(function (data) {
      if (data.lyrics) {
        $("#lyrics").innerText = data.lyrics;
      } else {
        $("#lyrics").textContent = "Lyrics not found.";
      }
    })
    .catch(function (error) {
      $("#lyrics").textContent = "Unable to fetch lyrics.";
      console.error(error);
    });
}

function getVideos(artist, title, maxResults) {
  $("#videos").empty();
  $.get(
    "https://www.googleapis.com/youtube/v3/search?key=AIzaSyClOnNDd4howxJo-Q-1PXhG2Y__Jo44jP4" +
      "&type=video&part=snippet&maxResults=" +
      maxResults +
      "&q=" +
      artist +
      " - " +
      title,
    function (data) {
      console.log(data);
      data.items.forEach((item) => {
        songs = `
                <iframe class="has-ratio" width="360" height="360" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" 
                allowfullscreen></iframe>
                `;
        $("#songs").append(songs);
      });
    },
  );
}
