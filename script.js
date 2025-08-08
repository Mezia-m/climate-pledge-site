/* ---------- Data state ---------- */
let pledgeCount = 0;
let studentCount = 0;
let professionalCount = 0;
let pledgeID = 1;

/* Load stored pledges from localStorage */
let pledges = JSON.parse(localStorage.getItem("pledges")) || [];

/* Populate table on load */
document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.getElementById("pledgeWall");
  pledges.forEach(p => addPledgeRow(p));
  pledgeCount = pledges.length;
  studentCount = pledges.filter(p => p.profile === "Student").length;
  professionalCount = pledges.filter(p => p.profile === "Working Professional").length;

  animateCount("achieved-pledges", pledgeCount);
  animateCount("student-count", studentCount);
  animateCount("professional-count", professionalCount);
});

/* --- scroll to form button fix --- */
function scrollToForm() {
  const formSection = document.getElementById("pledge-form");
  if (formSection) {
    formSection.scrollIntoView({ behavior: "smooth" });
  }
}

/* animate counters */
function animateCount(id, target) {
  const el = document.getElementById(id);
  const start = parseInt(el.innerText.replace(/,/g, "")) || 0;
  const duration = 500;
  const frames = Math.round(duration / 30);
  const step = (target - start) / frames;
  let current = start;
  let i = 0;
  const timer = setInterval(() => {
    i++;
    current = Math.round(start + step * i);
    if (i >= frames) {
      el.innerText = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.innerText = current.toLocaleString();
    }
  }, 30);
}

/* Add pledge to table */
function addPledgeRow(data) {
  const tbody = document.getElementById("pledgeWall");
  const row = tbody.insertRow();
  row.insertCell(0).innerText = data.id;
  row.insertCell(1).innerText = data.name;
  row.insertCell(2).innerText = data.date;
  row.insertCell(3).innerText = data.state;
  row.insertCell(4).innerText = data.profile;
  row.insertCell(5).innerText = "⭐".repeat(data.commitments.length);
}

/* --- submit pledge --- */
document.addEventListener("DOMContentLoaded", function () {
  const pledgeForm = document.getElementById("pledgeForm");
  if (!pledgeForm) return;

  pledgeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const state = document.getElementById("state").value.trim();
    const profile = document.getElementById("profile").value;
    const commitments = Array.from(document.querySelectorAll('.theme-card input[type="checkbox"]:checked')).map(cb => cb.value);

    if (!name || !state || !profile) {
      alert("Please fill in all required fields.");
      return;
    }

    if (profile === "Student") studentCount++;
    if (profile === "Working Professional") professionalCount++;
    pledgeCount++;

    const newPledge = {
      id: pledgeCount,
      name: name,
      date: new Date().toLocaleDateString(),
      state: state,
      profile: profile,
      commitments: commitments
    };

    pledges.push(newPledge);
    localStorage.setItem("pledges", JSON.stringify(pledges));

    animateCount("achieved-pledges", pledgeCount);
    animateCount("student-count", studentCount);
    animateCount("professional-count", professionalCount);

    addPledgeRow(newPledge);

    // Show upgraded certificate
    const certSection = document.getElementById("certificate");
    certSection.style.display = "block";
    document.getElementById("certificate-content").innerHTML = `
      <div id="certCanvas" style="
        background: linear-gradient(180deg, #ffffff, #f6fff8);
        border: 6px solid #2f6b46;
        padding: 25px;
        border-radius: 16px;
        max-width: 700px;
        margin: auto;
        text-align: center;
        box-shadow: 0 10px 30px rgba(47,107,70,0.2);
        font-family: 'Montserrat', sans-serif;
      ">
        <div style="
          background: #2f6b46;
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        ">
          Certificate of Commitment
        </div>
        <p style="color: #4b6b55; font-size: 16px; margin: 5px 0;">This certifies that</p>
        <h2 style="font-size: 28px; margin: 8px 0; color: #243820;">${name}</h2>
        <p style="margin: 8px 0; font-size: 18px; color: #2f4f3f;">
          <strong>Cool Enough to Care!</strong>
        </p>
        <p style="margin: 8px 0; font-size: 20px; color: #e6b800;">
          ⭐ Love for Planet: ${"⭐".repeat(commitments.length)}
        </p>
        <p style="color: #555; margin-top: 10px;">Date: ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    // Scroll to certificate
    certSection.scrollIntoView({ behavior: "smooth" });

    // Reset form
    pledgeForm.reset();
  });
});

/* --- Download PNG --- */
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "downloadCert") {
    const certEl = document.getElementById("certCanvas");
    if (!certEl) {
      alert("No certificate found to download.");
      return;
    }
    html2canvas(certEl, { scale: 2 }).then(canvas => {
      const link = document.createElement("a");
      link.download = "Climate_Pledge_Certificate.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }
});
