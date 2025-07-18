const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const CONFIG_DIR = path.join(__dirname, 'configs');
if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR);

app.use(express.json());
app.use(express.static('public'));

app.get('/config/:uid', (req, res) => {
  const cfgPath = path.join(CONFIG_DIR, req.params.uid + '.json');
  if (!fs.existsSync(cfgPath)) {
    return res.json({
      visuals: { box: true, platform: true, username: true, killcount: true, weapon: true, skeleton: true },
      aimbot: { enable: true, show_fov: true, fov: 160, smoothness: 9, visible_check: true, current_key: 2, fovarrows: true },
      triggerbot: { triggerbot: false, triggerbot_enable: false, delay: 1.3, distance: 50.0, key: 2 },
      exploits: { wallbang: true },
      colors: { namecolor: [255,255,255,255], skelcol: [255,255,255,255] }
    });
  }
  res.sendFile(cfgPath);
});
// i love my shitty code haha
app.post('/config/:uid', (req, res) => {
  const cfgPath = path.join(CONFIG_DIR, req.params.uid + '.json');
  fs.writeFileSync(cfgPath, JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
