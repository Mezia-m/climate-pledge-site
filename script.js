
const firebaseConfig = {
    apiKey: "AIzaSyBMqsIxSUs7EL5iAgqKNF2xOh5KpqKyt18",
    authDomain: "mezia-e9ad9.firebaseapp.com",
    databaseURL: "https://mezia-e9ad9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mezia-e9ad9",
    storageBucket: "mezia-e9ad9.firebasestorage.app",
    messagingSenderId: "347636068289",
    appId: "1:347636068289:web:f5767a0c3ae4ef3ef50940",
    measurementId: "G-ZMPDFCVLHW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function () {
    const pledges = [];

    // Load pledges from Firebase
    database.ref("pledges").on("value", snapshot => {
        pledges.length = 0;
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(pledge => pledges.push(pledge));
        }
        initializePledgeWall();
        updateStats();
    });

    // Handle form submit
    document.getElementById('pledgeForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const state = document.getElementById('state').value.trim();
        const profile = document.getElementById('profile').value;
        const commitments = document.querySelectorAll('input[name="commitment"]:checked');

        if (!name || !email || !phone || !profile) {
            alert('Please fill all required fields');
            return;
        }
        if (commitments.length === 0) {
            alert('Please select at least one commitment');
            return;
        }

        const newPledge = {
            id: 'PLEDGE' + (1000 + pledges.length + 1),
            name,
            date: new Date().toISOString().split('T')[0],
            state,
            profile,
            stars: Math.min(5, commitments.length)
        };

        database.ref("pledges").push(newPledge);
        showCertificate(name, newPledge.stars);
        this.reset();
    });

    function updateStats() {
        document.getElementById('achieved-pledges').textContent = pledges.length;
        document.getElementById('students-count').textContent = pledges.filter(p => p.profile === 'Student').length;
        document.getElementById('professionals-count').textContent = pledges.filter(p => p.profile === 'Working Professional').length;
    }

    function addPledgeToTable(pledge) {
        const row = document.getElementById('pledgeTable').getElementsByTagName('tbody')[0].insertRow();
        row.insertCell(0).textContent = pledge.id;
        row.insertCell(1).textContent = pledge.name;
        row.insertCell(2).textContent = pledge.date;
        row.insertCell(3).textContent = pledge.state;
        row.insertCell(4).textContent = pledge.profile;
        row.insertCell(5).textContent = '★'.repeat(pledge.stars);
    }

    function showCertificate(name, stars) {
        document.getElementById('cert-name').textContent = name;
        document.getElementById('cert-date').textContent = new Date().toLocaleDateString();
        document.getElementById('cert-rating').textContent = '★'.repeat(stars);
        document.getElementById('certificate').style.display = 'block';
        document.getElementById('certificate').scrollIntoView({ behavior: 'smooth' });
    }

    function initializePledgeWall() {
        const tableBody = document.getElementById('pledgeTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';
        pledges.forEach(addPledgeToTable);
    }
});
