var key;
var price;
var clickedId;
var catId;
var selection;
var order;
var paid;
var orderId;
var ingrediantsJSON = [];
var total = 0;
var index = 0;
var burgerIndex = 0;
var ingrediants = [];
var pending = [];
var categories = [];
var burger = [];
var ingrediantsArray = [];  
var name;
var phone;
var email;
var address;
var store;
var collection;
var customerId;
var num;
var responseId;
var getResponse;
var ingredientsId;
var phoneId;
var emailId;
var addressId;
var userId;



function add_ingrediant(clicked_id, ingredientId){

	//set clickedId varaible for id of item clicked, so it can be used by other methods
    clickedId = clicked_id;

    //display buttons 
    document.getElementById("addToOrder").style.visibility="visible";

    //set key as the id of the selected item
    key = clicked_id + "1";
    
    //get name of selected iteam
    name = document.getElementById(clicked_id).getAttribute("title");

    //find out what food category the item belongs too
    var input = document.getElementById(clicked_id);
    var li = input.parentNode;
    var ul = li.parentNode;
    catId = ul.getAttribute("id");
    
    //if category item exists in category list and is not a filling do nothing and display alert 
    if ((catId in categories) && (catId == "bun")) {

           alert("Sorry you are limited to one " + catId + " option.");

    //if category item exists in category list and has already been selected increment quantity by 1 and update console
    } else if ((catId in categories) && (key in ingrediants)) { 
            
            //increase quantity in array of that food item
            ingrediants[key]++; 

            //remove food item
            $('#' + key).remove(); 

            //re-add updated food item to list
            addItem(name);
      

    //if new ingrediant add its category to array and ingrediant
    } else {
    
    	//add the ingrediants category to category array
        categories[catId] = ""; 

        //add ingrediant to ingrediants list with quantity of 1
        ingrediants[key] = 1;

        //add ingrediant too display console
        addItem(name);
    
    }
};


  function addItem(name){

    //get single price of item clicked
    price = document.getElementById(clickedId).getAttribute("price");

    //add single price to the total price of all items selected
    total += parseInt(price);

    //update total price on screen
    document.getElementById("price").innerHTML = total; 

   	//constructor for HTML UL list elements
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    var input = document.createElement("input");

    //create new list element and add the delete icon
    li.setAttribute("id", key);
    li.setAttribute("title", name);
    input.setAttribute("type", "image");
    input.setAttribute("src", "img/delete.png");
    input.setAttribute("id", "delete" + key);
    input.setAttribute("class", "delete");
    input.setAttribute("price", price);
    input.setAttribute("cat", catId);
    input.setAttribute('onclick','remove(this.id);' + onclick);
    li.appendChild(input);
    li.appendChild(document.createTextNode(name + " x" + ingrediants[key]));
    ul.appendChild(li);

};


//remove function to delete the ingrediant item form the order list
function remove(clicked_id){

    clickedId = clicked_id;

    //get id of li element we want to delete
    var doc = document.getElementById(clickedId);
    var parentList = doc.parentNode;
    var parentListItem = parentList.getAttribute("id")
    key = parentListItem;

    //work out the total price of the deleted items
    var stringPrice = document.getElementById(clickedId).getAttribute("price");
    var intPrice = parseInt(stringPrice);
    var intQuantity = parseInt(ingrediants[key]);
    var totalRemovedPrice = (intPrice * intQuantity); 
    
    //remove the price of the deleted items from the total and update the screen
    total -= totalRemovedPrice; 
    document.getElementById("price").innerHTML = total;

    //remove the item from the order list and update the array
    $('#' + parentListItem).remove();
    ingrediants[key] = 0;
 
    //remove the ingrediant category from the category array
 	var catIdd = doc.getAttribute("cat");
    delete categories[catIdd];

    //hide the buttons if their are no items in the list
    if ($("#list li").length == 0) {
        document.getElementById("addToOrder").style.visibility="hidden";
    }

}

