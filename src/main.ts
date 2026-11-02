import { checklistSections } from './checklist';
import { starterTasks, topics } from './data';
import { loadChecklistState, loadProgress, recordCompletedLesson, saveChecklistState } from './storage';
import type { TopicId } from './types';
import './style.css';

declare global {
  interface Window {
    Telegram?: { WebApp?: { ready: () => void; expand: () => void; setHeaderColor?: (color: string) => void; setBackgroundColor?: (color: string) => void } };
  }
}

interface SessionState {
  topicId: TopicId;
  index: number;
  activeTaskId?: string | null;
  activeTaskSignature?: string | null;
  selectedOptionId: string | null;
  answered: boolean;
  correct: boolean;
  skipped: boolean;
  finished: boolean;
  completionRecorded: boolean;
  hintVisible: boolean;
}

const SESSION_KEY = 'kartochki.session.v1';
const ADULT_KEY = 'kartochki.adult-mode.v1';
const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Не найден контейнер приложения.');

let adultMode = localStorage.getItem(ADULT_KEY) === 'true';
let session: SessionState | null = null;
const telegram = window.Telegram?.WebApp;
if (telegram) {
  telegram.ready();
  telegram.expand();
  telegram.setHeaderColor?.('#f5f8fc');
  telegram.setBackgroundColor?.('#f5f8fc');
}

const escapeHtml = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char] ?? char));
const renderIcon = (icon: string): string => icon === '🪥'
  ? '<svg class="vector-icon toothbrush-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="rotate(35 32 32)"><rect x="26" y="21" width="12" height="38" rx="6" fill="#3B91A4"/><path d="M29 34h6M29 42h6M29 50h6" stroke="#C5EEF0" stroke-width="2" stroke-linecap="round"/><rect x="21" y="7" width="22" height="21" rx="7" fill="#F7FCFC" stroke="#347E91" stroke-width="2"/><path d="M26 11v7M32 10v8M38 11v7" stroke="#E69B5A" stroke-width="2.5" stroke-linecap="round"/><path d="M23 23h18" stroke="#347E91" stroke-width="2"/></g></svg>'
  : escapeHtml(icon);
const topicById = (id: string) => topics.find((topic) => topic.id === id);
const tasksFor = (topicId: TopicId) => starterTasks.filter((task) => task.topicId === topicId);
const getRoute = () => {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  let id = parts[1];
  try { if (id) id = decodeURIComponent(id); } catch { /* Treat malformed fragments as plain IDs. */ }
  return { page: parts[0] || 'home', id };
};

function persistSession(): void {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
function startSession(topicId: TopicId): void {
  session = { topicId, index: 0, activeTaskId: null, activeTaskSignature: null, selectedOptionId: null, answered: false, correct: false, skipped: false, finished: false, completionRecorded: false, hintVisible: false };
  persistSession();
  location.hash = `#/session/${topicId}`;
}
function restoreSession(topicId: TopicId): SessionState {
  if (session?.topicId === topicId) return session;
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as SessionState | null;
    if (saved?.topicId === topicId && Number.isInteger(saved.index) && saved.index >= 0) {
      session = saved;
      return saved;
    }
  } catch { /* Start a new, empty lesson below. */ }
  session = { topicId, index: 0, activeTaskId: null, activeTaskSignature: null, selectedOptionId: null, answered: false, correct: false, skipped: false, finished: false, completionRecorded: false, hintVisible: false };
  persistSession();
  return session;
}
function header(active: string): string {
  return `<header class="topbar">
    <a class="brand" href="#/" aria-label="Карточки — на главную"><span class="brand-mark" aria-hidden="true">✦</span><span>Карточки<span class="brand-sub">учимся вместе</span></span></a>
    <nav class="main-nav" aria-label="Основная навигация">
      <a class="nav-link ${active === 'home' ? 'is-active' : ''}" href="#/">Занятия</a>
      <a class="nav-link ${active === 'checklist' ? 'is-active' : ''}" href="#/checklist">Чек-лист</a>
      <a class="nav-link ${active === 'guide' ? 'is-active' : ''}" href="#/guide">Как добавить</a>
    </nav>
    <button class="adult-switch ${adultMode ? 'is-on' : ''}" type="button" data-action="adult" aria-pressed="${adultMode}"><span aria-hidden="true">${adultMode ? '●' : '○'}</span> <span>${adultMode ? 'Режим взрослого' : 'Взрослый рядом'}</span></button>
  </header>`;
}
function footer(): string {
  return `<footer class="site-footer"><span>Спокойно. В своём темпе.</span><span>Прогресс хранится на этом устройстве; задания обновляются из GitHub.</span></footer>`;
}

