document.getElementById("pledgeForm").onsubmit = function(e) {
  e.preventDefault();
  const name = document.querySelector("input[type='text']").value;
  const stars = document.querySelectorAll("input[type='checkbox']:checked").length;

  let rating = "⭐".repeat(stars);
  document.getElementById("certText").innerText = `${name}, you're Cool Enough to Care! ${rating}`;
  document.getElementById("certificate").style.display = "block";
};
