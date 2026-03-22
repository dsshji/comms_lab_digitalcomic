let box = document.getElementById('boxInteraction');
let boxSound = new Audio("boxSound.m4a")
let backButton = document.getElementById("back-hint"); 
let fadeOverlay = document.getElementById("fade-overlay"); 

let isAnimating = false; //same logic as panel 1&2 fade from switching panels

//triggers functions when user clicks the box
function nextPanel(){
    window.location.href = "../panel5/index.html" //LINK PANEL 5 HERE
}

function boxClicked(){ //this function plays a box openeing sound, and fades to the next panel
    if (isAnimating == true){
        return;
    }
    else{
        isAnimating = true //after click ofc
        boxSound.play(); //plays box sound effect

        fadeOverlay.classList.add("active"); //fades
        setTimeout(nextPanel, 500) //waits 0.5 secs then runs the function that goes to the next panel
    }
}

box.addEventListener('click', boxClicked);

/* back navigation logic and fade */

function goesToPreviousPage(){
    window.location.href = "../panel3/index.html" // ADD REAL LINK TO PANEL 3 HERE !!!!!!
}

function previousPanel(){
    if (isAnimating == true){
        return;
    }
    else{
        isAnimating = true //after click ofc

        fadeOverlay.classList.add("active"); //fades
        setTimeout(goesToPreviousPage, 500); //waits 0.5 secs before changing webpages
    }
}

backButton.addEventListener('click', previousPanel);

