import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvsupITjCXYnyJ5taUTfgKaTr4ICuZmI4",
    authDomain: "auth-e1f14.firebaseapp.com",
    databaseURL: "https://auth-e1f14-default-rtdb.firebaseio.com",
    projectId: "auth-e1f14",
    storageBucket: "auth-e1f14.appspot.com",
    messagingSenderId: "744589697016",
    appId: "1:744589697016:web:47a44ec6954e8bfd2bc800d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to load leaderboard data
async function loadLeaderboard() {
    const leaderboardRef = collection(db, 'leaderboard');

    try {
        const querySnapshot = await getDocs(query(leaderboardRef, orderBy('score', 'desc'), limit(10)));
        const tbody = document.getElementById('arcadeLeaderboard-body');
        tbody.innerHTML = '';
        let rank = 1;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Leaderboard Entry:", data);  // Debug log
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = rank++;
            row.appendChild(rankCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = data.name;
            row.appendChild(nameCell);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = data.score;
            row.appendChild(scoreCell);

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error getting leaderboard documents: ", error);
    }
}

// Function to get and display the highest score
async function getAndDisplayHighestScore() {
    const leaderboardRef = collection(db, 'leaderboard'); 
    const q = query(leaderboardRef, orderBy('score', 'desc'), limit(1));

    try {
        const querySnapshot = await getDocs(q);
        const highestScoreDiv = document.getElementById('highest-score');

        if (!querySnapshot.empty) {
            const highestScoreData = querySnapshot.docs[0].data();
            console.log("Highest Score Entry:", highestScoreData);  // Debug log
            highestScoreDiv.innerHTML = `Highest Score: ${highestScoreData.score} by ${highestScoreData.name}`;
        } else {
            highestScoreDiv.innerHTML = 'No scores available.';
        }
    } catch (error) {
        console.error("Error getting highest score: ", error);
    }
}

// Initialize page
window.onload = () => {
    console.log("Page loaded. Initializing leaderboard...");  // Debug log
    loadLeaderboard();
    getAndDisplayHighestScore();
};
