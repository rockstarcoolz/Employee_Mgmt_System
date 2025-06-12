const PERPLEXITY_API_KEY = "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"; // <-- Replace with your actual key
let chatHistory = [
 { role: "model", parts: [{ text: "Hello! I'm Your Assistant. Ask me anything." }] }
];
// === NovaDesk AI Chatbot Widget ===
function novaChatWidget() {
 if (document.getElementById("nova-chat-widget")) {
   document.getElementById("nova-chat-widget").innerHTML = `
<button onclick="toggleChat()" style="background:#00c6ff;border:none;padding:10px 15px;border-radius:50%;color:white;font-size:18px;box-shadow:0 0 10px #0072ff;cursor:pointer;">💬</button>
<div id="chatBox" style="display:none;background:#1f2a38;padding:10px;border-radius:10px;width:330px;height:440px;box-shadow:0 0 15px black;overflow-y:auto;margin-top:10px;">
<div id="nova-messages" style="height:84%;overflow-y:auto;color:white;"></div>
<div style="display:flex;">
<input id="novaInput" type="text" placeholder="Ask Nova..." style="flex:1;padding:8px;" onkeydown="if(event.key==='Enter'){sendNova()}" />
<button onclick="sendNova()" style="background:#0072ff;color:white;padding:8px;border:none;">➤</button>
</div>
</div>
   `;
 }
}
window.onload = function() { novaChatWidget(); };
// Chatbot Functions
function toggleChat() {
 const box = document.getElementById("chatBox");
 box.style.display = box.style.display === "none" ? "block" : "none";
}
async function sendNova() {
  const input = document.getElementById("novaInput");
  const messages = document.getElementById("nova-messages");
  const userText = input.value.trim();
  if (!userText) return;
  messages.innerHTML += `<p><b>You:</b> ${userText}</p>`;
  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("/.netlify/functions/perplexity-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "pplx-70b-online",
        messages: [
          { role: "user", content: userText }
        ]
      })
    });
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, no reply.";
    messages.innerHTML += `<p><b>Nova:</b> ${reply}</p>`;
    messages.scrollTop = messages.scrollHeight;
  } catch {
    messages.innerHTML += `<p><b>Nova:</b> Sorry, something went wrong. Try again.</p>`;
  }
}
// --- Authentication & Page Logic ---
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
// Registration
document.getElementById("registerForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const username = document.getElementById("registerUsername").value;
 const password = document.getElementById("registerPassword").value;
 let users = JSON.parse(localStorage.getItem("users") || "[]");
 if (users.find(u => u.username === username)) {
   alert("Username already taken");
   return;
 }
 users.push({ username, password, role: "user" });
 localStorage.setItem("users", JSON.stringify(users));
 alert("Registered successfully!");
 window.location.href = "login.html";
});
// Login
document.getElementById("loginForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const username = document.getElementById("loginUsername").value;
 const password = document.getElementById("loginPassword").value;
 if (username === ADMIN_USER && password === ADMIN_PASS) {
   localStorage.setItem("currentUser", JSON.stringify({ username, role: "admin" }));
   window.location.href = "dashboard.html";
 } else {
   let users = JSON.parse(localStorage.getItem("users") || "[]");
   const match = users.find(u => u.username === username && u.password === password);
   if (match) {
     localStorage.setItem("currentUser", JSON.stringify({ username, role: "user" }));
     window.location.href = "user.html";
   } else {
     alert("Invalid credentials");
   }
 }
});
function checkAdmin() {
 const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
 if (user.role !== "admin") {
   alert("Admin access only");
   window.location.href = "login.html";
 }
}
function checkUser() {
 const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
 if (!user.username) {
   alert("Please log in");
   window.location.href = "login.html";
 }
}
// --- Employee (formerly student) Form and CSV ---
document.getElementById("employeeForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const entry = {
   name: this.name.value,
   empid: this.empid.value,
   dept: this.dept.value,
   role: this.role.value,
   email: this.email.value,
   mobile: this.mobile.value
 };
 let data = JSON.parse(localStorage.getItem("employees") || '[]');
 data.push(entry);
 localStorage.setItem("employees", JSON.stringify(data));
 alert("Employee saved!");
 location.reload();
});
// Staff form (same as before)
document.getElementById("staffForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const entry = {
   name: this.name.value,
   role: this.role.value,
   dept: this.dept.value
 };
 let data = JSON.parse(localStorage.getItem("staff") || '[]');
 data.push(entry);
 localStorage.setItem("staff", JSON.stringify(data));
 alert("Staff saved!");
 location.reload();
});
// Issues form (for employees)
document.getElementById("issueForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const entry = {
   employee: this.student.value,
   description: this.description.value
 };
 let data = JSON.parse(localStorage.getItem("issues") || '[]');
 data.push(entry);
 localStorage.setItem("issues", JSON.stringify(data));
 alert("Issue saved!");
 location.reload();
});
// Certificates form (for employees)
document.getElementById("certForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const entry = {
   employee: this.student.value,
   date: this.date.value
 };
 let data = JSON.parse(localStorage.getItem("certificates") || '[]');
 data.push(entry);
 localStorage.setItem("certificates", JSON.stringify(data));
 alert("Certificate issued!");
 location.reload();
});
// --- Feedback Form (for users) ---
document.getElementById("feedbackForm")?.addEventListener("submit", function(e) {
 e.preventDefault();
 const feedback = document.getElementById("feedbackText").value;
 const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
 let all = JSON.parse(localStorage.getItem("feedback") || '[]');
 all.push({ username: user.username, feedback, timestamp: new Date().toLocaleString() });
 localStorage.setItem("feedback", JSON.stringify(all));
 alert("Feedback sent! Admin will review your request.");
 document.getElementById("feedbackText").value = "";
});
// --- Display Data on Page Load ---
window.addEventListener("DOMContentLoaded", function() {
 // Employees
 if(document.getElementById("employeeList")) {
   const data = JSON.parse(localStorage.getItem("employees") || '[]');
   let html = data.length ? '<table><tr><th>Name</th><th>ID</th><th>Dept</th><th>Role</th><th>Email</th><th>Mobile</th></tr>' +
     data.map(d => `<tr>
<td>${d.name}</td><td>${d.empid}</td><td>${d.dept}</td><td>${d.role}</td><td>${d.email}</td><td>${d.mobile}</td></tr>`).join('')
     + '</table>' : "<p>No employees yet.</p>";
   document.getElementById("employeeList").innerHTML = html;
 }
 // Staff
 if(document.getElementById("staffList")) {
   const data = JSON.parse(localStorage.getItem("staff") || '[]');
   let html = data.length ? '<ul>' + data.map(d => `<li>${d.name} (${d.role}) - Dept: ${d.dept}</li>`).join('') + '</ul>' : "<p>No staff yet.</p>";
   document.getElementById("staffList").innerHTML = html;
 }
 // Issues
 if(document.getElementById("issueList")) {
   const data = JSON.parse(localStorage.getItem("issues") || '[]');
   let html = data.length ? '<ul>' + data.map(d => `<li>${d.employee}: ${d.description}</li>`).join('') + '</ul>' : "<p>No issues yet.</p>";
   document.getElementById("issueList").innerHTML = html;
 }
 // Certificates
 if(document.getElementById("certList")) {
   const data = JSON.parse(localStorage.getItem("certificates") || '[]');
   let html = data.length ? '<ul>' + data.map(d => `<li>${d.employee}: ${d.date}</li>`).join('') + '</ul>' : "<p>No certificates yet.</p>";
   document.getElementById("certList").innerHTML = html;
 }
 // Feedback (admin_feedback.html)
 if(document.getElementById("feedbackList")) {
   const data = JSON.parse(localStorage.getItem("feedback") || '[]');
   let html = data.length ? '<ul>' + data.map(f => `<li><b>${f.username}</b> <span style="font-size:0.95em;color:#c2e1e6;">[${f.timestamp}]</span><br>${f.feedback}</li>`).join('') + '</ul>' : "<p>No feedback/requests yet.</p>";
   document.getElementById("feedbackList").innerHTML = html;
 }
});
// --- User Profile Data ---
function showUserProfile() {
 checkUser();
 const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
 document.getElementById("userProfileName").innerText = user.username;
 let html = `<p><b>Username:</b> ${user.username}</p>`;
 document.getElementById("userProfileBox").innerHTML = html;
}
// CSV Download
function downloadCSV(type) {
 const data = JSON.parse(localStorage.getItem(type) || '[]');
 if (!data.length) return alert("No data to download.");
 const keys = Object.keys(data[0]);
 const csvRows = [keys.join(",")];
 data.forEach(row => {
   csvRows.push(keys.map(k => `"${row[k]}"`).join(","));
 });
 const csvData = csvRows.join("\\n");
 const blob = new Blob([csvData], { type: 'text/csv' });
 const link = document.createElement("a");
 link.href = URL.createObjectURL(blob);
 link.download = type + "_data.csv";
 link.click();
}
// --- Nova Toolbox Features ---
// Text Summarizer (uses Gemini backend)
async function summarizeText() {
 const input = document.getElementById("summarizeInput").value.trim();
 const resultDiv = document.getElementById("summarizeResult");
 if (input.length < 40) {
   resultDiv.innerHTML = "<span style='color:salmon'>Enter at least 40 characters.</span>";
   return;
 }
 resultDiv.innerHTML = "<i>Summarizing...</i>";
 const prompt = `Please summarize the following text concisely:\n\n${input}`;
 try {
   const res = await fetch(
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=" + GEMINI_API_KEY,
     {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         contents: [
           { role: "user", parts: [{ text: prompt }] }
         ]
       })
     }
   );
   const data = await res.json();
   const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
   resultDiv.innerHTML = summary
     ? summary
     : "<span style='color:salmon'>No summary returned. Try again.</span>";
 } catch (e) {
   resultDiv.innerHTML = "<span style='color:salmon'>Failed to summarize. Try later.</span>";
 }
}
// QR Code Generator (uses CDN library)
function generateQR() {
 const val = document.getElementById("qrInput").value;
 const el = document.getElementById("qrResult");
 const dlBtn = document.getElementById("downloadQRBtn");
 if (!val) {
   el.innerHTML = "";
   dlBtn.style.display = "none";
   return;
 }
 el.innerHTML = "";
 QRCode.toDataURL(val, { width: 150, margin: 2 }, function(err, url) {
   if (!err) {
     el.innerHTML = `<img id="theQR" src="${url}" alt="QR code" />`;
     dlBtn.style.display = "inline-block";
     dlBtn.setAttribute("data-url", url);
   } else {
     el.innerHTML = "<span style='color:salmon'>Failed to generate QR.</span>";
     dlBtn.style.display = "none";
   }
 });
}
function downloadQRImage() {
 const url = document.getElementById("downloadQRBtn").getAttribute("data-url");
 if (!url) return;
 const link = document.createElement("a");
 link.href = url;
 link.download = "qr-code.png";
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
}
// Word Counter
function countWords() {
 const txt = document.getElementById("wordInput").value;
 const count = txt.trim() ? txt.trim().split(/\s+/).length : 0;
 document.getElementById("wordResult").innerHTML = "Word count: " + count;
}
// Email Validator
function validateEmail() {
 const em = document.getElementById("emailInput").value.trim();
 const result = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(em)
   ? "<span style='color:#39e27a'>Valid email!</span>"
   : "<span style='color:salmon'>Invalid email.</span>";
 document.getElementById("emailResult").innerHTML = result;
}
// Password Generator
function generatePassword() {
 const charset = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$%&!";
 let pwd = "";
 for (let i=0; i<12; i++)
   pwd += charset[Math.floor(Math.random()*charset.length)];
 document.getElementById("passwordResult").innerHTML = "Generated: <b>" + pwd + "</b>";
}