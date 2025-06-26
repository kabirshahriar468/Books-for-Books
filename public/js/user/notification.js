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

async function sell(data){

    //const reqData = new FormData();
    const isbn=data.sellisbn;
    const buyer=data.buyer;
    const seller=data.seller;
    const reqData={
        isbn:isbn,
        buyer:buyer,
        seller:seller
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
        const response = await fetch(`/notifications/sell`,
                               
                            {method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: sentval});
        const data = await response.json();

        if (data.success=='sent') {
            await Swal.fire({
                icon: 'success',
                title: 'Sold Successfully!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            //window.location.href = '/userdashboard';
        } else  {
            await Swal.fire({
                icon: 'error',
                title:' Selling failed!',
                text: data.message,
                showConfirmButton: false,
                background: '#f5c6c6',
                timer: 2500
            })
            console.log('Login failed');
            res.render('/userdashboard');
        }
    }catch (error) {
        console.error('Error:', error);
    }
   
}


async function exchange(val){
    //const data=getvals();


    // const takeisbn=data.isbn;
    // const buyer=data.buyer;
    // const seller=data.seller;
    const takeisbn=val.takeisbn;
    const buyer=val.buyer;
    const seller=val.seller;
    const giveisbn=val.giveisbn;
    //const price=data.price;


    // const giveisbn=inputExchangeIsbn.value;
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
        const response = await fetch(`/notifications/exchange`,
                               
                            {method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: sentval});
        const data = await response.json();
        

        if (data.success=='sent') {
            await Swal.fire({
                icon: 'success',
                title: 'Exchanged Successfully!',
                showConfirmButton: false,
                background: '#e1f5c6',
                timer: 2500
            })
            console.log("Success!");
            //window.location.href = '/userdashboard';
        } else if(data.success=='error') {
            await Swal.fire({
                icon: 'error',
                title: 'Exchanging failed!',
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

