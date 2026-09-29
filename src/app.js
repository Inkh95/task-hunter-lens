import { score, rank } from './scoring.js';

const KEY = 'task-hunter-lens-v1';
const statuses = ['new', 'shortlisted', 'applied', 'accepted', 'paid', 'discarded'];
const form = document.querySelector('#task-form');
const list = document.querySelector('#task-list');
const error = document.querySelector('#form-error');
const notice = document.querySelector('#notice');
const count = document.querySelector('#count');
let filter = 'active';
let tasks = [];
let storageAvailable = true;

const examples = [
  { title: 'Example: quick documentation fix', source: 'Illustrative listing', url: '', reward: 80, fee: 0, hours: 2, acceptance: 75, payout: 95, deadline: '', status: 'new', demo: true },
  { title: 'Example: large open-ended build', source: 'Illustrative listing', url: '', reward: 350, fee: 20, hours: 18, acceptance: 35, payout: 85, deadline: '', status: 'new', demo: true }
];

function inform(message) { notice.textContent = message; notice.hidden = false; }
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ version: 1, tasks })); }
  catch { storageAvailable = false; inform('Browser storage is unavailable. Changes will last only until this page closes.'); }
}
try {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.version !== 1 || !Array.isArray(parsed.tasks)) throw Error('Invalid saved board');
    tasks = parsed.tasks.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string' && score(t) && statuses.includes(t.status));
  }
} catch { tasks = []; inform('Saved board could not be read. Start with a fresh entry.'); }

const euro = n => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n);
function el(tag, cls, content) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (content != null) node.textContent = content;
  return node;
}
function render() {
  const visible = rank(tasks.filter(t => filter === 'all' || (filter === 'paid' ? t.status === 'paid' : !['paid', 'discarded'].includes(t.status))));
  count.textContent = tasks.length ? String(tasks.length) : '';
  list.replaceChildren();
  if (!visible.length) {
    const empty = el('div', 'empty');
    empty.append(el('div', 'empty-symbol', '◎'), el('h3', '', filter === 'active' && !tasks.length ? 'No opportunities yet' : 'Nothing in this view'), el('p', '', 'Add a real listing or load clearly marked examples to see the ranking.'));
    list.append(empty); return;
  }
  visible.forEach((task, index) => {
    const s = score(task);
    const card = el('article', 'task-card');
    const top = el('div', 'task-top');
    const body = el('div', 'task-body');
    const tags = el('div', 'tags');
    tags.append(el('span', 'status ' + task.status, task.status.toUpperCase()));
    if (task.demo) tags.append(el('span', 'demo-tag', 'EXAMPLE · NOT A LIVE TASK'));
    body.append(tags, el('h3', '', task.title), el('p', 'source', task.source || 'Unspecified source'));
    const metric = el('div', 'metric');
    metric.append(el('strong', '', euro(s.hourly)), el('small', '', '/ expected hour'));
    top.append(body, metric);
    const trail = el('div', 'score-trail');
    trail.append(el('span', '', euro(s.net) + ' net'), el('span', '', task.acceptance + '% accepted'), el('span', '', task.payout + '% paid'), el('span', '', task.hours + ' h'));
    const actions = el('div', 'card-actions');
    const selector = el('select', 'status-select');
    selector.setAttribute('aria-label', 'Status for ' + task.title);
    statuses.forEach(v => { const opt = new Option(v[0].toUpperCase() + v.slice(1), v); selector.add(opt); });
    selector.value = task.status;
    selector.addEventListener('change', () => { task.status = selector.value; persist(); render(); });
    actions.append(selector);
    if (task.url) {
      const link = el('a', 'text-link', 'Open listing ↗');
      link.href = task.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      actions.append(link);
    }
    const edit = el('button', 'text-button', 'Edit'); edit.type = 'button';
    edit.addEventListener('click', () => {
      for (const name of ['id','title','source','url','reward','fee','hours','deadline','acceptance','payout']) form.elements[name].value = task[name] ?? '';
      document.querySelector('#save-button').firstChild.textContent = 'Save changes ';
      document.querySelector('#cancel-edit').hidden = false;
      form.scrollIntoView({ behavior: 'smooth' }); form.elements.title.focus();
    });
    const remove = el('button', 'text-button danger', 'Remove'); remove.type = 'button';
    remove.addEventListener('click', () => { tasks = tasks.filter(x => x.id !== task.id); persist(); render(); });
    actions.append(edit, remove);
    card.append(top, trail);
    if (task.deadline) card.append(el('p', 'deadline', 'Deadline: ' + task.deadline));
    card.append(actions);
    list.append(card);
  });
}
form.addEventListener('submit', event => {
  event.preventDefault(); error.hidden = true;
  const data = Object.fromEntries(new FormData(form));
  const title = String(data.title || '').trim();
  let url = String(data.url || '').trim();
  if (url) {
    try { const parsed = new URL(url); if (!['https:', 'http:'].includes(parsed.protocol)) throw Error(); url = parsed.href; }
    catch { error.textContent = 'Enter a valid http or https listing URL.'; error.hidden = false; return; }
  }
  const candidate = { ...data, title, url, source: String(data.source || '').trim(), reward: Number(data.reward), fee: Number(data.fee), hours: Number(data.hours), acceptance: Number(data.acceptance), payout: Number(data.payout) };
  if (!title || !score(candidate)) { error.textContent = 'Enter a title, positive reward and hours, fees no higher than reward, and chances from 0 to 100.'; error.hidden = false; return; }
  if (data.id) {
    const current = tasks.find(t => t.id === data.id);
    if (current) Object.assign(current, candidate, { demo: false });
  } else tasks.push({ ...candidate, id: crypto.randomUUID(), status: 'new', demo: false, createdAt: new Date().toISOString() });
  persist(); render(); resetForm();
});
function resetForm() {
  form.reset(); form.elements.id.value = '';
  form.elements.reward.value = 100; form.elements.fee.value = 0; form.elements.hours.value = 4;
  form.elements.acceptance.value = 70; form.elements.payout.value = 90;
  document.querySelector('#save-button').firstChild.textContent = 'Add to board ';
  document.querySelector('#cancel-edit').hidden = true;
  error.hidden = true;
}
document.querySelector('#cancel-edit').addEventListener('click', resetForm);
document.querySelector('#load-examples').addEventListener('click', () => {
  const existing = new Set(tasks.filter(t => t.demo).map(t => t.title));
  examples.filter(t => !existing.has(t.title)).forEach(t => tasks.push({ ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() }));
  persist(); render();
});
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === button));
  render();
}));
render();
