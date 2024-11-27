const playIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="currentColor">
                <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
        `;

const pauseIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="currentColor">
                <path d="M320-320h320v-320H320v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
        `;

const muteIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="currentColor">
                <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM240-360v-240h128l160-160v560L368-360H240Zm360 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T600-320ZM480-592 376-696l104-104v208Zm-200 72h114l86 86v-234l-86 86H280v62Zm200 0Z"/>
            </svg>
        `;

const unmuteIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="currentColor">
                <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/>
            </svg>
        `;

const players = document.querySelectorAll('.audioPlayer');

players.forEach(player => {
    const playPauseButton = player.querySelector('.playPauseBtn');
    const speedBtn = player.querySelector('.speedBtn');
    const currentTimeSpan = player.querySelector('.currentTime');
    const durationSpan = player.querySelector('.duration');
    const progressBar = player.querySelector('.progressBar');
    const muteBtn = player.querySelector('.muteBtn');
    const volumeBar = player.querySelector('.volumeBar');
    const audio = player.querySelector('.audio');

    const speedLevels = [1, 1.2, 1.5, 1.7, 2];
    let currentSpeedIndex = 0;

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    function updateProgress() {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
        progressBar.style.background = `linear-gradient(to right, #d5a660 ${progressBar.value}%, #d3d3d3 ${progressBar.value}%)`;
    }

    playPauseButton.innerHTML = playIcon;
    muteBtn.innerHTML = muteIcon;

    playPauseButton.addEventListener('click', () => {
        players.forEach(p => {
            const otherAudio = p.querySelector('.audio');
            const otherPlayPauseBtn = p.querySelector('.playPauseBtn');
            if (otherAudio !== audio && !otherAudio.paused) {
                otherAudio.pause();
                otherPlayPauseBtn.innerHTML = playIcon;
            }
        });

        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = pauseIcon;
        } else {
            audio.pause();
            playPauseButton.innerHTML = playIcon;
        }
    });

    speedBtn.addEventListener('click', () => {
        currentSpeedIndex = (currentSpeedIndex + 1) % speedLevels.length;
        const newSpeed = speedLevels[currentSpeedIndex];
        audio.playbackRate = newSpeed;
        speedBtn.textContent = `${newSpeed}x`;
    });

    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.innerHTML = audio.muted ? unmuteIcon : muteIcon;
    });

    progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * audio.duration;
        audio.currentTime = time;
    });

    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value;
        if (audio.volume === 0) {
            audio.muted = true;
            muteBtn.innerHTML = unmuteIcon;
        } else {
            audio.muted = false;
            muteBtn.innerHTML = muteIcon;
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = isNaN(audio.duration) ? 'Live' : formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', updateProgress);
});