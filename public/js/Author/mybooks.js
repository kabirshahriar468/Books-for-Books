document.addEventListener("DOMContentLoaded", function() {
    const bookCards = document.querySelectorAll(".book-card");

    function showPopup(index) {
        const popup = document.getElementById(`bookpopup${index}`);
        if (popup) {
            popup.style.display = "flex";
        }
    }

    function hidePopup(index) {
        const popup = document.getElementById(`bookpopup${index}`);
        if (popup) {
            popup.style.display = "none";
        }
    }

    bookCards.forEach((bookCard, index) => {
        bookCard.addEventListener("click", (event) => {
            event.stopPropagation(); 
            // Prevent the click event from propagating to the window
            showPopup(index);
        });
    });

    // Handle click outside of popups to close them
    window.addEventListener("click", (event) => {
        bookCards.forEach((bookCard, index) => {
            hidePopup(index);
        });
    });
});



// const exploreLink = document.getElementById("explore");
// exploreLink.addEventListener("click", (event) => {
//     event.preventDefault();
//     window.location.href = `/explore`; 
// });

const dashLink = document.getElementById("dashboard");
dashLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/authordashboard`; 
});