function renderHome(): void {
  const progress = loadProgress();
  app!.innerHTML = `${header('home')}
    <main class="page-shell home-page">
      <section class="hero-row">
        <div class="hero-copy">
          <p class="eyebrow">Небольшие шаги каждый день</p>
          <h1>Выбери, с чего<br class="desktop-break"> начнём сегодня</h1>
          <p class="hero-text">Карточки помогают узнавать знакомое, выбирать и сообщать о своих желаниях. Можно ответить касанием или показать выбор взрослому.</p>
          <div class="hero-tags"><span>Без спешки</span><span>Можно повторить</span><span>Речь не обязательна</span></div>
        </div>
        <aside class="progress-card" aria-label="Прогресс занятий">
          <div class="progress-spark" aria-hidden="true">✦</div>
          <p class="eyebrow">Твой путь</p>
          <strong>${escapeHtml(progress.completedLessons)}</strong>
          <span>${progress.completedLessons === 1 ? 'занятие завершено' : 'занятий завершено'}</span>
          <small>Здесь не нужно соревноваться — каждый шаг важен.</small>
        </aside>
      </section>
      <section class="section-heading"><div><p class="eyebrow">Каталог занятий</p><h2>Выбери тему</h2></div><p>Начинай с любой знакомой темы.</p></section>
      <section class="topic-grid" aria-label="Темы занятий">
        ${topics.map((topic) => {
          const count = tasksFor(topic.id).length;
          const done = progress.completedByTopic[topic.id] ?? 0;
          return `<article class="topic-card tone-${escapeHtml(topic.color)}">
            <button class="topic-hit" type="button" data-action="start" data-topic="${escapeHtml(topic.id)}" ${count === 0 ? 'disabled' : ''} aria-label="Начать занятие: ${escapeHtml(topic.title)}">
              <span class="topic-icon" aria-hidden="true">${escapeHtml(topic.icon)}</span>
              <span class="topic-title">${escapeHtml(topic.title)}</span>
              <span class="topic-description">${escapeHtml(topic.description)}</span>
              <span class="topic-meta">${count} ${count === 1 ? 'карточка' : 'карточки'} ${done ? `· ${done} ${done === 1 ? 'занятие' : 'занятий'} завершено` : ''}</span>
              <span class="topic-arrow" aria-hidden="true">→</span>
            </button>
          </article>`;
        }).join('')}
      </section>
      <aside class="gentle-note"><span aria-hidden="true">🌱</span><p><strong>Можно попросить о помощи.</strong> Взрослый рядом повторит инструкцию и поможет зафиксировать ответ, который ты показал(а).</p></aside>
    </main>${footer()}`;
}

