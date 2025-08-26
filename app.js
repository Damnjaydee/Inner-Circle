// No network. Validate, store minimal info, and go to confirm page.

const form = document.getElementById("rsvpform");
const msg  = document.getElementById("msg");
const btn  = document.getElementById("submitBtn");
const say  = (t="", cls="") => { if (msg){ msg.textContent=t; msg.className=`msg ${cls}`; } };
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||"").trim());

function markValidity(){
  // clear
  [...form.querySelectorAll(".uinput")].forEach(el=>{
    el.classList.remove("invalid");
    el.setAttribute("aria-invalid","false");
    el.closest(".field")?.classList.remove("has-error");
  });

  const req = [
    {name:"first", test:v=>!!v.trim()},
    {name:"last",  test:v=>!!v.trim()},
    {name:"email", test:isEmail}
  ];
  const bad = [];
  req.forEach(({name,test})=>{
    const el = form.elements[name];
    if (!el) return;
    const ok = test(el.value);
    if (!ok){
      bad.push(name);
      el.classList.add("invalid");
      el.setAttribute("aria-invalid","true");
      el.closest(".field")?.classList.add("has-error");
    }
  });
  return bad;
}

if (form){
  form.addEventListener("input", (e)=>{
    const el = e.target;
    if (!el.classList.contains("uinput")) return;
    const ok = el.name === "email" ? isEmail(el.value) : !!String(el.value||"").trim();
    if (ok){
      el.classList.remove("invalid");
      el.setAttribute("aria-invalid","false");
      el.closest(".field")?.classList.remove("has-error");
      if (msg?.classList.contains("err")) say("");
    }
  });

  form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const bad = markValidity();
    if (bad.length){
      say("Please complete the required fields.", "err");
      const firstBad = form.elements[bad[0]];
      firstBad?.focus({preventScroll:true});
      firstBad?.scrollIntoView({behavior:"smooth", block:"center"});
      return;
    }

    // keep values for personalization on confirm page
    const data = Object.fromEntries(new FormData(form).entries());
    try { sessionStorage.setItem("innercircle_rsvp", JSON.stringify(data)); } catch {}

    window.location.href = "./confirm.html";
  });
}