//add to order button
//this function saves the array of ingrediants to the pending 2d array and resets everything for the next burger order
function addToOrder(){

	//only run function if their is something in the ingrediant list
	if (Object.keys(ingrediants).length > 0) {

   		//copy ingrediants to the pending array
	    pending.push(ingrediants); 

	    //reset the burger array and index counter
	    burger.length = 0;
	    burgerIndex = 0;

	    //for every ingrediant in the ingrediant array get the name and add it too the burger array in the desired string format 
	    for(var key in ingrediants) {
	       if(ingrediants.hasOwnProperty(key)) {

    	        var name = document.getElementById(key).getAttribute("title");

                if(burgerIndex != 0){

    	           burger[burgerIndex] = (" " + name + " x" + ingrediants[key])

                }else{

                    burger[burgerIndex] = (name + " x" + ingrediants[key])
                }

    	         burgerIndex++;
            }
    	}
	    
	    //create new list element and add the ingrediants of the saved burger from the burger array
	    var ul = document.getElementById("list2");
	    var li = document.createElement("li");
	    li.appendChild(document.createTextNode("B" + (index+1) + " = " + burger.toString()));
	    ul.appendChild(li);

        //convert ingrediants to JSON array
        var obj = {"selection":burger.toString() };
        ingrediantsArray.push(obj);

	        
	    //empty the ingrediant and category arrays and remove from display console
	    ingrediants = [];
	    categories = [];
	    $('#list').empty();

	    //increment the index so we know how many burgers we have in pending list and update display console
	    index++;
	    document.getElementById('pending').innerHTML = index;

        //show Place Order button
        document.getElementById('placeOrder').style.visibility="visible";

	}
    
}

function get_order(clicked_id){

    $('#list').empty();

    clickedId = clicked_id;

    order = document.getElementById(clickedId);

    price = order.getAttribute("price");

    orderId = order.getAttribute("orderId");

    paid = order.getAttribute("paid");

    selection = order.getAttribute("selection");

    //constructor for HTML UL list elements
    var ul = document.getElementById("list");
    var li = document.createElement("li");
    

    //create new list element
    li.setAttribute("id", orderId+1);
    li.appendChild(document.createTextNode(selection));
    ul.appendChild(li);

    document.getElementById("price").innerHTML = price;
    document.getElementById("paid").innerHTML = paid;
    document.getElementById("completeOrder").style.visibility="visible";


}

function placeOrder(){

    var dt = new Date();
    var orderTime = dt.toISOString();
    userId = sessionStorage.getItem("userId");
    collection = sessionStorage.getItem("collection");


    // var myObj2 = {
    //     "orders": [
    //         { "id":2, customerId:"12", "totalPrice":total, "orderTime":time, "name":name, "paid":"Paid", "phone":phone, "address":address, "delieveryType":collection, "burgers": 

    //             ingrediantsArray  

    //         }
    //     ]
    // }

    var order = {

      "OrderTime": orderTime,
      "CustomerId": userId,
      "IsCompleted": false,
      "IsPaid": true,
      "TotalPrice": price,
      "StoreId": 4,
      "DeliveryTypeId": collection,

    }
    

   var url = "https://api-beautifulburgers.azurewebsites.net/api/Orders";
   var myJSON = JSON.stringify(order);

   var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var r = JSON.parse(xhttp.response); 
            orderId = r.Id; 
            console.log("OrderId: " + orderId);
            postBurger(orderId);

        }    
           
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader ("Accept", "application/json");
    xhttp.send(myJSON);

}

// insert the burger and get the id back
function postBurger(order_id){

    var burger = {
     "OrderId": order_id, //same as the order
    }

   var url = "https://api-beautifulburgers.azurewebsites.net/api/Burgers";
   var myJSON = JSON.stringify(burger);

   var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var r = JSON.parse(xhttp.response); 
            burgerId = r.Id; 
            console.log("BurgerId: " + burgerId);
            // postIngredient(burgerId);
            location.href = "payment.html"

        }    
           
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader ("Accept", "application/json");
    xhttp.send(myJSON);

}
    
    
//insert in BurgerIngredient the ingredients, one at a time
// function postIngredient(burger_id){

