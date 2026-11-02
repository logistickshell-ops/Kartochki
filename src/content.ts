import type { TaskCard, TopicId } from './types';

const option = (id: string, label: string, icon: string) => ({ id, label, icon });

/**
 * РЕДАКТИРОВАНИЕ ЗАДАНИЙ:
 * 1) Откройте этот файл на GitHub и нажмите Edit (карандаш).
 * 2) Найдите нужную тему ниже и добавьте карточку в её массив.
 * 3) Используйте уникальный id задания; correctOptionId должен совпадать
 *    с id одного из options. Не удаляйте запятые и скобки.
 * 4) Commit changes — Render пересоберёт сайт, если подключён автодеплой.
 */
export const tasksByTopic: Record<TopicId, TaskCard[]> = {
  // ── 1. День и ночь: солнце, звёзды и части суток ──
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
    {
      id: 'dn-morning', topicId: 'day-night', icon: '🌅',
      prompt: 'Как называется время, когда начинается день?', instruction: 'Выбери часть суток.', hint: 'После ночи наступает утро.',
      options: [option('morning', 'Утро', '🌅'), option('evening', 'Вечер', '🌇')], correctOptionId: 'morning',
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
    {
      id: 'hy-soap', topicId: 'hygiene', icon: '🫧',
      prompt: 'Чем можно намылить руки?', instruction: 'Выбери предмет для мытья рук.', hint: 'От него появляются пузырьки.',
      options: [option('soap', 'Мыло', '🧼'), option('spoon', 'Ложка', '🥄')], correctOptionId: 'soap',
    },
  ],

  // ── 3. Одежда: выбираем привычные вещи по ситуации ──
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
    {
      id: 'cw-sun', topicId: 'clothes-weather', icon: '🧢',
      prompt: 'На улице ярко светит солнце. Что надеть на голову?', instruction: 'Выбери одежду для солнечного дня.', hint: 'Это лёгкая летняя шляпа.',
      options: [option('panama', 'Панама', '👒'), option('scarf', 'Шарф', '🧣')], correctOptionId: 'panama',
    },
  ],

  // ── 4. Еда и посуда: знакомая еда, питьё и предметы для еды ──
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
    {
      id: 'fo-apple', topicId: 'food', icon: '🍎',
      prompt: 'На чём обычно лежит яблоко во время еды?', instruction: 'Выбери предмет посуды.', hint: 'Из этого едят обед.',
      options: [option('plate', 'Тарелка', '🍽️'), option('pillow', 'Подушка', '🛏️')], correctOptionId: 'plate',
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
    {
      id: 'ho-sleep', topicId: 'home', icon: '🛏️',
      prompt: 'Где обычно спят ночью?', instruction: 'Выбери место для сна.', hint: 'На этом лежат под одеялом.',
      options: [option('bed', 'На кровати', '🛏️'), option('table', 'На столе', '🪑')], correctOptionId: 'bed',
    },
  ],

  // ── 6. Транспорт и безопасность: транспорт и правила рядом с дорогой ──
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
    {
      id: 'tr-door', topicId: 'transport', icon: '🚌',
      prompt: 'Через что пассажир входит в автобус?', instruction: 'Найди вход в автобус.', hint: 'Это открывают, чтобы войти.',
      options: [option('door', 'Через дверь', '🚪'), option('window', 'Через окно', '🪟')], correctOptionId: 'door',
    },
  ],

  // ── 7. Желания и просьбы: сообщаем, что нужно и что не нравится ──
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
    {
      id: 'fe-stop', topicId: 'feelings', icon: '✋',
      prompt: 'Если не хочешь продолжать, что можно сказать?', instruction: 'Выбери нужное сообщение.', hint: 'Так можно обозначить границу.',
      options: [option('stop', 'Стоп', '✋'), option('more', 'Ещё', '➕')], correctOptionId: 'stop',
    },
  ],

  // ── 8. Времена года: весна, лето, осень и зима ──
  seasons: [
    {
      id: 'se-spring', topicId: 'seasons', icon: '🌸',
      prompt: 'Какое время года приходит после зимы?', instruction: 'Выбери время года.', hint: 'Весной становится теплее.',
      options: [option('spring', 'Весна', '🌸'), option('autumn', 'Осень', '🍂')], correctOptionId: 'spring',
    },
    {
      id: 'se-autumn', topicId: 'seasons', icon: '🍂',
      prompt: 'Когда листья на деревьях желтеют и опадают?', instruction: 'Выбери время года.', hint: 'Это бывает перед зимой.',
      options: [option('autumn', 'Осенью', '🍂'), option('summer', 'Летом', '☀️')], correctOptionId: 'autumn',
    },
    {
      id: 'se-winter', topicId: 'seasons', icon: '❄️',
      prompt: 'Когда на улице часто холодно и идёт снег?', instruction: 'Выбери время года.', hint: 'Это самое холодное время года.',
      options: [option('winter', 'Зимой', '❄️'), option('summer', 'Летом', '☀️')], correctOptionId: 'winter',
    },
  ],

  // ── 9. Дни недели: порядок и количество дней ──
  week: [
    {
      id: 'wk-count', topicId: 'week', icon: '📅',
      prompt: 'Сколько дней в одной неделе?', instruction: 'Выбери число.', hint: 'В неделе семь дней.',
      options: [option('seven', 'Семь', '7️⃣'), option('five', 'Пять', '5️⃣')], correctOptionId: 'seven',
    },
    {
      id: 'wk-after-mon', topicId: 'week', icon: '🗓️',
      prompt: 'Какой день идёт после понедельника?', instruction: 'Выбери день недели.', hint: 'После понедельника наступает вторник.',
      options: [option('tuesday', 'Вторник', '📅'), option('friday', 'Пятница', '📆')], correctOptionId: 'tuesday',
    },
    {
      id: 'wk-after-fri', topicId: 'week', icon: '📆',
      prompt: 'Какой день идёт после пятницы?', instruction: 'Выбери день недели.', hint: 'Это первый выходной день недели.',
      options: [option('saturday', 'Суббота', '📅'), option('wednesday', 'Среда', '🗓️')], correctOptionId: 'saturday',
    },
  ],

  // ── 10. Животные: голоса, места обитания и особенности ──
  animals: [
    {
      id: 'an-cat', topicId: 'animals', icon: '🐾',
      prompt: 'Кто говорит «мяу»?', instruction: 'Выбери животное.', hint: 'Это домашний питомец с усами.',
      options: [option('cat', 'Кошка', '🐱'), option('dog', 'Собака', '🐶')], correctOptionId: 'cat',
    },
    {
      id: 'an-fish', topicId: 'animals', icon: '🐟',
      prompt: 'Кто живёт в воде?', instruction: 'Выбери животное.', hint: 'У него есть плавники.',
      options: [option('fish', 'Рыба', '🐟'), option('rabbit', 'Кролик', '🐰')], correctOptionId: 'fish',
    },
    {
      id: 'an-elephant', topicId: 'animals', icon: '🐘',
      prompt: 'У какого животного есть длинный хобот?', instruction: 'Выбери животное.', hint: 'Это большое животное с большими ушами.',
      options: [option('elephant', 'У слона', '🐘'), option('horse', 'У лошади', '🐴')], correctOptionId: 'elephant',
    },
  ],

  // ── 11. Погода: дождь, снег, солнце и облака ──
  weather: [
    {
      id: 'we-rain', topicId: 'weather', icon: '🌧️',
      prompt: 'Что можно взять с собой, когда идёт дождь?', instruction: 'Выбери подходящую вещь.', hint: 'Она помогает не промокнуть.',
      options: [option('umbrella', 'Зонт', '☂️'), option('sunglasses', 'Солнечные очки', '🕶️')], correctOptionId: 'umbrella',
    },
    {
      id: 'we-snow', topicId: 'weather', icon: '❄️',
      prompt: 'Что падает с неба во время снегопада?', instruction: 'Выбери осадки.', hint: 'Это белые холодные снежинки.',
      options: [option('snow', 'Снег', '❄️'), option('leaves', 'Листья', '🍃')], correctOptionId: 'snow',
    },
    {
      id: 'we-sun', topicId: 'weather', icon: '☀️',
      prompt: 'Как называется погода, когда светит солнце?', instruction: 'Выбери описание погоды.', hint: 'На небе ярко и почти нет туч.',
      options: [option('sunny', 'Солнечная', '☀️'), option('rainy', 'Дождливая', '🌧️')], correctOptionId: 'sunny',
    },
  ],
};
