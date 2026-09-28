const CONFIG = {
  // Replace these before launch with your real business contacts.
  email: 'hello@ceylonwellness.com',
  whatsapp: '',
  currency: 'USD',
  analyticsId: ''
};

const header = document.querySelector('.header');
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 30));

document.querySelector('.menu')?.addEventListener('click', () => {
  document.querySelector('.header nav')?.classList.toggle('open');
});

document.querySelectorAll('.header nav a').forEach(a => a.addEventListener('click', () => document.querySelector('.header nav')?.classList.remove('open')));

const needData = {
  mindfulness:{title:'Mindfulness, Spirituality & Inner Peace',copy:'Guided meditation, Buddhist and other spiritual practices, temple rituals, blessings and chanting, silent retreats and spiritual counselling create opportunities for reflection, stillness and inner balance.',experiences:['Meditation','Spirituality','Sacred places']},
  movement:{title:'Movement Therapies & Body Practices',copy:"Yoga, private practice and teacher training can be combined with Sri Lanka's indigenous Angampora, Tai Chi, martial arts, Pilates, dance, Zumba, music therapy and hot or cold-water bathing.",experiences:['Yoga','Body practices','Movement']},
  energy:{title:'Energy & Healing Practices',copy:'Guests may explore Reiki, Karuna, Pranic and other energy-based practices, crystal healing, chakra balancing, sound healing, singing bowls, gongs, tuning forks, chants, mantras and therapeutic music.',experiences:['Reiki','Sound healing','Meditative practice']},
  eco:{title:'Eco-Wellness & Nature-Based Healing',copy:'Forest immersion, Shinrin-yoku-inspired walks, beach healing rituals, tea-country retreats, sleep tourism, slow living, nature immersion and organic farming experiences connect wellbeing with Sri Lanka's extraordinary natural environment.',experiences:['Forest immersion','Tea country','Ocean & nature']},
  nutrition:{title:'Wellness Cuisine & Nutrition',copy:"Wellness-based dietetics, fresh local produce and farm-to-table organic cuisine introduce guests to nourishing food while experiencing Sri Lanka's rich culinary heritage.",experiences:['Local produce','Farm-to-table','Nourishing cuisine']},
  creative:{title:'Expressive & Creative Therapies',copy:'Painting, dance, writing, mandala creation and mindful colouring provide creative pathways for relaxation, self-expression and reflection.',experiences:['Painting','Dance','Writing & mandala']}
};

let journey = { need:'mindfulness', days:7, dates:'', style:'Boutique', accommodation:'Boutique retreat', interests:['Meditation','Nature'] };

function updateNeed(key){
  journey.need=key;
  document.querySelectorAll('.need-card').forEach(x=>x.classList.toggle('active', x.dataset.need===key));
  const d=needData[key];
  const title=document.querySelector('#need-title'); const copy=document.querySelector('#need-copy');
  if(title) title.textContent=d.title; if(copy) copy.textContent=d.copy;
  const selected=document.querySelector('#concierge-need'); if(selected) selected.value=key;
  renderJourneyPreview();
}

document.querySelectorAll('.need-card').forEach(card=>card.addEventListener('click',()=>updateNeed(card.dataset.need)));

document.querySelector('#concierge-need')?.addEventListener('change',e=>updateNeed(e.target.value));
document.querySelector('#days')?.addEventListener('input',e=>{journey.days=Number(e.target.value); document.querySelector('#days-value').textContent=e.target.value; renderJourneyPreview();});
document.querySelector('#travel-style')?.addEventListener('change',e=>{journey.style=e.target.value; renderJourneyPreview();});
document.querySelector('#accommodation')?.addEventListener('change',e=>{journey.accommodation=e.target.value; renderJourneyPreview();});
document.querySelector('#dates')?.addEventListener('change',e=>journey.dates=e.target.value);

document.querySelectorAll('.interest').forEach(el=>el.addEventListener('change',()=>{
  journey.interests=[...document.querySelectorAll('.interest:checked')].map(x=>x.value); renderJourneyPreview();
}));

function renderJourneyPreview(){
  const d=needData[journey.need];
  const interests=journey.interests.length?journey.interests:d.experiences;
  const list=document.querySelector('#journey-interests');
  if(list) list.innerHTML=interests.slice(0,4).map(x=>`<span>${x}</span>`).join('');
  const days=document.querySelector('#preview-days'); if(days) days.textContent=journey.days+' days';
  const style=document.querySelector('#preview-style'); if(style) style.textContent=journey.style;
  const title=document.querySelector('#journey-preview-title'); if(title) title.textContent=d.title;
  const total=document.querySelector('#quote-total');
  const range=document.querySelector('#quote-range');
  if(total && range){
    const base = journey.style==='Private' ? 420 : journey.style==='Comfort' ? 300 : 190;
    const estimate = Math.round(journey.days*base);
    total.textContent = `${CONFIG.currency} ${estimate.toLocaleString()}`;
    range.textContent = `Illustrative starting estimate: ${CONFIG.currency} ${(estimate*0.85).toLocaleString()}–${(estimate*1.25).toLocaleString()} per traveller, before final provider and logistics confirmation.`;
  }
}

function buildMessage(){
  return `Hello Ceylon Wellness,\n\nI would like to design a wellness journey in Sri Lanka.\n\nWellness journey: ${needData[journey.need].title}
Wellness lead: Dr. Vipula / Ceylon Wellness wellness programme
Travel logistics: Our selected travel agent\nDuration: ${journey.days} days\nDates: ${journey.dates||'Flexible'}\nTravel style: ${journey.style}\nAccommodation: ${journey.accommodation}\nInterests: ${journey.interests.join(', ')||'Not specified'}\n\nPlease help me create a personalised itinerary and quotation.`;
}

function sendJourney(){
  const name=document.querySelector('#guest-name')?.value.trim();
  const email=document.querySelector('#guest-email')?.value.trim();
  const consent=document.querySelector('#privacy-consent')?.checked;
  const status=document.querySelector('#form-status');
  if(!name || !email || !consent){ status.textContent='Please add your name, email and consent before sending.'; status.className='form-status error'; return; }
  localStorage.setItem('cw_journey', JSON.stringify({journey,name,email,createdAt:new Date().toISOString()}));
  const subject=encodeURIComponent('Ceylon Wellness — Design My Journey');
  const body=encodeURIComponent(`${buildMessage()}\n\nGuest: ${name}\nEmail: ${email}`);
  if(CONFIG.whatsapp){
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${body}`,'_blank','noopener');
    status.textContent='Your journey brief is ready. WhatsApp has been opened for the next step.';
  } else {
    window.location.href=`mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    status.textContent='Your journey brief is ready. Your email app should open for the enquiry.';
  }
  status.className='form-status success';
}

document.querySelector('#journey-form-element')?.addEventListener('submit',e=>{e.preventDefault();sendJourney();});
document.querySelector('#whatsapp-btn')?.addEventListener('click',()=>{
  const body=encodeURIComponent(buildMessage());
  if(CONFIG.whatsapp) window.open(`https://wa.me/${CONFIG.whatsapp}?text=${body}`,'_blank','noopener');
  else alert('Add your international WhatsApp number in script.js → CONFIG.whatsapp before launch.');
});

document.querySelector('#download-brief')?.addEventListener('click',()=>{
  const text=buildMessage();
  const blob=new Blob([text],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='ceylon-wellness-journey-brief.txt'; a.click(); URL.revokeObjectURL(url);
});

// Lightweight cookie/consent preference. Analytics is only initialised when configured and consent is given.
const cookieBanner=document.querySelector('#cookie-banner');
const consent=localStorage.getItem('cw_cookie_consent');
if(cookieBanner && !consent) cookieBanner.hidden=false;
document.querySelector('#cookie-accept')?.addEventListener('click',()=>{localStorage.setItem('cw_cookie_consent','accepted'); cookieBanner.hidden=true; initAnalytics();});
document.querySelector('#cookie-reject')?.addEventListener('click',()=>{localStorage.setItem('cw_cookie_consent','rejected'); cookieBanner.hidden=true;});
if(consent==='accepted') initAnalytics();
function initAnalytics(){
  if(!CONFIG.analyticsId || window.gtag) return;
  const s=document.createElement('script'); s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${CONFIG.analyticsId}`; document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)}; gtag('js',new Date()); gtag('config',CONFIG.analyticsId);
}

// Basic event tracking hooks once GA4 is configured.
document.querySelectorAll('[data-track]').forEach(el=>el.addEventListener('click',()=>{ if(window.gtag) gtag('event',el.dataset.track); }));

renderJourneyPreview();