function renderSession(topicId: string | undefined): void {
  const topic = topicById(topicId ?? '');
  if (!topic) { app!.innerHTML = `${header('home')}<main class="page-shell"><section class="empty-state"><h1>Выбери тему занятия</h1><a class="button primary" href="#/">К темам</a></section></main>${footer()}`; return; }
  const current = restoreSession(topic.id);
  const tasks = tasksFor(topic.id);
  if (current.finished) { renderCompletion(topic.id); return; }
  if (tasks.length === 0) { app!.innerHTML = `${header('home')}<main class="page-shell"><section class="empty-state"><span class="empty-icon">${escapeHtml(topic.icon)}</span><h1>Пока нет карточек</h1><p>Взрослый может добавить их в GitHub — открой раздел «Как добавить».</p><a class="button primary" href="#/guide">Как добавить</a></section></main>${footer()}`; return; }
  current.index = Math.min(current.index, tasks.length - 1);
  const task = tasks[current.index];
  const taskSignature = JSON.stringify([task.id, task.prompt, task.instruction, task.correctOptionId, task.options]);
  if (current.activeTaskId !== task.id || current.activeTaskSignature !== taskSignature) {
    current.activeTaskId = task.id;
    current.activeTaskSignature = taskSignature;
    current.selectedOptionId = null;
    current.answered = false;
    current.correct = false;
    current.skipped = false;
    current.hintVisible = false;
    persistSession();
  }
  const percent = Math.round(((current.index + (current.answered ? 1 : 0)) / tasks.length) * 100);
  const feedback = current.answered
    ? current.correct
      ? `<div class="feedback success" role="status" aria-live="polite"><span class="feedback-symbol" aria-hidden="true">✓</span><div><strong>Получилось!</strong><span>${current.skipped ? 'Карточка пропущена взрослым.' : 'Хорошо выбрано. Идём дальше, когда будешь готов(а).'}</span></div></div>`
      : `<div class="feedback retry" role="status" aria-live="polite"><span class="feedback-symbol" aria-hidden="true">↻</span><div><strong>Попробуем ещё раз</strong><span>Посмотри на карточки. Можно попросить взрослого помочь.</span></div></div>`
    : current.hintVisible ? `<p class="hint-box" role="status">Подсказка: ${escapeHtml(task.hint)}</p>` : '';
  app!.innerHTML = `${header('home')}
    <main class="page-shell lesson-page">
      <a class="back-link" href="#/">← Все темы</a>
      <section class="lesson-progress" aria-label="Прогресс занятия">
        <div class="lesson-progress-copy"><span>${escapeHtml(topic.title)}</span><strong>Карточка ${current.index + 1} из ${tasks.length}</strong></div>
        <div class="progress-track" role="progressbar" aria-label="Выполнение занятия" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
      </section>
      <article class="task-panel">
        <div class="task-topline"><span class="task-topic-badge">${escapeHtml(topic.icon)} ${escapeHtml(topic.shortTitle)}</span><button class="quiet-button" type="button" data-action="repeat">🔊 Повторить инструкцию</button></div>
        <div class="task-illustration" aria-hidden="true">${renderIcon(task.icon)}</div>
        <p class="task-instruction">${escapeHtml(task.instruction)}</p>
        <h1 class="task-question">${escapeHtml(task.prompt)}</h1>
        <p class="helper-line">${adultMode ? 'Если ребёнок показал взглядом или жестом, нажмите на выбранную им карточку.' : 'Коснись карточки или покажи ответ взрослому.'}</p>
        <div class="answer-grid" role="group" aria-label="Варианты ответа">
          ${task.options.map((answer) => {
            const isSelected = current.selectedOptionId === answer.id;
            const className = isSelected ? (current.correct ? 'answer-card is-correct' : 'answer-card is-try') : 'answer-card';
            return `<button class="${className}" type="button" data-action="answer" data-option="${escapeHtml(answer.id)}" aria-pressed="${isSelected}" ${current.correct || current.skipped ? 'disabled' : ''}>
              <span class="answer-icon" aria-hidden="true">${renderIcon(answer.icon)}</span><span>${escapeHtml(answer.label)}</span>
              ${isSelected && current.correct ? '<span class="answer-check" aria-hidden="true">✓</span>' : ''}
            </button>`;
          }).join('')}
        </div>
        ${feedback}
        <div class="lesson-actions">
          ${current.answered && current.correct
            ? `<button class="button primary next-button" type="button" data-action="next">${current.index === tasks.length - 1 ? 'Завершить занятие' : 'Следующая карточка'} <span aria-hidden="true">→</span></button>`
            : `<button class="button secondary" type="button" data-action="hint">Нужна подсказка</button>`}
          ${adultMode && !current.answered ? '<button class="text-button" type="button" data-action="skip">Пропустить карточку</button>' : ''}
        </div>
      </article>
      <p class="reassurance">Можно остановиться, повторить или попросить взрослого о помощи.</p>
    </main>${footer()}`;
}

function renderCompletion(topicId: string): void {
  const topic = topicById(topicId);
  app!.innerHTML = `${header('home')}<main class="page-shell completion-page">
    <section class="completion-card"><div class="completion-sun" aria-hidden="true">${escapeHtml(topic?.icon ?? '🌟')}</div><p class="eyebrow">Занятие закончено</p><h1>Ты поработал(а) в своём темпе</h1><p>Спасибо за старание. Можно отдохнуть или выбрать другую тему.</p>
      <div class="completion-actions"><button class="button primary" type="button" data-action="restart">Повторить занятие</button><a class="button secondary" href="#/">Выбрать тему</a></div>
    </section></main>${footer()}`;
}

