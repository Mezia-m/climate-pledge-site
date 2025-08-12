document.addEventListener('DOMContentLoaded', function () {
    // Sample data
    const pledges = [
        { id: 'PLEDGE1001', name: 'Alex Johnson', date: '2023-06-10', state: 'California', profile: 'Student', stars: 4 },
        { id: 'PLEDGE1002', name: 'Maria Garcia', date: '2023-06-11', state: 'New York', profile: 'Working Professional', stars: 5 },
        { id: 'PLEDGE1003', name: 'James Smith', date: '2023-06-12', state: 'Texas', profile: 'Other', stars: 3 }
    ];

    updateStats();
    initializePledgeWall();

    // Form submission handler
    document.getElementById('pledgeForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const state = document.getElementById('state').value.trim();
        const profile = document.getElementById('profile').value;
        const commitments = document.querySelectorAll('input[name="commitment"]:checked');

        // Only change here: state is NOT required
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
            name: name,
            date: new Date().toISOString().split('T')[0],
            state: state,
            profile: profile,
            stars: Math.min(5, Math.max(1, commitments.length))
        };

        pledges.push(newPledge);
        addPledgeToTable(newPledge);
        updateStats();
        showCertificate(name, newPledge.stars);
        this.reset();
    });

    function updateStats() {
        const achieved = pledges.length;
        const students = pledges.filter(p => p.profile === 'Student').length;
        const professionals = pledges.filter(p => p.profile === 'Working Professional').length;

        document.getElementById('achieved-pledges').textContent = achieved;
        document.getElementById('students-count').textContent = students;
        document.getElementById('professionals-count').textContent = professionals;
    }

    function addPledgeToTable(pledge) {
        const table = document.getElementById('pledgeTable').getElementsByTagName('tbody')[0];
        const row = table.insertRow();

        row.insertCell(0).textContent = pledge.id;
        row.insertCell(1).textContent = pledge.name;
        row.insertCell(2).textContent = pledge.date;
        row.insertCell(3).textContent = pledge.state;
        row.insertCell(4).textContent = pledge.profile;

        const starCell = row.insertCell(5);
        starCell.className = 'stars';
        starCell.textContent = '★'.repeat(pledge.stars);
    }

    function showCertificate(name, stars) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = today.toLocaleDateString('en-US', options);

        document.getElementById('cert-name').textContent = name;
        document.getElementById('cert-date').textContent = dateStr;
        document.getElementById('cert-rating').textContent = '★'.repeat(stars);
        document.getElementById('certificate').style.display = 'block';

        document.getElementById('certificate').scrollIntoView({ behavior: 'smooth' });
    }

    function initializePledgeWall() {
        const tableBody = document.getElementById('pledgeTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        pledges.forEach(pledge => {
            addPledgeToTable(pledge);
        });
    }

    document.getElementById('filter-profile').addEventListener('change', function () {
        filterTable();
    });

    document.getElementById('filter-state').addEventListener('input', function () {
        filterTable();
    });

    function filterTable() {
        const profileFilter = document.getElementById('filter-profile').value;
        const stateSearch = document.getElementById('filter-state').value.toLowerCase();
        const rows = document.getElementById('pledgeTable').getElementsByTagName('tbody')[0].rows;

        for (let row of rows) {
            const profile = row.cells[4].textContent;
            const state = row.cells[3].textContent.toLowerCase();

            const profileMatch = profileFilter === 'All' || profile === profileFilter;
            const stateMatch = state.includes(stateSearch);

            row.style.display = profileMatch && stateMatch ? '' : 'none';
        }
    }
});
