// Replace with your deployed Apps Script Web App URL (must end with /exec)
const RSVP_URL = "https://script.google.com/macros/s/XXXX/exec";

const form = document.getElementById("rsvpform");
const msg  = document.getElementById("msg");
const btn  = document.getElementById("submitBtn");

const say = (t="") => { msg.textContent = t; };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  say("");
  btn.disabled = true;

  try {
    // Encode as application/x-www-form-urlencoded (works well with Apps Script)
    const body = new URLSearchParams(new FormData(form));
    body.set("type", "rsvp");   // optional flag for your backend

    const res  = await fetch(RSVP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    // Try to parse JSON; fall back to empty object
    const text = await res.text();
    let json; try { json = JSON.parse(text); } catch { json = {}; }

    if (res.ok && (json.ok === true || json.status === "ok" || json.result === "success")) {
      // Success → go to confirmation page
      window.location.href = "./confirm.html";
      return;
    }

    // Not OK → show server message or generic
    console.log("Server response:", text);
    say(json.message || "Submission error. Please try again.");
  } catch (err) {
    console.error(err);
    say("Network error. Please try again.");
  } finally {
    btn.disabled = false;
  }
});
