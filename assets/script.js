const menuBtn=document.querySelector('[data-menu]');
const nav=document.querySelector('[data-nav]');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{nav.classList.toggle('show');menuBtn.setAttribute('aria-expanded',String(nav.classList.contains('show')));});}
document.querySelectorAll('.nav-item.has-dropdown>a').forEach(a=>a.addEventListener('click',e=>{if(innerWidth<=980){e.preventDefault();a.parentElement.classList.toggle('open')}}));
document.querySelectorAll('.faq-q').forEach(q=>q.addEventListener('click',()=>q.parentElement.classList.toggle('open')));

function configureFields(form){
  [...form.querySelectorAll('input,select,textarea')].forEach(el=>{
    const p=(el.getAttribute('placeholder')||'').toLowerCase();
    const label=(el.closest('.field')?.querySelector('label')?.textContent||'').toLowerCase();
    const key=label+' '+p;
    if(!el.name){if(key.includes('name'))el.name='name';else if(key.includes('phone')||key.includes('whatsapp'))el.name='phone';else if(key.includes('email'))el.name='email';else if(key.includes('city'))el.name='city';else if(key.includes('country'))el.name='country';else if(key.includes('neet'))el.name='neet_score';else if(key.includes('message')||el.tagName==='TEXTAREA')el.name='message';}
    if(el.name==='phone'){el.required=true;el.inputMode='tel';el.autocomplete='tel';el.pattern='[0-9+()\\-\\s]{10,18}';el.title='Please enter a valid phone or WhatsApp number';}
    if(el.name==='name'){el.required=true;el.autocomplete='name';el.minLength=2;}
    if(el.name==='email'){el.type='email';el.autocomplete='email';}
    if(el.name==='city')el.autocomplete='address-level2';
    if(el.name==='neet_score'){
      el.type='text';
      el.inputMode='numeric';
      el.pattern='[0-9]{1,3}';
      el.maxLength=3;
      el.placeholder='Enter your NEET score';
      el.autocomplete='off';
      el.title='Enter up to 3 digits only';
      el.removeAttribute('min');
      el.removeAttribute('max');
      el.removeAttribute('step');
      if(!el.dataset.neetDigitsOnly){
        el.dataset.neetDigitsOnly='1';
        el.addEventListener('input',()=>{
          const digits=el.value.replace(/\D/g,'').slice(0,3);
          if(el.value!==digits) el.value=digits;
        });
        el.addEventListener('paste',()=>setTimeout(()=>{
          el.value=el.value.replace(/\D/g,'').slice(0,3);
        },0));
      }
    }
  });
}
function showMessage(form,text,type){let msg=form.querySelector('.form-msg');if(!msg){msg=document.createElement('div');msg.className='form-msg';msg.setAttribute('aria-live','polite');form.appendChild(msg);}msg.textContent=text;msg.className='form-msg '+type;}
function waLeadUrl(data){
  const phone=((window.MEDICO_CONFIG||{}).phone||'+919347406969').replace(/\D/g,'');
  const lines=['Hello Medico Overseas, I would like counselling for MBBS abroad.',`Name: ${data.name||''}`,`Phone: ${data.phone||''}`,data.email?`Email: ${data.email}`:'',data.city?`City: ${data.city}`:'',data.country?`Interested country: ${data.country}`:'',data.neet_score?`NEET score: ${data.neet_score}`:'',data.message?`Message: ${data.message}`:'',`Page: ${location.href}`].filter(Boolean);
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
function saveLocalLead(data){try{const leads=JSON.parse(localStorage.getItem('medico_leads')||'[]');leads.push({...data,saved_at:new Date().toISOString()});localStorage.setItem('medico_leads',JSON.stringify(leads));}catch(e){}}

document.querySelectorAll('[data-lead-form]').forEach(form=>{
  configureFields(form);
  form.setAttribute('novalidate','novalidate');

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    form.querySelectorAll('.field-error').forEach(x=>x.classList.remove('field-error'));
    let firstBad=null;
    [...form.elements].forEach(el=>{
      if(el.willValidate&&!el.checkValidity()){
        el.classList.add('field-error');
        firstBad=firstBad||el;
      }
    });
    if(firstBad){
      showMessage(form,'Please check the highlighted fields. Name and a valid phone number are required.','error');
      firstBad.focus();
      return;
    }

    const btn=form.querySelector('button[type="submit"]');
    const old=btn?.textContent;
    if(btn){btn.disabled=true;btn.textContent='Submitting...';}

    const fd=new FormData(form);
    const data=Object.fromEntries(fd.entries());
    data.page=location.href;
    fd.set('page',location.href);
    saveLocalLead({...data,submitted_at:new Date().toISOString()});

    // Explicit form actions are now present on About and all Country forms.
    // Resolve them against the current page so nested pages always reach the root submit.php correctly.
    const action=form.getAttribute('action')||'submit.php';
    const endpoint=new URL(action,location.href).href;
    const isHttp=location.protocol==='http:'||location.protocol==='https:';
    const isVsCodeLiveServer=['5500','5501','5502'].includes(location.port);

    try{
      if(!isHttp || isVsCodeLiveServer){
        // Live Server serves static files only; PHP cannot execute there. Keep the enquiry safely in the browser
        // and clearly tell the user how to run the real backend instead of silently failing.
        showMessage(form,'Details captured. To save enquiries to the server, open this website with start-local-backend.bat (PHP server), not VS Code Live Server.','success');
        form.reset();
        return;
      }

      const res=await fetch(endpoint,{method:'POST',body:fd,headers:{'Accept':'application/json'}});
      const text=await res.text();
      let json={};
      try{json=JSON.parse(text);}catch(_){json={ok:false,message:'The server returned an invalid response.'};}
      if(!res.ok||json.ok===false) throw new Error(json.message||`Server error ${res.status}`);

      showMessage(form,'Thank you. Your enquiry has been submitted successfully. Our counsellor will contact you shortly.','success');
      form.reset();
    }catch(err){
      showMessage(form,err.message||'Unable to submit right now. Please try again or use WhatsApp.','error');
    }finally{
      if(btn){btn.disabled=false;btn.textContent=old;}
    }
  });
});

