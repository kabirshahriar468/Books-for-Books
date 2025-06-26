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



document.getElementById("search-button").addEventListener("click",async function () {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();

    const filterOption = document.getElementById("filter-select").value;

    try {
        const response = await fetch(`/search/${searchTerm}/${filterOption}`);
        

        if (response.status === 200) {
            // Redirect to the queriedBooks page
            window.location.href = '/search/' + searchTerm + '/' + filterOption;
            
        } else {
            console.log('Search failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
});

document.querySelectorAll("#edit-btn, #drop-btn, #sell-btn, #excng-btn").forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the click event from propagating

        // Add your specific functionality for "Buy" and "Exchange" here
        if (button.id === "edit-btn") {
            // Handle Buy button click here
            alert("Edit Button clicked!");
        } else if (button.id === "drop-btn") {
            // Handle Exchange button click here
            alert("Drop button clicked!");
        }else if(button.id === "sell-btn"){
            alert("Sell button clicked!");
        }else if(button.id === "excng-btn"){
            alert("Exvhange button clicked!");
        }
    });
});

const exploreLink = document.getElementById("explore");
exploreLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/userexplore`; 
});

const mybooksLink = document.getElementById("mybooks");
mybooksLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/mybooks`; 
});

const dashLink = document.getElementById("dashboard");
dashLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/userdashboard`; 
});
