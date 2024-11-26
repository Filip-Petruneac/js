const audio = document.getElementById('audio');
const playlistItems = document.querySelectorAll('#playlist li');
const playPauseButton = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volumeButton = document.getElementById('volume-button');
const volumeSlider = document.getElementById('volume-slider');
const timeRemaining = document.getElementById('time-remaining');
const speedControl = document.getElementById("speed-control")

// Function to handle track change
function changeTrack(event) {
  // Remove active class from all tracks
  playlistItems.forEach(item => item.classList.remove('active'));

  // Add active class to the clicked track
  const selectedTrack = event.target;
  selectedTrack.classList.add('active');

  // Update audio source and play the selected track
  const trackSrc = selectedTrack.getAttribute('data-src');
  audio.src = trackSrc;
  audio.play();

  // Update play button to show "pause" icon
  playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
}

// Add click event listener to each playlist item
playlistItems.forEach(item => {
  item.addEventListener('click', changeTrack);
});

// Toggle Play/Pause
playPauseButton.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change icon to pause
  } else {
    audio.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Change icon to play
  }
});

// Toggle Volume Slider Visibility
volumeButton.addEventListener('click', () => {
  if (volumeSlider.classList.contains('hidden')) {
    volumeSlider.classList.remove('hidden');
    volumeSlider.classList.add('visible');
  } else {
    volumeSlider.classList.add('hidden');
    volumeSlider.classList.remove('visible');
  }
});

// Toggle Mute/Unmute
volumeButton.addEventListener('click', () => {
    audio.muted = !audio.muted; // Toggle the muted property
  
    // Update the icon based on mute state
    if (audio.muted) {
      volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// Adjust Volume in Real Time
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100; // Convert slider value to range 0-1
});

// Update Progress Bar and Time Remaining
audio.addEventListener('timeupdate', () => {
  // Update progress bar
  progress.value = (audio.currentTime / audio.duration) * 100;

  // Update time remaining
  const remainingTime = audio.duration - audio.currentTime;
  timeRemaining.textContent = formatTime(remainingTime);
});

// Seek Audio Position
progress.addEventListener('input', () => {
  const newTime = (progress.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

// Format Time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

//adjust playback speed when the dropdown value changes
speedControl.addEventListener("change", () => {
    const selectedSpeed = parseFloat(speedControl.value); //get the selected speed as a float
    audio.playbackRate = selectedSpeed; //set the audio playback rate
})

// Set Initial Time Remaining when Metadata is Loaded
audio.addEventListener('loadedmetadata', () => {
  timeRemaining.textContent = formatTime(audio.duration);
});