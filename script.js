// SINGLE CLICK LOGIC 
let clicks = 0;

function countClick() {
    const clickCounter = document.getElementById('click-count');
    const continueBtn = document.getElementById('press-continue');
    
    if (clickCounter) {
        clicks++;
        clickCounter.innerText = "Clicks: " + clicks;
        if (clicks >= 10) {
            clickCounter.innerText = "Goal Reached: " + clicks;
            clickCounter.style.color = "#28a745";
            
            if (continueBtn) {
                continueBtn.classList.remove('disabled');
            }
        }
    }
}

// double cick logic
function hatch() {
    const eggElement = document.getElementById('egg');
    if (eggElement) {
        eggElement.innerText = "🐣";
    }
}

// hover logic
const hoverBox = document.querySelector('.hover-box');
const timerDisplay = document.querySelector('#timer-display');
const cardContinueBtn = document.querySelector('a[href="press.html"]');

let countdown;
let timeLeft = 10;

if (hoverBox && cardContinueBtn) {
    cardContinueBtn.classList.add('disabled');

    hoverBox.addEventListener('mouseenter', () => {
        timeLeft = 10; 
        timerDisplay.innerText = timeLeft + "s";
        timerDisplay.classList.add('timer-active');
        hoverBox.innerText = "Keep Still...";

        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft + "s";

            if (timeLeft <= 0) {
                clearInterval(countdown);
                cardContinueBtn.classList.remove('disabled');
                hoverBox.innerText = "Unlocked!";
                hoverBox.classList.add('unlocked');
                timerDisplay.classList.remove('timer-active');
            }
        }, 1000);
    });

    hoverBox.addEventListener('mouseleave', () => {
        clearInterval(countdown);
        timerDisplay.classList.remove('timer-active');
        
        if (cardContinueBtn.classList.contains('disabled')) {
            hoverBox.innerText = "Restarted!";
            timerDisplay.innerText = "10s";
            timeLeft = 10;
        }
    });
}

//Scatter logic

let targetsFound = 0;
const totalTargets = 10;

function handleScatterClick() {
    const target = document.getElementById('scatter-target');
    const container = document.getElementById('game-container');
    const counterText = document.getElementById('targets-left');
    const continueBtn = document.getElementById('scatter-continue');

    if (!target || !container) return;

    targetsFound++;

    if (targetsFound < totalTargets) {
        const newSize = Math.floor(Math.random() * 60) + 40;
        
        const maxX = container.clientWidth - newSize;
        const maxY = container.clientHeight - newSize;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        target.style.width = newSize + 'px';
        target.style.height = newSize + 'px';
        target.style.left = randomX + 'px';
        target.style.top = randomY + 'px';
        
        counterText.innerText = `Targets remaining: ${totalTargets - targetsFound}`;
    } else {
        target.style.display = 'none'; 
        counterText.innerText = "Great job! All targets found.";
        counterText.style.color = "#28a745";
        
        if (continueBtn) {
            continueBtn.classList.remove('disabled');
        }
    }
}

//  DRAG AND DROP LOGIC 
let itemsCleaned = 0; 
const totalItems = 5;

document.querySelectorAll('.clutter-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.id);
    });
});

const dropZone = document.getElementById('drop-zone');
const dragCounter = document.getElementById('items-left'); // Find the counter
const dragContinueBtn = document.getElementById('drag-continue');

if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('hover');
        
        const id = e.dataTransfer.getData('text');
        const element = document.getElementById(id);
        
        if (element) {
            element.remove(); 
            itemsCleaned++;   
            
            if (dragCounter) {
                dragCounter.innerText = "Items remaining: " + (totalItems - itemsCleaned);
            }

            if (itemsCleaned === totalItems) {
                if (dragCounter) dragCounter.innerText = "All Cleaned!";
                if (dragContinueBtn) dragContinueBtn.classList.remove('disabled');
                dropZone.innerText = "Nice Job!";
                dropZone.style.backgroundColor = "#d4edda";
            }
        }
    });
}

// rotate logic
let totalRotation = 0;
const goalRotation = 1800; // 5 full circles
const cd = document.getElementById('cd-image');
const countDisplay = document.getElementById('count');
const nextBtn = document.getElementById('next-button');

