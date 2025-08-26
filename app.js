const form = document.getElementById("rsvpform");
const msg  = document.getElementById("msg");

const say = (t="", cls="") => { if (msg){ msg.textContent=t; msg.className=`msg ${cls}`; } };
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||"").trim());

function check(){
  const names = ["first","last","email"];
  let bad = null;

  names.forEach(n=>{
    const el = form.elements[n];
    const ok = n==="email" ? isEmail(el.value) : !!el.value.trim();
    el.classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    if (!ok && !bad) bad = el;
  });

  return bad;
}

if (form){
  form.addEventListener("input", (e)=>{
    const el = e.target;
    if (!el.classList.contains("uinput")) return;
    const ok = el.name==="email" ? isEmail(el.value) : !!el.value.trim();
    if (ok){
      el.classList.remove("invalid");
      el.setAttribute("aria-invalid","false");
      if (msg?.classList.contains("err")) say("");
    }
  });

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const bad = check();
    if (bad){
      say("Please complete the required fields.", "err");
      bad.focus({preventScroll:true});
      bad.scrollIntoView({behavior:"smooth", block:"center"});
      return;
    }
    // store for thank-you personalization
    const data = Object.fromEntries(new FormData(form).entries());
    try{ sessionStorage.setItem("innercircle_rsvp", JSON.stringify(data)); }catch(_){}
    window.location.href = "./confirm.html";
  });
}
