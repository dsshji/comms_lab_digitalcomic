let box = document.getElementById('boxInteraction');
let boxSound = new Audio("boxSound.m4a")

//triggers fucntiuons when user clicks the box
function nextPanel(){
    window.location.href = "panel5/index.html" //FIX THIS AND ADD REAL LINK TO PANEL 5
}

function boxSoundEffect(){
    boxSound.play();
    setTimeout(nextPanel, 500) //waits 0.5 secs then runs the function that goes to the next panel
}

box.addEventListener('click', boxSoundEffect);