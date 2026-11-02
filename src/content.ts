import type { TaskCard, TopicId } from './types';

const option = (id: string, label: string, icon: string) => ({ id, label, icon });

/**
 * РЕДАКТИРОВАНИЕ ЗАДАНИЙ:
 * 1) Откройте этот файл на GitHub и нажмите Edit (карандаш).
 * 2) Найдите нужную тему ниже и добавьте новую карточку в её массив.
 * 3) Придумайте уникальный id задания; correctOptionId должен совпадать
 *    с id одного из options. Оставьте запятые и фигурные скобки как в примерах.
 * 4) Commit changes — Render пересоберёт сайт, если подключён автодеплой.
 */
export const tasksByTopic: Record<TopicId, TaskCard[]> = {
  // ── 1. Части суток: солнце, звёзды и знакомые признаки дня и ночи ──
  'day-night': [
    {
      id: 'dn-sun', topicId: 'day-night', icon: '☀️',
      prompt: 'На небе светит солнце. Какое это время?', instruction: 'Выбери одну карточку.', hint: 'Посмотри на знак солнца.',
      options: [option('day', 'День', '☀️'), option('night', 'Ночь', '🌙')], correctOptionId: 'day',
    },
    {
      id: 'dn-stars', topicId: 'day-night', icon: '🌟',
      prompt: 'Когда на небе видны звёзды?', instruction: 'Покажи подходящую карточку.', hint: 'На какой карточке есть звёзды?',
      options: [option('day', 'Днём', '🌤️'), option('night', 'Ночью', '🌙')], correctOptionId: 'night',
    },
  ],

  // ── 2. Гигиена: знакомые предметы ухода и простые действия ──
  hygiene: [
    {
      id: 'hy-towel', topicId: 'hygiene', icon: '🧼',
      prompt: 'Чем можно вытереть мокрые руки?', instruction: 'Найди нужный предмет.', hint: 'Найди мягкую ткань.',
      options: [option('towel', 'Полотенце', '🧻'), option('brush', 'Щётка', '🪥')], correctOptionId: 'towel',
    },
    {
      id: 'hy-brush', topicId: 'hygiene', icon: '🪥',
      prompt: 'Чем чистят зубы?', instruction: 'Выбери предмет для ухода.', hint: 'Посмотри, у чего есть щетинки.',
      options: [option('brush', 'Зубная щётка', '🪥'), option('cup', 'Чашка', '🥤')], correctOptionId: 'brush',
    },
  ],

  // ── 3. Одежда и погода: выбираем привычные вещи по ситуации ──
  'clothes-weather': [
    {
      id: 'cw-rain', topicId: 'clothes-weather', icon: '🌧️',
      prompt: 'Идёт дождь. Что пригодится на улице?', instruction: 'Выбери подходящую вещь.', hint: 'Что помогает не промокнуть?',
      options: [option('umbrella', 'Зонт', '☂️'), option('panama', 'Панама', '👒')], correctOptionId: 'umbrella',
    },
    {
      id: 'cw-cold', topicId: 'clothes-weather', icon: '❄️',
      prompt: 'На улице холодно. Что можно надеть?', instruction: 'Покажи тёплую одежду.', hint: 'Какая вещь греет тело?',
      options: [option('jacket', 'Куртка', '🧥'), option('shorts', 'Шорты', '🩳')], correctOptionId: 'jacket',
    },
  ],

  // ── 4. Еда и посуда: знакомая еда, питьё и бытовая посуда ──
  food: [
    {
      id: 'fo-soup', topicId: 'food', icon: '🥣',
      prompt: 'Чем обычно едят суп?', instruction: 'Найди нужный предмет.', hint: 'Что держат в руке за ручку?',
      options: [option('spoon', 'Ложка', '🥄'), option('sock', 'Носок', '🧦')], correctOptionId: 'spoon',
    },
    {
      id: 'fo-drink', topicId: 'food', icon: '💧',
      prompt: 'Из чего можно пить воду?', instruction: 'Выбери посуду.', hint: 'В какую посуду наливают напиток?',
      options: [option('cup', 'Чашка', '🥤'), option('plate', 'Тарелка', '🍽️')], correctOptionId: 'cup',
    },
  ],

  // ── 5. Предметы дома: для чего нужны привычные вещи ──
  home: [
    {
      id: 'ho-hands', topicId: 'home', icon: '🧺',
      prompt: 'Нужно вытереть руки. Что взять?', instruction: 'Выбери предмет.', hint: 'Ищи вещь из мягкой ткани.',
      options: [option('towel', 'Полотенце', '🧻'), option('ball', 'Мяч', '⚽')], correctOptionId: 'towel',
    },
    {
      id: 'ho-play', topicId: 'home', icon: '🧸',
      prompt: 'Чем можно поиграть?', instruction: 'Покажи игрушку.', hint: 'Найди предмет для игры.',
      options: [option('ball', 'Мяч', '⚽'), option('spoon', 'Ложка', '🥄')], correctOptionId: 'ball',
    },
  ],

  // ── 6. Транспорт и безопасность: простые правила рядом с дорогой ──
  transport: [
    {
      id: 'tr-bus', topicId: 'transport', icon: '🚌',
      prompt: 'Где обычно едет автобус?', instruction: 'Выбери место движения.', hint: 'Автобус едет по улице.',
      options: [option('road', 'По дороге', '🛣️'), option('water', 'По воде', '🌊')], correctOptionId: 'road',
    },
    {
      id: 'tr-stop', topicId: 'transport', icon: '🚦',
      prompt: 'Перед переходом нужно остановиться и…', instruction: 'Выбери безопасное действие.', hint: 'Ребёнок переходит дорогу вместе со взрослым.',
      options: [option('wait', 'Подождать взрослого', '🧑‍🧒'), option('run', 'Побежать одному', '🏃')], correctOptionId: 'wait',
    },
  ],

  // ── 7. Эмоции, желания и просьбы: сообщаем о помощи и перерыве ──
  feelings: [
    {
      id: 'fe-help', topicId: 'feelings', icon: '🧩',
      prompt: 'Не получается открыть коробку. Что можно попросить?', instruction: 'Выбери сообщение.', hint: 'Можно обратиться к взрослому.',
      options: [option('help', 'Помоги, пожалуйста', '🤝'), option('bye', 'До свидания', '👋')], correctOptionId: 'help',
    },
    {
      id: 'fe-break', topicId: 'feelings', icon: '🌿',
      prompt: 'Если устал, можно попросить…', instruction: 'Покажи, что тебе нужно.', hint: 'Можно ненадолго остановиться и отдохнуть.',
      options: [option('break', 'Перерыв', '☁️'), option('more', 'Ещё задание', '➕')], correctOptionId: 'break',
    },
  ],
};
