// const userIDInput = document.getElementById("inputUserID");
// const passwordInput = document.getElementById("inputPassword");


async function userLogin(event) {
    event.preventDefault();
    try{
        window.location.href = `/userindex`;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
async function authorLogin(event) {
    event.preventDefault();
    try{
        window.location.href = `/authorindex`;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
async function publisherLogin(event) {
    event.preventDefault();
    try{
        window.location.href = `/publisherindex`;
    }
    catch (error) {
        console.error('Error:', error);
    }
}



