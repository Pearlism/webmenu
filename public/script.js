const uid = new URLSearchParams(window.location.search).get('uid');
if (!uid) {
  document.body.innerHTML = '<p style="color:red;">No UID specified. Use ?uid=YOUR_UID in the URL.</p>';
  throw new Error('UID missing');
}
document.getElementById('uid-label').innerText = uid;

const schema = {
  visuals: ['box','platform','username','killcount','weapon','skeleton'],
  aimbot: ['aim_enable','show_fov','fov','smoothness','visible_check','current_key','fovarrows'],
  triggerbot: ['triggerbot','triggerbot_enable','delay','distance','key'],
  exploits: ['wallbang']
};

function loadConfig(cfg) {
  for (let ns in schema) {
    schema[ns].forEach(field => {
      const el = document.getElementById(field);
      const val = cfg[ns][field];
      if (typeof el === 'undefined') return;
      if (el.type === 'checkbox') el.checked = !!val;
      else el.value = (Array.isArray(val) ? val.join(',') : val);
    });
  }
} //my shitty code haha
function setupSlider(id) {
      const slider = document.getElementById(id);
      const display = document.getElementById(id + '-value');
      if (slider && display) {
        display.textContent = slider.value;
        slider.addEventListener('input', () => {
          display.textContent = slider.value;
        });
      }
    }
    ['fov', 'smoothness', 'delay', 'distance'].forEach(setupSlider);
fetch('/config/' + uid)
  .then(r => r.json())
  .then(cfg => loadConfig(cfg))
  .catch(err => console.error('Failed to load config:', err));

function saveConfig() {
  const payload = {};
  for (let ns in schema) {
    payload[ns] = {};
    schema[ns].forEach(field => {
      const el = document.getElementById(field);
      if (!el) return;
      let val;
      if (el.type === 'checkbox') val = el.checked;
      else if (field === 'namecolor' || field === 'skelcol')
        val = el.value.split(',').map(n => parseFloat(n));
      else
        val = parseFloat(el.value);
      payload[ns][field] = val;
    });
  }

  fetch('/config/' + uid, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(resp => resp.json())
    .then(res => {
      document.getElementById('status').innerText = 'Saved ✔️';
      setTimeout(() => (document.getElementById('status').innerText = ''), 2000);
    })
    .catch(err => { alert('Save failed'); console.error(err) });
}
