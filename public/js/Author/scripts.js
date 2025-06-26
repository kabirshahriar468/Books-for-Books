const userIDInput = document.getElementById("inputUserID");
const passwordInput = document.getElementById("inputPassword");


async function processInput(event) {
    event.preventDefault();
    const userID = userIDInput.value;
    const password = passwordInput.value;

    // Make an API request to your backend
    try {
        const response = await fetch(`/authorlogin/${userID}/${password}`);
        const data = await response.json();

        if (data.success) {
            // Redirect to a new page on successful login
            //alert("Success");
            await Swal.fire({
                icon: 'success',
                title: 'Log in successful!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            window.location.href = `/authordashboard`;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Log in failed!',
                text: 'Wrong username or password',
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



