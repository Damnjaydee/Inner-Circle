const VALID_CODES = ["INNER25", "INNER2025", "ICDINNER", "REDHAWK"];
const GATE_KEY = "ic_gate_verified";

const qs = (sel, el=document) => el.querySelector(sel);
const getParams = () => Object.fromEntries(new URLSearchParams(location.search).entries());
const setGate = () => sessionStorage.setItem(GATE_KEY, "1");
const gateOk = () => sessionStorage.getItem(GATE_KEY) === "1";

// CODE PAGE
(function initCodeGate(){
  const form = qs('#codeForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const code = qs('#code').value.trim().toUpperCase();
    const ok = VALID_CODES.includes(code);
    if(ok){
      setGate();
      location.href = 'rsvp.html';
    } else {
      qs('#codeError').style.display = 'block';
    }
  });
})();

// FORM PAGE
(function guardAndHandleForm(){
  const form = qs('#rsvpForm');
  if(!form) return;
  if(!gateOk()){ location.replace('code.html'); return; }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const required = ['firstName','lastName','email','phone','guests'];
    const missing = required.some(k => !String(data[k]||'').trim());
    if(missing){ qs('#formError').style.display = 'block'; return; }

    const emailOk = /.+@.+\\..+/.test(data.email);
    const phoneOk = String(data.phone).replace(/\\D/g,'').length >= 10;
    if(!emailOk || !phoneOk){ qs('#formError').style.display = 'block'; return; }

    const name = encodeURIComponent(data.firstName.trim());
    location.href = `confirm.html?name=${name}`;
  });
})();

// CONFIRM PAGE
(function hydrateConfirm(){
  const lead = qs('#confirmLead');
  if(!lead) return;
  const { name } = getParams();
  if(name){
    lead.textContent = `Thank you, ${decodeURIComponent(name)} — we'll send directions to your email/SMS before the event.`;
  }
})();