function renderGuide(): void {
  const example = `{
  id: 'dn-moon', // придумайте уникальный id
  topicId: 'day-night',
  icon: '🌙',
  prompt: 'Что можно увидеть на ночном небе?',
  instruction: 'Выбери одну карточку.',
  hint: 'Посмотри на небо.',
  options: [
    option('moon', 'Луну', '🌙'),
    option('sun', 'Солнце', '☀️'),
  ],
  correctOptionId: 'moon',
},`;
  app!.innerHTML = `${header('guide')}<main class="page-shell guide-page">
    <section class="page-intro"><p class="eyebrow">Без админки — прямо в репозитории</p><h1>Как добавить задание</h1><p>Каталог карточек хранится в исходном коде. Вы правите файл на GitHub — после публикации новые карточки появляются у всех пользователей.</p></section>
    <section class="guide-callout"><span class="guide-callout-mark" aria-hidden="true">✎</span><div><strong>Один файл для заданий: <code>src/content.ts</code></strong><p>Каждая тема вынесена в отдельный блок с заголовком. Новую карточку добавляйте в массив своей темы.</p></div></section>
    <section class="guide-steps">
      <article class="guide-step"><span class="step-number">01</span><div><h2>Откройте файл на GitHub</h2><p>В вашем репозитории перейдите в <code>src/content.ts</code> и нажмите на карандаш <strong>Edit this file</strong>.</p></div></article>
      <article class="guide-step"><span class="step-number">02</span><div><h2>Найдите нужную тему</h2><p>В файле есть одиннадцать подписанных разделов. Ниже указаны точные названия и ID, которые нужно сохранить.</p><div class="github-topic-list">${topics.map((topic) => `<div class="github-topic"><span aria-hidden="true">${escapeHtml(topic.icon)}</span><div><strong>${escapeHtml(topic.title)}</strong><code>${escapeHtml(topic.id)}</code></div><small>${tasksFor(topic.id).length} примера</small></div>`).join('')}</div></div></article>
      <article class="guide-step"><span class="step-number">03</span><div><h2>Скопируйте карточку и измените текст</h2><p>Вставьте объект внутрь массива выбранной темы. У каждого задания свой уникальный ID, а правильный ответ ссылается на ID варианта.</p><pre class="code-block"><code>${escapeHtml(example)}</code></pre><ul class="guide-rules"><li><code>topicId</code> должен совпасть с ID блока темы.</li><li><code>id</code> задания не должен повторять уже существующий.</li><li><code>correctOptionId</code> должен совпасть с одним из <code>options[].id</code>.</li><li>Сохраните запятые и фигурные скобки, как в примере.</li></ul></div></article>
      <article class="guide-step"><span class="step-number">04</span><div><h2>Сохраните и опубликуйте</h2><p>Нажмите <strong>Commit changes</strong> в GitHub. Если репозиторий подключён к Render, статический сайт соберётся автоматически; иначе запустите Deploy вручную. Проверяйте задания на телефоне до занятий с ребёнком.</p></div></article>
    </section>
    <section class="guide-bottom"><div><p class="eyebrow">Остался вопрос?</p><h2>Добавление новой темы</h2><p>Для новой темы, помимо карточек, добавьте её ID в <code>TopicId</code> в <code>src/types.ts</code> и описание темы в <code>src/data.ts</code>. Существующие одиннадцать разделов можно редактировать только в <code>src/content.ts</code>.</p></div><a class="button primary" href="#/checklist">Открыть чек-лист запуска <span aria-hidden="true">→</span></a></section>
  </main>${footer()}`;
}

