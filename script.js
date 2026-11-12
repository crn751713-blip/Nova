console.log(“JAVASCRIPT FILE LOADED!”);

const message = document.getElementById(“message”);

message.textContent = “JAVASCRIPT WORKING!”;
message.style.color = “green”;

import(“https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js”)
.then(() => {

message.textContent = "FIREBASE SDK LOADED!";
message.style.color = "green";
console.log("Firebase SDK Connected!");

})
.catch((error) => {

message.textContent = "FIREBASE ERROR: " + error.message;
message.style.color = "red";
console.error(error);

});