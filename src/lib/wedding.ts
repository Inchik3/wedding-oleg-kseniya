/**
 * Ссылка на Google Таблицу.
 *
 * Вставляется НЕ адрес самой таблицы, а ссылка веб-приложения Apps Script.
 * Она заканчивается на /exec.
 * Пример: "https://script.google.com/macros/s/AKfycb.../exec"
 *
 * Для опубликованного сайта ту же ссылку вставьте в
 * wedding-pages/project/js/config.js → rsvp.googleAppsScriptUrl
 *
 * Пока строка пустая, анкета не отправляет ответы.
 */
export const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwqreadZUgtHhNcwDGQeEcIOxZMXcJ5WvR7MNmNvWdg4Incrmlzt692QrwWJeib8WYSLg/exec";

export const couple = {
  groom: "Олег",
  bride: "Ксения",
  monogram: "О & К",
  seal: "О&К",
};

export const wedding = {
  dateText: "17 июля 2027",
  dateNumeric: "17.07.2027",
  dateEnvelope: "17 · 07 · 2027",
  countdownTarget: "2027-07-17T14:00:00+03:00",
  phrase: "Мы говорим друг другу главное «да»",
  venue: "Кафе «Светлояр»",
  city: "г. Семёнов",
  mapUrl:
    "https://yandex.ru/maps/?ll=44.574714%2C56.820305&mode=poi&poi%5Bpoint%5D=44.575102%2C56.820957&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D219521319478&utm_source=share&z=14",
};

export const invitation = [
  "В нашей жизни наступает день, который мы хотим разделить с самыми близкими людьми.",
  "Приглашаем вас стать частью нашей свадебной истории — тёплой, красивой и наполненной любовью.",
  "Ваше присутствие сделает этот день ещё счастливее.",
];

export const schedule = [
  {
    time: "14:00",
    title: "Регистрация в ЗАГСе",
    text: "Самый важный момент этого дня. Будем счастливы разделить его вместе с вами.",
  },
  {
    time: "15:00",
    title: "Фотосессия",
    text: "Сохраним этот день в красивых кадрах, пока эмоции ещё самые свежие.",
  },
  {
    time: "16:30",
    title: "Сбор гостей",
    text: "Встречаемся в кафе «Светлояр», общаемся и настраиваемся на праздник.",
  },
  {
    time: "17:00",
    title: "Банкет",
    text: "Время вкусной еды, искренних поздравлений, тёплых разговоров, весёлых танцев и ярких эмоций.",
  },
];

export const wishes = [
  "Не забудьте взять с собой улыбки, хорошее настроение и удобную обувь для танцев.",
  "Пожалуйста, не утруждайте себя выбором и поиском подарков — мы будем очень рады вашим пожеланиям в конвертах. Обещаем потратить их с умом (или безумством).",
  "Подарите себе вечер отдыха. По возможности оставьте детей под присмотром и позвольте себе по-настоящему расслабиться, забыть о хлопотах и повеселиться с нами до позднего вечера.",
  "Если вы планировали подарить букет, мы будем признательны, если вы замените его на бутылочку вашего любимого алкоголя с пожеланием открыть в определённую дату, хорошего чая или настольную игру. Нам будет очень приятно пользоваться ими после праздника.",
];

export const gallery = [
  { src: "/wedding/g1.jpg", alt: "Олег и Ксения в портретном снимке" },
  { src: "/wedding/g2.jpg", alt: "Олег и Ксения на сердечной скамейке" },
  { src: "/wedding/g3.jpg", alt: "Олег и Ксения ночью у воды" },
  { src: "/wedding/g4.jpg", alt: "Олег и Ксения на сердечной скамейке" },
  { src: "/wedding/g5.jpg", alt: "Олег и Ксения на сердечной скамейке" },
  { src: "/wedding/g6.jpg", alt: "Олег и Ксения на фоне гор" },
];

export const attendanceOptions = [
  { value: "attending", label: "Да, буду присутствовать" },
  { value: "declined", label: "К сожалению, не смогу присутствовать" },
] as const;

export const drinks = [
  { value: "cognac", label: "Коньяк" },
  { value: "whiskey", label: "Виски" },
  { value: "white-wine", label: "Вино белое" },
  { value: "red-wine", label: "Вино красное" },
  { value: "champagne", label: "Шампанское" },
  { value: "none", label: "Не пью" },
] as const;

export type Attendance = (typeof attendanceOptions)[number]["value"];
export type ModalId = "invite" | "program" | "wishes" | "gallery" | "rsvp";
