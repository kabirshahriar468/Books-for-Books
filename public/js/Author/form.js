const userIDInput = document.getElementById("inputUserID");
const fullNameInput = document.getElementById("inputFullName");
// const emailInput = document.getElementById("inputEmail");
const phoneInput = document.getElementById("inputPhone");
const addressInput = document.getElementById("inputAddress");
// const passwordInput = document.getElementById("inputPassword");
//const photoInput = document.getElementById("inputPhoto");

const authorNameInput = document.getElementById("inputUserID");
const emailInput = document.getElementById("inputEmail");
const urlInput = document.getElementById("inputPhone");
const descriptionInput = document.getElementById("inputAddress");
const passwordInput = document.getElementById("inputPassword");
const photoInput = document.getElementById("inputPhoto");

async function processInput(event) {
    event.preventDefault();

    const authorName = authorNameInput.value;
    // const fullName = fullNameInput.value;
    const email = emailInput.value;
    const url = urlInput.value;
    const description = descriptionInput.value;
    const password = passwordInput.value;

    const formData = new FormData();
    formData.append('authorName', authorName);
    formData.append('email', email);
    formData.append('url', url);
    formData.append('description', description);
    formData.append('password', password);
    formData.append('photo', photoInput.files[0]);



    // Make an API request to your backend
    try {
        const response = await fetch(`/authorsignup`,{method: 'POST'
        , body: formData});
        const data = await response.json();

        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Sign up successful!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            window.location.href = '/authordashboard';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Sign up failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log('Login failed');
            res.render('/');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}