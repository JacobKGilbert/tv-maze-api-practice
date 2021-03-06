BASEURL = 'http://api.tvmaze.com'

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query. The function is async show it
 *      will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let showsArray = []
  let res = await axios.get(`${BASEURL}/search/shows?q=${query}`)
        
  for (const showObj of res.data) {
    console.log(showObj.show)
    let image
    if (showObj.show.image === null) {
      image = 'https://tinyurl.com/tv-missing'
    } else {
      image = showObj.show.image.medium
    }

    show = {
      id: showObj.show.id,
      name: showObj.show.name,
      summary: showObj.show.summary,
      image: image
    }
    showsArray.push(show)
  }
  
  return showsArray
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button type="button" class="btn btn-primary show-episodes-btn">Show Episodes</button>
         </div>
       </div>
      `
    )

    $showsList.append($item)

    /** Handle search form submission:
     *    - show episodes area
     *    - get list of matching episodes and show in episodes list
     */
    $('.show-episodes-btn').on(
      'click',
      async function handleEpisodeReveal(evt) {
        evt.preventDefault()

        button = evt.currentTarget
        $buttonParentDiv = $(button).closest('div')
        id = $buttonParentDiv.data('showId')

        $('#episodes-area').show()

        let episodes = await getEpisodes(id)

        populateEpisodes(episodes)
      }
    )
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
  let episodesArray = []
  // Get episodes from tvmaze
  let res = await axios.get(`${BASEURL}/shows/${id}/episodes`)

  for (const episodeObj of res.data) {
    episode = {
      id: episodeObj.id,
      name: episodeObj.name,
      season: episodeObj.season,
      number: episodeObj.number
    }
    episodesArray.push(episode)
  }
  // Return array-of-episode-info
  return episodesArray
}

/** Populate episodes list:
 *     - given list of episodes, add episodes to DOM
 */
function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list')
  $episodesList.empty()

  for (let episode of episodes) {
    let $item = $(`<li>${episode.name} (Season ${episode.season}, Number ${episode.number})</li>`)

    $episodesList.append($item)
  }
}

