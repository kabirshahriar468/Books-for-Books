//reference

let input = document.getElementById("inputISBN");
let inputBookTitle=document.getElementById("inputBookTitle");
let inputPublishYear=document.getElementById("inputPublishYear");
let inputDescription=document.getElementById("inputDescription");
let inputPublisher=document.getElementById("inputPublisher");
let inputPublisherUrl=document.getElementById("inputPublisherUrl");
let inputAuthorName=document.getElementById("inputAuthorName");
let inputPrice=document.getElementById("inputPrice");
let photoInput = document.getElementById("inputPhoto");
let inputGenre1=document.getElementById("inputGenre1");
let inputGenre2=document.getElementById("inputGenre2");
let inputGenre3=document.getElementById("inputGenre3");

//Execute function on keyup
input.addEventListener("keyup",async (e) => {
    const response = await fetch(`/useraddbook/getISBN`);
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


inputGenre1.addEventListener("keyup",async (e) => {
    // const response = await fetch(`/useraddbook/getISBN`);
    // const data = await response.json();

    const names=["Action","Adventure","Romantic","Comic","Detective","Mystery","Fantasy","History","Horro","Sci-fi","Comedy","Thriller","Biography","Cookbook","Religion"];
    //let names = data.success;
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
            j.startsWith(inputGenre1.value) &&inputGenre1.value != ""
        ) {
            //create li element
            let listItem = document.createElement("li");
            //One common class name
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick", "displayGenres('" + i + "')");
            //Display matched part in bold
            let word = "<b>" + j.substr(0, inputGenre1.value.length) + "</b>";
            word += j.substr(inputGenre1.value.length);
            //display the value in array
            listItem.innerHTML = word;
            
            document.querySelector(".listGenre1").appendChild(listItem);
        }
    }
});
async function displayGenres(value){
    inputGenre1.value=value;
    removeElements();
}


inputGenre2.addEventListener("keyup",async (e) => {
    // const response = await fetch(`/useraddbook/getISBN`);
    // const data = await response.json();

    const names=["Action","Adventure","Romantic","Comic","Detective","Mystery","Fantasy","History","Horro","Sci-fi","Comedy","Thriller","Biography","Cookbook","Religion"];
    //let names = data.success;
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
            j.startsWith(inputGenre2.value) &&inputGenre2.value != ""
        ) {
            //create li element
            let listItem = document.createElement("li");
            //One common class name
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick", "displayGenres2('" + i + "')");
            //Display matched part in bold
            let word = "<b>" + j.substr(0, inputGenre2.value.length) + "</b>";
            word += j.substr(inputGenre2.value.length);
            //display the value in array
            listItem.innerHTML = word;
            
            document.querySelector(".listGenre2").appendChild(listItem);
        }
    }
});
async function displayGenres2(value){
    inputGenre2.value=value;
    removeElements();
}


inputGenre3.addEventListener("keyup",async (e) => {
    // const response = await fetch(`/useraddbook/getISBN`);
    // const data = await response.json();

    const names=["Action","Adventure","Romantic","Comic","Detective","Mystery","Fantasy","History","Horro","Sci-fi","Comedy","Thriller","Biography","Cookbook","Religion"];
    //let names = data.success;
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
            j.startsWith(inputGenre3.value) &&inputGenre3.value != ""
        ) {
            //create li element
            let listItem = document.createElement("li");
            //One common class name
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick", "displayGenre3('" + i + "')");
            //Display matched part in bold
            let word = "<b>" + j.substr(0, inputGenre3.value.length) + "</b>";
            word += j.substr(inputGenre3.value.length);
            //display the value in array
            listItem.innerHTML = word;
            
            document.querySelector(".listGenre3").appendChild(listItem);
        }
    }
});
async function displayGenre3(value){
    inputGenre3.value=value;
    removeElements();
}
async function displayNames(value) {
    input.value = value;
    const isbn=value;
    removeElements();
    //const response = await fetch(`/addbook/getISBNdata`,{method: 'POST', body: isbn});
    const response = await fetch(`/useraddbook/getISBNdata/${isbn}`);

    const data = await response.json();
    // const bookInfoObject={
    //     title:bookParam[0][1],
    //     publishYear:bookParam[0][2],
    //     description:bookParam[0][3],
    //     publisher:publisher[0][0],
    //     publisherURL:publisherURL[0][0],
    //     author:author[0][0],
    //     price:price[0][0]
    // };
    console.log("Title: "+data.bookInfoObject.title+"    URL:"+data.bookInfoObject.publisherURL+"    Author:"+data.bookInfoObject.author);

    inputBookTitle.value=data.bookInfoObject.title;
    inputPublishYear.value=data.bookInfoObject.publishYear;
    inputDescription.value=data.bookInfoObject.description;
    inputPublisher.value=data.bookInfoObject.publisher;
    inputPublisherUrl.value=data.bookInfoObject.publisherURL;
    inputAuthorName.value=data.bookInfoObject.author;
    //inputPrice.value=data.bookInfoObject.price;

        // if (data.success) {
        //     await Swal.fire({
        //         icon: 'success',
        //         title: 'Sign up successful!',
        //         showConfirmButton: false,
        //         background: '#e1f5c6',
        //         timer: 2500
        //     })
        //     console.log("Success!");
        //     window.location.href = '/dashboard';
        // } 

}
function removeElements() {
    //clear all the item
    let items = document.querySelectorAll(".list-items");
    items.forEach((item) => {
        item.remove();
    });
}


async function processInput(event) {
    event.preventDefault();

    const Isbn=input.value;
    const Title= inputBookTitle.value;
    const PublishYear=inputPublishYear.value;
    const Description=inputDescription.value;
    const Publisher=inputPublisher.value;
    const PublisherUrl=inputPublisherUrl.value;
    const AuthorName=inputAuthorName.value;
    const Price=inputPrice.value;
    let genre1=inputGenre1.value;
    let genre2=inputGenre2.value;
    let genre3=inputGenre3.value;
    const bookData = new FormData();
    bookData.append('ISBN', Isbn);
    bookData.append('Title', Title);
    bookData.append('PublishYear', PublishYear);
    bookData.append('Description', Description);
    bookData.append('Publisher', Publisher);
    bookData.append('PublisherUrl', PublisherUrl);
    bookData.append('AuthorName',AuthorName);
    bookData.append('Price',Price);
    bookData.append('Genre1',genre1);
    bookData.append('Genre2',genre2);
    bookData.append('Genre3',genre3);
    bookData.append('photo', photoInput.files[0]);

    console.log(" valuesss:  "+bookData.ISBN);

    // Make an API request to your backend
    try {
        const response = await fetch(`/useraddbook/submitInfo`,{method: 'POST'
        , body: bookData});
        const data = await response.json();

        if (data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Successfully Added !',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            window.location.href = '/userdashboard';
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Adding failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log('Login failed');
            res.render('/userdashboard');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}