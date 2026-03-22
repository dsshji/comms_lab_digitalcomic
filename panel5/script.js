AOS.init();
AOS.init({ duration: 600, easing: "ease", once: false, offset: 0 });

const dropZone = document.querySelector(".drop-zone");
const finalImage = document.querySelector(".final-image");
const heroSection = document.querySelector(".hero");
const endSection = document.querySelector(".end-section");
const backPanel4 = document.getElementById("back-panel4");
const backPuzzle = document.getElementById("back-puzzle");
let heartbeatSound = new Audio("assets/heartbeat-sound.mov");
let flatlineSound = new Audio("assets/flatline-sound.mov");
let flatlinePlayed = false;

backPanel4.addEventListener("click", () => {
    window.location.href = "../panel4/index.html";
});

backPuzzle.addEventListener("click", () => {
    window.location.href = "../panel5/index.html";
});

const images = [
    "../panel5/assets/puzzle/piece1.svg",
    "../panel5/assets/puzzle/piece2.svg",
    "../panel5/assets/puzzle/piece3.svg",
    "../panel5/assets/puzzle/piece4.svg"
];

let activePiece = null;
let offsetX = 0;
let offsetY = 0;
let placedCorrectly = 0;

/* CREATE PIECES */
images.forEach((src, index) => {

    const piece = document.createElement("img");
    piece.src = src;
    piece.classList.add("piece");
    piece.dataset.index = index;
    piece.dataset.placed = "false";

    /* Random place puzzle pieces */
    let left, top;
    left = Math.random() * 70 + 10;
    top = Math.random() * 70 + 10;
    piece.style.left = left + "%";
    piece.style.top = top + "%";


    if (piece.dataset.index === "1" || piece.dataset.index === "2") {
        piece.style.width = "8%";
    } else {
        piece.style.width = "10%";
    }

    document.body.appendChild(piece);

    piece.addEventListener("click", (e) => {

        /* If nothing is active → pick up */
        if (!activePiece && piece.dataset.placed === "false") {
            activePiece = piece;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            piece.style.zIndex = 1000;
        }

        /* If clicking same piece again → drop */
        else if (activePiece === piece) {
            const clickX = e.clientX;
            const clickY = e.clientY;
            releasePiece(activePiece, clickX, clickY);
        }

        e.stopPropagation();
    });
});

/* Move with cursor */
document.addEventListener("mousemove", (e) => {
    if (!activePiece) return;

    activePiece.style.left = (e.clientX - offsetX) + "px";
    activePiece.style.top = (e.clientY - offsetY) + "px";
});

/* Clicking anywhere else drops piece */
document.addEventListener("click", (event) => {
    if (activePiece) {
        const clickX = event.clientX;
        const clickY = event.clientY;
        releasePiece(activePiece, clickX, clickY);
    }
});

function releasePiece(piece, clickX, clickY) {
    piece.style.transition = "all 0.3s ease";
    checkSnap(piece, clickX, clickY);
    activePiece = null;
    console.log(`Released piece ${piece.dataset.index} at (${clickX}, ${clickY})`);
}

function checkSnap(piece, clickX, clickY) {

    const dropRect = dropZone.getBoundingClientRect();
    const index = parseInt(piece.dataset.index);

    if (index == 0) {
        if (
            dropRect.left <= clickX &&
            clickX <= dropRect.left + dropRect.width * 0.5 &&
            dropRect.top <= clickY &&
            clickY <= dropRect.top + dropRect.height * 0.5
        ) {
            piece.dataset.placed = "true";
            piece.style.pointerEvents = "none";
            piece.style.left = dropRect.left + "px";
            piece.style.top = dropRect.top + "px";

            placedCorrectly++;

            if (placedCorrectly === 4) {
                completePuzzle();
            }
        }
    } else if (index == 1) {
        if (
            clickX >= dropRect.left + dropRect.width / 2 &&
            clickX <= dropRect.left + dropRect.width &&
            clickY >= dropRect.top &&
            clickY <= dropRect.top + dropRect.height / 2
        ) {
            piece.dataset.placed = "true";
            piece.style.pointerEvents = "none";
            piece.style.left = dropRect.left + dropRect.width / 2 + "px";
            piece.style.top = dropRect.top + "px";


            placedCorrectly++;

            if (placedCorrectly === 4) {
                completePuzzle();
            }
        }
    } else if (index == 2) {
        if (dropRect.left <= clickX && clickX <= dropRect.left + (0.5 * dropRect.width) &&
            (dropRect.top + (0.5 * dropRect.height)) <= clickY && clickY <= dropRect.top + dropRect.height) {
            piece.dataset.placed = "true";
            piece.style.pointerEvents = "none";
            piece.style.left = dropRect.left + "px";
            piece.style.top = dropRect.top + 0.35 * dropRect.height + "px";


            placedCorrectly++;

            if (placedCorrectly === 4) {
                completePuzzle();
            }
        }
    } else if (index == 3) {
        if ((dropRect.left + (0.5 * dropRect.width)) <= clickX && clickX <= dropRect.left + dropRect.width &&
            (dropRect.top + (0.5 * dropRect.height)) <= clickY && clickY <= dropRect.top + dropRect.height) {
            piece.dataset.placed = "true";
            piece.style.pointerEvents = "none";
            piece.style.left = dropRect.left + 0.35 * dropRect.width + "px";
            piece.style.top = dropRect.top + 0.5 * dropRect.height + "px";
            placedCorrectly++;
            if (placedCorrectly === 4) {
                completePuzzle();
            }
        }
    }
}

function completePuzzle() {

    const title = document.getElementById("title");

    document.querySelectorAll(".piece").forEach(p => {
        p.style.opacity = "0";
        p.style.transition = "opacity 0.6s ease";
    });

    dropZone.style.opacity = "0";
    title.style.display = "none";
    backPanel4.style.display = "none";

    setTimeout(() => {

        heroSection.style.display = "block";
        endSection.style.display = "block";

        // a frame before initializing GSAP
        requestAnimationFrame(() => {
            initGSAP();
            ScrollTrigger.refresh();
        });
        heartbeatSound.play();
    }, 700);
}

function initGSAP() {
    const object = document.getElementById("monitor");
    const background = document.querySelector(".final-image");

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true
        }
    });

    tl.to(background, { opacity: 0 }, 0);
    tl.to(backPuzzle, { display: "none" }, 0);

    tl.to(object, {
        y: "10%",
        scale: 2,
    }, 0);

    tl.add(() => {
        object.src = "assets/flatline.gif";
        // Plat flatline sound
        if (!flatlinePlayed) {
            flatlineSound.play();
            flatlinePlayed = true;
        }
    }, 0.3);
}