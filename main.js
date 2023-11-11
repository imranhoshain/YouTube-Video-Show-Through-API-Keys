// Replace with your YouTube Data API key
const API_KEY = '{{youtube_api_key|raw}}';
const channelId = '{{youtube_channel_id|raw}}';
const maxResults = {{youtube_max_search|raw}};

const videoList = document.getElementById('video-list-items');
const videoIframe = document.getElementById('video-iframe');
const searchInput = document.getElementById('search-input');

let videosData = [];

// Function to fetch and display video data
async function fetchYouTubeVideos() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`);
    const data = await response.json();

    videosData = data.items.filter(item => item.id.kind === 'youtube#video').map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: new Date(item.snippet.publishedAt).toDateString(),
        thumbnail: item.snippet.thumbnails.default.url,
    }));

    updateVideoList();

    // Play the last uploaded video
    if (videosData.length > 0) {
        playVideo(videosData[0].videoId);
    }
}

// Function to play a video in the iframe
function playVideo(videoId) {
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    videoIframe.src = videoUrl;
}

// Function to filter and update the video list based on search input
function updateVideoList() {
    const searchQuery = searchInput.value.toLowerCase();

    const filteredVideos = videosData.filter(video => video.title.toLowerCase().includes(searchQuery));

    videoList.innerHTML = '';

    filteredVideos.forEach(video => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <p class="title">${video.title}</p>
            <p class="description">${video.description}</p>
            <p class="published-at">${video.publishedAt}</p>
        `;
        listItem.addEventListener('click', () => playVideo(video.videoId));
        videoList.appendChild(listItem);
    });
}

// Event listener for search input changes
searchInput.addEventListener('input', updateVideoList);

// Initialize by fetching and displaying videos
fetchYouTubeVideos();