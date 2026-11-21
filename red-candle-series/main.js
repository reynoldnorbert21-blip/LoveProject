const ep = new URLSearchParams(location.search).get('ep') || '1';
const mod = await import(`./ep${ep}/film.js`);
const draw = await mod.setup(document.getElementById('c'));
window.render = t => draw(t);
render(0); window.READY = true;
