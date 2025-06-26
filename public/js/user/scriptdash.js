document.addEventListener("DOMContentLoaded", function () {
    // Function to scroll to the bottom of the .posts container
    function scrollToBottom() {
        var postsContainer = document.querySelector(".right .blog .posts");
        postsContainer.scrollTop = postsContainer.scrollHeight;
    }

    // Call scrollToBottom when the page loads and when new posts are added
    scrollToBottom();

    // Example of adding a new post
    //const sendButton = document.querySelector(".send-btn");
    const sendButton = document.querySelector(".material-symbols-outlined.send-btn");
    //const notification_count=document.querySelector(".notification-count");
    if (sendButton) {
        sendButton.addEventListener("click",async function() {
            const textarea = document.getElementById("postContent");
            const postContent = textarea.value.trim();

            console.log(postContent);
            console.log(JSON.stringify({ content: postContent }));

            if (postContent !== '') {
                try {
                    const response = await fetch('/useraddpost', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ content: postContent })
                    });
                    
                    console.log('Sent body:', JSON.stringify({ postContent }));
                    const data = await response.json();
    
                    if (data.success) {
                        location.reload();
                    } else {
                        console.log('Error adding post:', data.message);
                    }
                } catch (error) {
                    console.error('Error adding post:', error);
                }
            }
            scrollToBottom();
        });
    }
    // const logOutButton = document.querySelector(".log-out-btn");
    // if(logOutButton){
        
    //     logOutButton.addEventListener("click", function() {
    //         //window.location.href= `/`;
    //         console.log("calling logout route....");

    //         fetch('/logout');
    //     });
    //    // window.location.href= `/`;

    // }

});


const editLink = document.getElementById("userInfo");
editLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/editUser`; 
});


const mybooksLink = document.getElementById("mybooks");
mybooksLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/mybooks`; 
});

const searchLink = document.getElementById("search");
    searchLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/search`; 
});