function renderChecklist(): void {
  const state = loadChecklistState();
  const allItems = checklistSections.flatMap((section) => section.items);
  const done = allItems.filter((item) => state[item.id]).length;
  const pct = allItems.length ? Math.round(done / allItems.length * 100) : 0;
  app!.innerHTML = `${header('checklist')}<main class="page-shell checklist-page">
    <section class="page-intro"><p class="eyebrow">От идеи до публикации</p><h1>Чек-лист сервиса</h1><p>Пункты отмечаются только в этом браузере. Пройдите основные этапы перед пилотом.</p></section>
    <section class="checklist-summary"><div><strong>${done} из ${allItems.length}</strong><span>пунктов отмечено</span></div><div class="progress-track"><span style="width:${pct}%"></span></div><button class="text-button" type="button" data-action="clear-checklist">Сбросить отметки</button></section>
    <div class="checklist-sections">${checklistSections.map((section) => `<section class="checklist-card"><div class="checklist-title"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.description)}</p></div><div class="checklist-items">${section.items.map((item) => `<label class="check-item ${state[item.id] ? 'is-checked' : ''}"><input type="checkbox" data-check-id="${escapeHtml(item.id)}" ${state[item.id] ? 'checked' : ''} /><span class="custom-check" aria-hidden="true">${state[item.id] ? '✓' : ''}</span><span>${escapeHtml(item.text)}</span></label>`).join('')}</div></section>`).join('')}</div>
    <aside class="notice warning"><span aria-hidden="true">ⓘ</span><p><strong>Как устроено:</strong> карточки — часть кода и обновляются через GitHub. Прогресс и отметки чек-листа хранятся только в текущем браузере.</p></aside>
  </main>${footer()}`;
}

function render(): void {
  const route = getRoute();
  if (route.page === 'guide') renderGuide();
  else if (route.page === 'checklist') renderChecklist();
  else if (route.page === 'session') renderSession(route.id);
  else renderHome();
}

function chooseAnswer(optionId: string): void {
  const route = getRoute();
  if (route.page !== 'session' || !session) return;
  const task = tasksFor(session.topicId)[session.index];
  if (!task || session.correct) return;
  session.selectedOptionId = optionId;
  session.answered = true;
  session.skipped = false;
  session.correct = task.correctOptionId === optionId;
  session.hintVisible = false;
  persistSession();
  render();
}

function goNext(): void {
  if (!session) return;
  const total = tasksFor(session.topicId).length;
  if (session.index < total - 1) {
    session.index += 1;
    session.activeTaskId = null;
    session.activeTaskSignature = null;
    session.selectedOptionId = null;
    session.answered = false;
    session.correct = false;
    session.skipped = false;
    session.hintVisible = false;
  } else {
    session.finished = true;
    if (!session.completionRecorded) {
      recordCompletedLesson(session.topicId);
      session.completionRecorded = true;
    }
  }
  persistSession();
  render();
}

function speakInstruction(): void {
  const route = getRoute();
  const task = route.page === 'session' && session ? tasksFor(session.topicId)[session.index] : undefined;
  if (!task) return;
  const speech = window.speechSynthesis;
  if (!speech) {
    globalThis.alert('Повтор голосом не поддерживается в этом браузере. Взрослый может прочитать карточку вслух.');
    return;
  }
  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(`${task.instruction} ${task.prompt}`);
  utterance.lang = 'ru-RU';
  utterance.rate = 0.88;
  speech.speak(utterance);
}

app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const control = target.closest<HTMLElement>('[data-action]');
  if (!control) return;
  const action = control.dataset.action;
  if (action === 'adult') {
    adultMode = !adultMode;
    localStorage.setItem(ADULT_KEY, String(adultMode));
    render();
  } else if (action === 'start') {
    const id = control.dataset.topic;
    if (id && topicById(id)) startSession(id as TopicId);
  } else if (action === 'answer') {
    const id = control.dataset.option;
    if (id) chooseAnswer(id);
  } else if (action === 'repeat') speakInstruction();
  else if (action === 'hint') {
    if (session) { session.hintVisible = !session.hintVisible; persistSession(); render(); }
  } else if (action === 'next') goNext();
  else if (action === 'restart' && session) startSession(session.topicId);
  else if (action === 'skip' && session) {
    session.answered = true; session.correct = true; session.skipped = true; session.selectedOptionId = null; persistSession(); render();
  } else if (action === 'clear-checklist') {
    if (window.confirm('Сбросить все отметки чек-листа в этом браузере?')) { saveChecklistState({}); renderChecklist(); }
  }
});

app.addEventListener('change', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.matches('[data-check-id]')) {
    const state = loadChecklistState();
    const id = target.dataset.checkId;
    if (id) state[id] = target.checked;
    saveChecklistState(state);
    renderChecklist();
    if (id) requestAnimationFrame(() => app!.querySelector<HTMLInputElement>(`[data-check-id="${CSS.escape(id)}"]`)?.focus());
  }
});

window.addEventListener('hashchange', render);
render();