function ensureGlobalSocialDock(){
  let dock=document.querySelector('.social-dock');
  if(dock) return dock;
  dock=document.createElement('div');
  dock.className='social-dock';
  dock.setAttribute('aria-label','Contact Medico Overseas');
  dock.innerHTML=`
    <a aria-label="Chat on WhatsApp" class="social-fab social-whatsapp" data-social-link="whatsapp" href="#"><span class="social-label">Chat on WhatsApp</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.52 0 .18 5.33.18 11.88c0 2.1.55 4.16 1.6 5.97L.08 24l6.3-1.65a11.9 11.9 0 0 0 5.7 1.45h.01C18.65 23.8 24 18.47 24 11.91c0-3.18-1.24-6.16-3.5-8.41Zm-8.42 18.3a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.29c0-5.45 4.44-9.88 9.9-9.88a9.8 9.8 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7.01c0 5.45-4.45 9.89-9.91 9.89Z"></path></svg></a>
    <a aria-label="Instagram" class="social-fab social-instagram" data-social-link="instagram" href="#"><span class="social-label">Instagram</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path></svg></a>
    <a aria-label="Facebook" class="social-fab social-facebook" data-social-link="facebook" href="#"><span class="social-label">Facebook</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M13.7 22v-9h3l.45-3.5H13.7V7.27c0-1.01.28-1.7 1.74-1.7h1.86V2.44c-.32-.04-1.43-.14-2.72-.14-2.69 0-4.53 1.64-4.53 4.65V9.5H7v3.5h3.05v9h3.65Z"></path></svg></a>
    <a aria-label="X / Twitter" class="social-fab social-twitter" data-social-link="twitter" href="#"><span class="social-label">X / Twitter</span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.25-8.29L2.96 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.72L8.42 4.05H6.58L17.8 19.84Z"></path></svg></a>`;
  document.body.appendChild(dock);
  return dock;
}
function configureSocialLinks(){
  const socialConfig=window.MEDICO_CONFIG||{};
  document.querySelectorAll('[data-social-link]').forEach(link=>{
    const key=link.getAttribute('data-social-link');
    const url=(socialConfig[key]||'').trim();
    if(url){
      link.href=url;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.classList.remove('social-unconfigured');
      link.removeAttribute('title');
    }else{
      link.href='#';
      link.classList.add('social-unconfigured');
      link.title=`Add the official ${key} URL in assets/site-config.js before launch`;
      link.onclick=e=>e.preventDefault();
    }
  });
  document.querySelectorAll('[data-whatsapp-cta]').forEach(a=>{
    if(socialConfig.whatsapp){a.href=socialConfig.whatsapp;a.target='_blank';a.rel='noopener noreferrer';}
  });
}
function initGlobalSocialDock(){ensureGlobalSocialDock();configureSocialLinks();}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initGlobalSocialDock,{once:true});
else initGlobalSocialDock();

