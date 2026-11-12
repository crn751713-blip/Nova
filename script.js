// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";


// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8hqAB7kriqwf51YD-sfS-h7OelyHw1e4",
    authDomain: "test-web-3b2bc.firebaseapp.com",
    projectId: "test-web-3b2bc",
    storageBucket: "test-web-3b2bc.firebasestorage.app",
    messagingSenderId: "899496262973",
    appId: "1:899496262973:web:2e25d4f53db7b5a7331954",
    measurementId: "G-9J8E3MD21K"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


// HTML Elements
const nameInput = document.getElementById("name");
const saveBtn = document.getElementById("saveBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");

let currentUser = null;


// Show Message
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}


// Login Anonymously
signInAnonymously(auth)
    .catch((error) => {
        console.error(error);
        showMessage("LOGIN ERROR: " + error.message, "red");
    });


// Check Authentication
onAuthStateChanged(auth, async (user) => {

    if (user) {

        currentUser = user;

        saveBtn.disabled = false;

        showMessage("Firebase Connected Successfully!", "green");

        await loadData();

    } else {

        currentUser = null;

        saveBtn.disabled = true;

    }

});


// Save Data
saveBtn.addEventListener("click", async () => {

    const name = nameInput.value.trim();

    if (!name) {
        showMessage("Please enter your name!", "red");
        return;
    }

    if (!currentUser) {
        showMessage("Please wait for login...", "red");
        return;
    }

    try {

        saveBtn.disabled = true;

        showMessage("Saving Data...", "blue");

        await addDoc(
            collection(db, "users", currentUser.uid, "records"),
            {
                name: name,
                createdAt: serverTimestamp()
            }
        );

        nameInput.value = "";

        showMessage("Data Saved Successfully!", "green");

        await loadData();

    } catch (error) {

        console.error(error);

        showMessage("SAVE ERROR: " + error.message, "red");

    } finally {

        saveBtn.disabled = false;

    }

});


// Load Data
async function loadData() {

    if (!currentUser) return;

    try {

        const querySnapshot = await getDocs(
            collection(db, "users", currentUser.uid, "records")
        );

        result.innerHTML = "";

        if (querySnapshot.empty) {

            result.textContent = "No Data Found";

            return;

        }

        querySnapshot.forEach((doc) => {

            const data = doc.data();

            const item = document.createElement("p");

            item.textContent = data.name;

            result.appendChild(item);

        });

    } catch (error) {

        console.error(error);

        showMessage("LOAD ERROR: " + error.message, "red");

    }

}