//     var ingredient = {
//          "BurgerId": burger_id,
//          "IngredientId": 20
//      }

//     var url = "https://api-beautifulburgers.azurewebsites.net/api/BurgerIngredients";
//     var myJSON = JSON.stringify(ingredient);

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (xhttp.readyState === 4) {
//             console.log("finished");
//            location.href = "payment.html"
//         }    
           
//     };
//     xhttp.open("POST", url, true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.setRequestHeader ("Accept", "application/json");
//     xhttp.send(myJSON);

// }


function getOrders(){ 
        
        // phone;
        // address;
        // email;
    
    $.get("https://api-beautifulburgers.azurewebsites.net/api/Orders", function(data) { 

        var i, j, m = "";

        for (i in data) {

            if (!data[i].IsCompleted) {

                //console.log(data[i]);

                name = (data[i].Customer.FirstName);
                orderTime = (data[i].OrderTime);
                orderId = (data[i].Id);
                paid = (data[i].IsPaid);
                collection = (data[i].DeliveryType.Name);
                phoneId = (data[i].Customer.PhoneNumberId);
                emailId = (data[i].Customer.EmailId);
                addressId = (data[i].Customer.AddressId);

                
                // $.get("https://api-beautifulburgers.azurewebsites.net/api/PhoneNumbers/" + phoneId, function(data) { 
                //     phone = data; 
                //     console.log(phone); 

                // });

                // $.get("https://api-beautifulburgers.azurewebsites.net/api/Emails/" + emailId, function(data) {
                //     email = data; 
                //     console.log(email); 
                // });

                $.get("https://api-beautifulburgers.azurewebsites.net/api/Addresses/" + addressId, function(data) {
                    address = data.StreetAddress; 
                    kitchen(address);
                     
                });

                // kitchen(address, email, phone);


            }
        }
      
    });
}


function kitchen(address){
   
    var divOuter = document.getElementById("load-posts");

        //create Article
         var article = document.createElement("article");
         article.setAttribute("class", "col tile shadow");
         article.setAttribute("id", orderId);

             //create Div
             var div = document.createElement("div");
             div.setAttribute("class", "post-snip tile-copy");

                 //create H3
                 var h3 = document.createElement("h3");
                 h3.appendChild(document.createTextNode(name));
                 div.appendChild(h3);

                //create 1st H5
                var h5 = document.createElement("h5");
                h5.setAttribute("class", "date-meta");
                h5.appendChild(document.createTextNode("Order# " + orderId + " | " + "Received: " + orderTime));
                div.appendChild(h5);

                //create P
                var p = document.createElement("p");

                    //create Ul
                    var ul = document.createElement("ul");
                    ul.setAttribute("id", "orderList");

                        //create Ul
                         // for (j in myObj.orders[i].burgers) {
                            var li = document.createElement("li");
                            li.appendChild(document.createTextNode("B1: Plain Bun x1, Beef x1, Lettuce x1, Mayo Sauce x1"));
                            ul.appendChild(li);

                            var li = document.createElement("li");
                            li.appendChild(document.createTextNode("B2: Seed Bun x1, Chicken x1, Tomato x1, BBQ Sauce x1"));
                            ul.appendChild(li);

                            // var li = document.createElement("li");
                            // li.appendChild(document.createTextNode("B1" + j + ": " + myObj.orders[i].burgers[j].selection));
                            // ul.appendChild(li);
                        // }

                    p.appendChild(ul);

                div.appendChild(p);
        

                //create paid H5
                var h5 = document.createElement("h5");
                h5.setAttribute("class", "date-meta");
                h5.appendChild(document.createTextNode("Paid: " + paid ));
                div.appendChild(h5);

                //create collection H5
                var h5 = document.createElement("h5");
                h5.setAttribute("class", "date-meta");
                h5.appendChild(document.createTextNode("Collection: " + collection));
                div.appendChild(h5);

                //create phone H5
                var h5 = document.createElement("h5");
                h5.setAttribute("class", "date-meta");
                h5.appendChild(document.createTextNode("Phone: 1234"));
                div.appendChild(h5);

                //create email H5
                var h5 = document.createElement("h5");
                h5.setAttribute("class", "date-meta");
                h5.appendChild(document.createTextNode("Email: gardner.chas@gmail.com"));
                div.appendChild(h5);

                //create address H5
                if (collection == "Delivery") {
                    
                    var h5 = document.createElement("h5");
                    h5.setAttribute("class", "date-meta");
                    h5.appendChild(document.createTextNode("Address: " + address));
                    div.appendChild(h5);

                }

                //create Div
                var div1 = document.createElement("div");
                div1.setAttribute("class", "button-group");
                div1.setAttribute("id", "orderButtons");

                    //create A
                    var a = document.createElement("a");
                    a.setAttribute("onclick", "completeOrder(this.id)");
                    a.setAttribute("id", (orderId + "b"));
                    a.setAttribute("class", "button completeOrder");
                    a.appendChild(document.createTextNode("Complete"));
                    div1.appendChild(a);

            div.appendChild(div1);

        article.appendChild(div);

    divOuter.appendChild(article);       

}

function completeOrder(clicked_id){

    var ArticleID = clicked_id.substring(0, clicked_id.length-1);
    $('#' + ArticleID).remove();

    $.ajax({
        url: 'https://api-beautifulburgers.azurewebsites.net/api/Orders/' + ArticleID,
        type: 'DELETE',
        success: function(result) {
            console.log("Removed Order: " + ArticleID);
        }
    });

    $.ajax({
        url: 'https://api-beautifulburgers.azurewebsites.net/api/Burgers/' + ArticleID,
        type: 'DELETE',
        success: function(result) {
            console.log("Removed Burger: " + ArticleID);
        }
    });

        $.ajax({
        url: 'https://api-beautifulburgers.azurewebsites.net/api/BurgerIngredients/' + ArticleID,
        type: 'DELETE',
        success: function(result) {
            console.log("Removed BurgerIngredients: " + ArticleID);
        }
    });

}


var attempt = 3; //Variable to count number of attempts

function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if ( username == "chas" && password == "pass"){
        window.location = "kitchen.html"; //redirecting to other page
        return false;
    }
    else{
        attempt --;//Decrementing by one
        alert("You have left "+attempt+" attempt;");
        
        //Disabling fields after 3 attempts
        if( attempt == 0){
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            document.getElementById("submit").disabled = true;
            return false;
        }
    }
}