// Blog search + category filters
const blogSearch=document.getElementById('blogSearch'), blogCards=[...document.querySelectorAll('[data-blog-card]')], blogCount=document.getElementById('blogResultCount'), blogEmpty=document.getElementById('blogEmpty');
let blogCategory='all';
function filterBlogs(){if(!blogCards.length)return;const q=(blogSearch?.value||'').trim().toLowerCase();let shown=0;blogCards.forEach(card=>{const text=(card.textContent+' '+(card.dataset.title||'')).toLowerCase(),cat=(card.dataset.category||'').toLowerCase();const ok=(!q||text.includes(q))&&(blogCategory==='all'||cat===blogCategory);card.hidden=!ok;if(ok)shown++;});if(blogCount)blogCount.textContent=`${shown} guide${shown===1?'':'s'} found`;if(blogEmpty)blogEmpty.hidden=shown!==0;}
blogSearch?.addEventListener('input',filterBlogs);document.getElementById('blogSearchBtn')?.addEventListener('click',filterBlogs);document.querySelectorAll('[data-blog-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-blog-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');blogCategory=b.dataset.blogFilter;filterBlogs();}));

// FAQ search + filters
const faqSearch=document.getElementById('faqSearch'), faqItems=[...document.querySelectorAll('[data-faq-item]')], faqCount=document.getElementById('faqCount');let faqCategory='all';
function filterFaqs(){if(!faqItems.length)return;const q=(faqSearch?.value||'').trim().toLowerCase();let shown=0;faqItems.forEach(item=>{const ok=(!q||(item.dataset.faqText||'').includes(q))&&(faqCategory==='all'||item.dataset.faqCategory===faqCategory);item.hidden=!ok;if(ok)shown++;});if(faqCount)faqCount.textContent=`${shown} answer${shown===1?'':'s'}`;}
faqSearch?.addEventListener('input',filterFaqs);document.querySelectorAll('[data-faq-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-faq-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');faqCategory=b.dataset.faqFilter;filterFaqs();}));

// Gallery modal
const galleryModal=document.getElementById('galleryModal');
document.querySelectorAll('[data-gallery-item]').forEach(card=>card.addEventListener('click',()=>{if(!galleryModal)return;document.getElementById('galleryModalTitle').textContent=card.dataset.galleryTitle||'';document.getElementById('galleryModalText').textContent=card.dataset.galleryText||'';const art=document.getElementById('galleryModalArt');art.className='gallery-modal-art '+[...card.classList].find(c=>['campus','hostel','clinical','community','food','city','support','departure'].includes(c));galleryModal.classList.add('open');galleryModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));
document.querySelectorAll('[data-gallery-close]').forEach(x=>x.addEventListener('click',()=>{if(!galleryModal)return;galleryModal.classList.remove('open');galleryModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&galleryModal?.classList.contains('open'))document.querySelector('[data-gallery-close]')?.click();});

/* Enquire v4 hover-exit animation */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.global-enquire.enquire-motion-v4').forEach((button) => {
    let leaveTimer;
    button.addEventListener('mouseenter', () => {
      clearTimeout(leaveTimer);
      button.classList.remove('is-leaving');
    });
    button.addEventListener('mouseleave', () => {
      button.classList.add('is-leaving');
      leaveTimer = setTimeout(() => button.classList.remove('is-leaving'), 420);
    });
  });
});

