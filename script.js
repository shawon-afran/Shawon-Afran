// Firebase Database Config
const firebaseConfig = {
  databaseURL: "https://portfolio-feedback-db-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// SECRET ADMIN PIN
const SECRET_PIN = "1234";

document.addEventListener("DOMContentLoaded", function () {
  const feedbackForm = document.getElementById("feedbackForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusMsg = document.getElementById("statusMsg");

  const toggleAdminBtn = document.getElementById("toggleAdminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const unlockBtn = document.getElementById("unlockBtn");
  const adminPinInput = document.getElementById("adminPinInput");
  const adminFeedbackContainer = document.getElementById("adminFeedbackContainer");
  const adminFeedbackList = document.getElementById("adminFeedbackList");

  // Handle Feedback Submission
  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const rating = document.getElementById("userRating").value;
    const message = document.getElementById("userMessage").value.trim();

    if (name && rating && message) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Submitting...";

      const newFeedbackRef = database.ref("feedbacks").push();
      newFeedbackRef.set({
        name: name,
        rating: Number(rating),
        message: message,
        timestamp: new Date().toLocaleString()
      }, function (error) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Feedback";

        if (error) {
          statusMsg.style.color = "red";
          statusMsg.innerText = "Error submitting feedback. Try again.";
        } else {
          statusMsg.style.color = "green";
          statusMsg.innerText = "Thank you! Your feedback has been submitted.";
          feedbackForm.reset();

          setTimeout(() => { statusMsg.innerText = ""; }, 4000);
        }
      });
    }
  });

  // Toggle Admin Panel View
  toggleAdminBtn.addEventListener("click", function () {
    adminPanel.classList.toggle("hidden");
  });

  // Admin PIN Authorization
  unlockBtn.addEventListener("click", function () {
    const inputPin = adminPinInput.value.trim();

    if (inputPin === SECRET_PIN) {
      alert("Access Granted! Loading feedbacks...");
      adminFeedbackContainer.classList.remove("hidden");
      loadFeedbacksForAdmin();
    } else {
      alert("Incorrect Secret PIN! Access Denied.");
    }
  });

  // Fetch Feedbacks from Database
  function loadFeedbacksForAdmin() {
    database.ref("feedbacks").on("value", function (snapshot) {
      adminFeedbackList.innerHTML = "";
      const data = snapshot.val();

      if (!data) {
        adminFeedbackList.innerHTML = "<p style='font-size:12px; color:#666;'>No feedbacks found in database.</p>";
        return;
      }

      const feedbackArray = Object.values(data).reverse();

      feedbackArray.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "feedback-card";

        const stars = "⭐".repeat(item.rating);

        card.innerHTML = `
          <div class="feedback-card-header">
            <span class="reviewer-name">${escapeHTML(item.name)}</span>
            <span class="reviewer-stars">${stars}</span>
          </div>
          <p class="reviewer-text">${escapeHTML(item.message)}</p>
          <div class="feedback-date">🕒 ${item.timestamp || 'N/A'}</div>
        `;

        adminFeedbackList.appendChild(card);
      });
    });
  }

  // Security Helper
  function escapeHTML(str) {
    return str ? str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)) : '';
  }
});