function pickup(){

    sessionStorage.clear();

    var name = document.getElementById("name").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var store = document.getElementById("store").value;
    var time = document.getElementById("time").value;
    var remember = document.getElementById("remember").checked;
    var num = Math.floor((Math.random() * 1000) + 1);
    var customerId = localStorage.getItem("customerId");

    if (name != "" && phone != "") {

        if (customerId == undefined){
            localStorage.setItem("customerId", num);
        }

        if (remember == true) {
           
            localStorage.setItem("name", name);
            localStorage.setItem("phone", phone);
            localStorage.setItem("email", email);
            localStorage.setItem("store", storeID);
            localStorage.setItem("time", time);
            localStorage.setItem("remember", remember);
            localStorage.setItem("collection", 1);

        }
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("phone", phone);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("store", store);
            sessionStorage.setItem("time", time);
            sessionStorage.setItem("remember", remember);
            sessionStorage.setItem("collection", 1);

            addPhoneToDb();

    } else {
        alert("Please complete all fields");
    }

}

function delievery(){

    sessionStorage.clear();

    var name = document.getElementById("name").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;
    var remember = document.getElementById("remember").checked;
    var num = Math.floor((Math.random() * 1000) + 1);
    var customerId = localStorage.getItem("customerId");

    if (name != "" && phone != "" && email != "" && address != "") {

        if (customerId == undefined){
            localStorage.setItem("customerId", num);
        }

        if (remember == true) {

            localStorage.setItem("name", name);
            localStorage.setItem("phone", phone);
            localStorage.setItem("email", email);
            localStorage.setItem("address", address);
            localStorage.setItem("remember", remember);
            localStorage.setItem("collection", 2);

        } 

            sessionStorage.setItem("name", name);
            sessionStorage.setItem("phone", phone);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("address", address);
            sessionStorage.setItem("remember", remember);
            sessionStorage.setItem("collection", 2);

        addPhoneToDb();

    } else {
        alert("Please complete all fields");
    }

}


