// 1) Replace this with your deployed Google Apps Script Web App URL (must end with /exec)
const RSVP_URL = "https://script.google.com/macros/s/YOUR_APPS_SCRIPT_EXEC_URL/exec";

// 2) Basic element refs
const form = document.getElementById("rsvpform");
const msg  = document.getElementById("msg");
const btn  = document.getElementById("submitBtn");
const say  = (t="", cls="") => { msg.textContent = t; msg.className = `msg ${cls}`; };

// 3) Client-side validation helper
function valid(form) {
  if (form.company && form.company.value.trim()) return false; // honeypot → spam
  return form.checkValidity();
}

// 4) Submit
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!valid(form)) { say("Please complete the required fields.", "err"); return; }

    btn.disabled = true; say("Submitting…");

    try {
      // Encode as x-www-form-urlencoded (works well with Apps Script)
      const body = new URLSearchParams(new FormData(form));
      body.set("type", "rsvp");

      const res  = await fetch(RSVP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      const text = await res.text();
      let json; try { json = JSON.parse(text); } catch { json = {}; }

      // Treat OK response or explicit { ok: true } as success
      if (res.ok && (json.ok === true || json.status === "ok" || json.result === "success" || !text)) {
        window.location.href = "./confirm.html";
        return;
      }
      console.log("Server response:", text);
      say(json.message || "Submission error. Please try again.", "err");
    } catch (err) {
      console.error(err);
      say("Network error. Please try again.", "err");
    } finally {
      btn.disabled = false;
    }
  });
}
