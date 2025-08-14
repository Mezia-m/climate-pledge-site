document.addEventListener('DOMContentLoaded', function () {
    const sheetURL = "https://script.google.com/macros/s/AKfycbzHAHl3nX8l2-aflLvGboidIRAoiyhO_y2LDCEl-0JPyV1FOlOXBiFvZGHSK6mhPZaQ/exec";

    const pledges = [
        { id: "PLEDGE1001", name: "Alex Johnson", date: "2023-06-10", state: "California", profile: "Student", stars: 4 },
        { id: "PLEDGE1002", name: "Maria Garcia", date: "2023-06-11", state: "New York", profile: "Working Professional", stars: 5 },
        { id: "PLEDGE1003", name: "James Smith", date: "2023-06-12", state: "Texas", profile: "Other", stars: 3 }
    ];

    initializePledgeWall();
    updateStats();

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

        const stars = Math.min(5, commitments.length);
        const newPledge = {
            id: 'PLEDGE' + (1000 + pledges.length + 1),
            name,
            date: new Date().toISOString().split('T')[0],
            state,
            profile,
            stars: stars,
            email: email,
            phone: phone
        };

        // Save to Google Sheets
        fetch(sheetURL, {
            method: 'POST',
            body: JSON.stringify(newPledge)
        })
        .then(res => res.json())
        .then(response => {
            console.log(response); // Debug
            pledges.push(newPledge);
            addPledgeToTable(newPledge);
            updateStats();
            showCertificate(name, stars);
            document.getElementById('pledgeForm').reset();
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Error submitting pledge.');
        });
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
