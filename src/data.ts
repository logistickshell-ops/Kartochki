import { tasksByTopic } from './content';
import type { Topic, TopicId } from './types';

export const topics: Topic[] = [
  { id: 'day-night', title: 'День и ночь', shortTitle: 'Части суток', icon: '☀️', description: 'Солнце, звёзды и знакомые события дня.', color: 'sky' },
  { id: 'hygiene', title: 'Чистые руки', shortTitle: 'Гигиена', icon: '🫧', description: 'Предметы ухода и простые действия.', color: 'mint' },
  { id: 'clothes-weather', title: 'Одежда', shortTitle: 'Одежда', icon: '🧥', description: 'Выбираем привычные вещи по ситуации.', color: 'peach' },
  { id: 'food', title: 'Еда и посуда', shortTitle: 'Еда', icon: '🍎', description: 'Знакомая еда, питьё и предметы для еды.', color: 'cream' },
  { id: 'home', title: 'Предметы дома', shortTitle: 'Дом', icon: '🏠', description: 'Для чего нужны привычные вещи.', color: 'lilac' },
  { id: 'transport', title: 'Транспорт и безопасность', shortTitle: 'Транспорт', icon: '🚌', description: 'Транспорт и правила рядом с дорогой.', color: 'blue' },
  { id: 'feelings', title: 'Желания и просьбы', shortTitle: 'Общение', icon: '💬', description: 'Попросить помощь, паузу или сказать «стоп».', color: 'rose' },
  { id: 'seasons', title: 'Времена года', shortTitle: 'Сезоны', icon: '🍂', description: 'Весна, лето, осень и зима.', color: 'mint' },
  { id: 'week', title: 'Дни недели', shortTitle: 'Неделя', icon: '📅', description: 'Порядок и названия дней недели.', color: 'sky' },
  { id: 'animals', title: 'Животные', shortTitle: 'Животные', icon: '🐾', description: 'Знакомые животные, их голоса и особенности.', color: 'cream' },
  { id: 'weather', title: 'Погода', shortTitle: 'Погода', icon: '🌦️', description: 'Солнце, дождь, снег и облака.', color: 'blue' },
];

export const starterTasks = topics.flatMap((topic) => tasksByTopic[topic.id as TopicId]);
