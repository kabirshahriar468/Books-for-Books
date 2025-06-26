const userIDInput = document.getElementById("inputUserID");
const fullNameInput = document.getElementById("inputFullName");
const emailInput = document.getElementById("inputEmail");
const phoneInput = document.getElementById("inputPhone");
const addressInput = document.getElementById("inputAddress");
const passwordInput = document.getElementById("inputPassword");
const photoInput = document.getElementById("inputPhoto");


async function processEdit(event) {
    event.preventDefault();

    const userID = userIDInput.value;
    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;
    const password = passwordInput.value;
    const photo = photoInput.value;


    // const formData = new FormData();
    // formData.append('userID', userID);
    // formData.append('fullName', fullName);
    // formData.append('email', email);
    // formData.append('phone', phone);
    // formData.append('address', address);
    // formData.append('password', password);
    // formData.append('photo', photo);

    const reqData = {
        userID: userID,
        fullName: fullName,
        email: email,
        phone: phone,
        address: address,
        password: password,
        photo: photo
    }

    const sentval = JSON.stringify(reqData);
    // Make an API request to your backend
    try {
        const response = await fetch(`/editrequest`,{method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: sentval});
        const data = await response.json();

        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Edit User Info successful!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            window.location.href = '/dashboard';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Edit User Info failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log("Failed!");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function processDelete(event){
    event.preventDefault();
    try {
        const response = await fetch(`/deleterequest`);
        const data = await response.json();

        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Delete User successful!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            window.location.href = '/';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Delete User failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log("Failed!");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}