function addPhoneToDb() {

    //Step1: add user Phone number to Db
    var phoneNumber = {

        "Number": sessionStorage.getItem("phone")
    }

    var url = "https://api-beautifulburgers.azurewebsites.net/api/PhoneNumbers";
    var myJSON = JSON.stringify(phoneNumber);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var r = JSON.parse(xhttp.response); 
            phoneId = r.Id; 
            console.log("PhoneId: " + phoneId);
            addEmailToDb();
           
        }    
           
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader ("Accept", "application/json");
    xhttp.send(myJSON);

}

function addEmailToDb(){

    //Step2: add user Email to Db
    var emailAddress = {

        "Address": sessionStorage.getItem("email")
    }

    var url = "https://api-beautifulburgers.azurewebsites.net/api/Emails";
    var myJSON = JSON.stringify(emailAddress);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var r = JSON.parse(xhttp.response); 
            emailId = r.Id; 
            console.log("EmailId: " + emailId);
            addAddressToDb();
           
        }    
           
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader ("Accept", "application/json");
    xhttp.send(myJSON);

}

function addAddressToDb(){

     //Step3: add user Address to Db if delievery   
    if (sessionStorage.getItem("address") == undefined) {
       
        var customerAddress = {

            "StreetAddress": "n/a"
        }

    } else {

        var customerAddress = {

            "StreetAddress": sessionStorage.getItem("address")
        }

    }


    var url = "https://api-beautifulburgers.azurewebsites.net/api/Addresses";
    var myJSON = JSON.stringify(customerAddress);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var r = JSON.parse(xhttp.response); 
            addressId = r.Id; 
            console.log("AddressId: " + addressId);
            addUserToDb();
           
        }    
           
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader ("Accept", "application/json");
    xhttp.send(myJSON);

}

function addUserToDb(){

    //Step4: add user to Db and link their phone, email, address
    var newUser = {
          
          "FirstName": sessionStorage.getItem("name"),
          "RoleId": 1,
          "AddressId": addressId,
          "EmailId": emailId,
          "PhoneNumberId": phoneId

        }

    var url = "https://api-beautifulburgers.azurewebsites.net/api/Users";
    var myJSON = JSON.stringify(newUser);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var r = JSON.parse(xhttp.response); 
            userId = r.Id; 
            console.log("UserId: " + userId);
            sessionStorage.setItem("userId", userId);
            console.log("finished");
            window.location = "selection.html";
           
        }    
           
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader ("Accept", "application/json");
    xhttp.send(myJSON);

}


function populatefields(){

    var name = localStorage.getItem("name");
    var phone = localStorage.getItem("phone");
    var email = localStorage.getItem("email");
    var address = localStorage.getItem("address");
    var store = localStorage.getItem("store");

    if (name != undefined){
        document.getElementById("name").value = name;
    }
    
    if (phone != undefined){
        document.getElementById("phone").value = phone;
    }

    if (document.title == "Pickup | Beautiful Burgers") {
       
       if (store != undefined){
         
        document.getElementById("store").value = store;
        }

    }

    if (document.title == "Delievery | Beautiful Burgers") {
       
       if (email != undefined){
        document.getElementById("email").value = email;
        }

        if (address != undefined){
            document.getElementById("address").value = address;
        }
    }

}


   
