const exploreLink = document.getElementById("dashboard");

let input = document.getElementById("exchangeISBN");

let varisbn='99999';
let varseller='tempo';
let varbuyer='tempo';
exploreLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `/userdashboard`; 
});
const inputExchangeIsbn=document.getElementById("exchangeISBN");



// document.addEventListener("DOMContentLoaded", function() {
//     const bookCards = document.querySelectorAll(".book-card");
//     const popup = document.querySelectorAll(".popup");

//     let index;
//     function showPopup(index) {
//         const popup = document.getElementById(`bookpopup${index}`);
//         if (popup) {
//             index=index;
//             console.log("show popup callled");
//             popup.style.display = "flex";
//         }
//     }

//     function hidePopup(index) {
//         console.log("hide popup callled");
//         const popup = document.getElementById(`bookpopup${index}`);
//         if (popup) {
//             popup.style.display = "none";
//         }
//     }

//     bookCards.forEach((bookCard, index) => {
//         bookCard.addEventListener("click", (event) => {
//             event.stopPropagation(); 
//             console.log("bookcards func");
//             // Prevent the click event from propagating to the window
//             showPopup(index);
//         });
//     });
//     popup.forEach((popup, index) => {
//         popup.addEventListener("click", (event) => {
//             event.stopPropagation(); 
//             console.log("bookcar###############s func");
//             // Prevent the click event from propagating to the window
//             hidePopup(index);
//         });
//     });

//     // Handle click outside of popups to close them
//     window.addEventListener("click", (event) => {

//         bookCards.forEach((bookCard, index) => {
//             event.stopPropagation(); 
//             hidePopup(index);
//         });
//         hidePopup(index);
//     });
// });
async function buy(data){

    //const reqData = new FormData();
    const isbn=data.isbn;
    const buyer=data.buyer;
    const seller=data.seller;
    const price=data.price;
    const reqData={
        isbn:isbn,
        buyer:buyer,
        seller:seller,
        price:price
    };
    // reqData.append('isbn', isbn);
    // reqData.append('buyer', buyer);
    // reqData.append('seller', seller);
    // reqData.append('price', price);
    const sentval=JSON.stringify(reqData);

    console.log("values:  "+data.buyer+"   "+data.seller+"    "+data.isbn+"    "+data.price);
    console.log("values:  "+reqData.isbn+"   "+reqData.seller+"    "+reqData.buyer+"    ");

    // Make an API request to your backend      
    try {
        const response = await fetch(`/request/buy`,
                               
                            {method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: sentval});
        const data = await response.json();

        if (data.success=='sent') {
            await Swal.fire({
                icon: 'success',
                title: 'Buy Request Sent Successfully!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            //window.location.href = '/userdashboard';
        } else if(data.success=='error') {
            await Swal.fire({
                icon: 'error',
                title: 'Request sending failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log('Login failed');
            res.render('/userdashboard');
        }else{
            await Swal.fire({
                icon: 'error',
                title: 'Request already sent!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
        }
    }catch (error) {
        console.error('Error:', error);
    }
   
}

async function getvals(data){
    // const takeisbn=data.isbn;
    // const buyer=data.buyer;
    // const seller=data.seller;
    varisbn=data.isbn;
    varbuyer=data.buyer;
    varseller=data.seller;
    //const price=data.price;
    // const giveisbn=inputExchangeIsbn.value;
    // const reqData={
    //     isbn:takeisbn,
    //     buyer:buyer,
    //     seller:seller
    // };
    // reqData.append('isbn', isbn);
    // reqData.append('buyer', buyer);
    // reqData.append('seller', seller);
    // reqData.append('price', price);
    // const sentval=JSON.stringify(reqData);
    // console.log("Params sentval===  "+sentval.isbn+"   "+sentval.buyer+"    "+sentval.seller);
    // console.log("Params reqdata===  "+reqData.isbn+"   "+reqData.buyer+"    "+reqData.seller);
    // //return sentval;
    // return reqData;
    
        
}
async function exchange(val){
    //const data=getvals();


    // const takeisbn=data.isbn;
    // const buyer=data.buyer;
    // const seller=data.seller;
    const takeisbn=varisbn;
    const buyer=varbuyer;
    const seller=varseller;
    //const price=data.price;


    const giveisbn=inputExchangeIsbn.value;
    const reqData={
        takeisbn:takeisbn,
        buyer:buyer,
        seller:seller,
        giveisbn:giveisbn
    };
    // reqData.append('isbn', isbn);
    // reqData.append('buyer', buyer);
    // reqData.append('seller', seller);
    // reqData.append('price', price);
    const sentval=JSON.stringify(reqData);

    //console.log("values:  "+data.buyer+"   "+data.seller+"    "+data.isbn+"    giveisbn:"+giveisbn);
    console.log("values:  "+reqData.takeisbn+"   "+reqData.seller+"    "+reqData.buyer+"    "+reqData.giveisbn);
    // Make an API request to your backend      
    try {
        const response = await fetch(`/request/exchange`,
                               
                            {method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: sentval});
        const data = await response.json();
        

        if (data.success=='sent') {
            await Swal.fire({
                icon: 'success',
                title: 'Exchange Request Sent Successfully!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            //window.location.href = '/userdashboard';
        } else if(data.success=='error') {
            await Swal.fire({
                icon: 'error',
                title: 'Request sending failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log('Login failed');
            res.render('/userdashboard');
        }else{
            await Swal.fire({
                icon: 'error',
                title: 'Request already sent!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
        }
    }catch (error) {
        console.error('Error:', error);
    }
}




input.addEventListener("keyup",async (e) => {
    console.log("Inside keyup fetching ");
    const response = await fetch(`/request/getISBN`);
    const data = await response.json();
    let names = data.success;
    console.log(names);
    //Sort names in ascending order
    let sortedNames = names.sort();
    //loop through above array
    //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
    removeElements();
    for (let i of sortedNames) {
        //convert input to lowercase and compare with each string
        //let j=90;
        let j=i.toString();
        if (
            // i.toLowerCase().startsWith(input.value.toLowerCase()) &&input.value != ""
            j.startsWith(input.value) &&input.value != ""
        ) {
            //create li element
            let listItem = document.createElement("li");
            //One common class name
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick", "displayNames('" + i + "')");
            //Display matched part in bold
            let word = "<b>" + j.substr(0, input.value.length) + "</b>";
            word += j.substr(input.value.length);
            //display the value in array
            listItem.innerHTML = word;
            document.querySelector(".list").appendChild(listItem);
        }
    }
});
async function displayNames(value) {
    input.value = value;
    const isbn=value;
    removeElements();
    //const response = await fetch(`/addbook/getISBNdata`,{method: 'POST', body: isbn});
    

}
function removeElements() {
    //clear all the item
    let items = document.querySelectorAll(".list-items");
    items.forEach((item) => {
        item.remove();
    });
}