window.addEventListener('wheel', (event) => {
    // Math.abs ensures that scrolling up OR down spins the disc forward
    // Change '0.5' to adjust how much effort is needed to spin
    totalRotation += Math.abs(event.deltaY) * 0.5; 
    
    // Apply rotation via CSS transform
    cd.style.transform = `rotate(${totalRotation}deg)`;

    // Calculate progress
    let rotations = Math.floor(totalRotation / 360);
    
    // Cap the display at 5
    if (rotations <= 5) {
        countDisplay.innerText = rotations;
    }

    // Check if goal is met
    if (totalRotation >= goalRotation) {
        completeExercise();
    }
});

function completeExercise() {
    countDisplay.innerText = "5";
    nextBtn.style.display = "inline-block";
    document.getElementById('status-text').style.color = "#4CAF50"; // Turn green
}


//falling OHC logic
{
    const box = document.getElementById('game-box');
    const stats = document.getElementById('stats-display');
    const goal = 20;
    let collectedCount = 0;
    let isFinished = false;

    function spawnItem() {
        if (isFinished) return;

        const item = document.createElement('div');
        item.className = 'item';
        
        const itemSize = 40;
        const fallSpeed = 1; // Pixels to move every 16ms (~60fps)
        const maxX = box.clientWidth - itemSize;
        const startX = Math.floor(Math.random() * maxX);
        
        item.style.left = startX + 'px';
        item.style.top = -itemSize + 'px';
        box.appendChild(item);

        // Hover logic
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('pop') && !isFinished) {
                item.classList.add('pop');
                collectedCount++;
                stats.innerText = `Logos Collected: ${collectedCount} / ${goal}`;
                
                if (collectedCount >= goal) {
                    isFinished = true;
                    stats.innerText = "Goal Reached! Exercise Complete.";
                    stats.style.color = "#16a34a";
                }
                setTimeout(() => item.remove(), 200);
            }
        });

        // Movement Logic using setInterval (Always Runs)
        let currentY = -itemSize;
        const moveInterval = setInterval(() => {
            if (item.classList.contains('pop')) {
                clearInterval(moveInterval);
                return;
            }

            currentY += fallSpeed;
            item.style.top = currentY + 'px';

            // Remove if it hits bottom
            if (currentY > box.clientHeight) {
                clearInterval(moveInterval);
                item.remove();
            }
        }, 16); // 16ms is roughly 60 frames per second
    }

    // Spawn new items every 1.8 seconds
    setInterval(spawnItem, 2000);
}

// pre mouse logic

const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const wheel = document.getElementById('wheel');
const statusText = document.getElementById('status-text');
const precisionContinueBtn = document.getElementById('continue-btn');

let leftClicked = false;
let rightClicked = false;

// Disable the default right-click menu for this page
window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left Click
        leftBtn.classList.add('active');
        statusText.innerText = "That's the Left Click!";
        leftClicked = true;
    } else if (e.button === 2) { // Right Click
        rightBtn.classList.add('active');
        statusText.innerText = "That's the Right Click!";
        rightClicked = true;
    }
    
    checkReady();
});

window.addEventListener('mouseup', (e) => {
    if (e.button === 0) leftBtn.classList.remove('active');
    if (e.button === 2) rightBtn.classList.remove('active');
});

window.addEventListener('wheel', () => {
    wheel.classList.add('active');
    statusText.innerText = "That's the Scroll Wheel";
    setTimeout(() => wheel.classList.remove('active'), 200);
});



//practicals logic

document.querySelector(".email").onclick = () => {
  alert("Correct! You found the Send Email button.");
};

document.querySelector(".subscribe").onclick = () => {
  alert("Correct! You found the Follow button.");
};

document.querySelector(".message").onclick = () => {
  alert("Correct! You found the Message button.");
};

document.querySelector(".youtube").onclick = () => {
  alert("Correct! You found the YouTube Subscribe button.");
};
document.querySelector(".search").onclick = () => {
  alert("Correct! You found the search button.");
};

// car logic
window.addEventListener('scroll', () => {
    const road = document.getElementById('road');
    const progressText = document.getElementById('progress');

    // 1. Calculate how far the user has scrolled (0 to 1)
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    // 2. Define the road movement
    // The road starts at -3500px and ends at 0px
    const startPos = -3500; 
    const endPos = 0;
    
    // Calculate current position based on scroll
    const currentPos = startPos + (scrollPercent * Math.abs(startPos));

    // 3. Apply the movement
    road.style.transform = `translateX(${currentPos}px)`;

    // 4. Update UI
    const displayPercent = Math.floor(scrollPercent * 100);
    progressText.innerText = `Distance: ${displayPercent}%`;

    if (displayPercent >= 100) {
        progressText.style.background = "gold";
        progressText.innerText = "Finish! 🏁";
    }
});