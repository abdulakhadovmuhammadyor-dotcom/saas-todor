import type { Exercise, ExerciseKind, Lesson, Level, Topic } from "@/lib/types";

export const levels: Level[] = [
  {
    id: "beginner",
    title: "Начальный",
    cefr: "A1",
    description: "Первые слова, простые диалоги и уверенное «здравствуйте».",
    order: 1,
  },
  {
    id: "intermediate",
    title: "Средний",
    cefr: "B1",
    description: "Свободное описание себя, планов и повседневных ситуаций.",
    order: 2,
  },
  {
    id: "advanced",
    title: "Продвинутый",
    cefr: "C1",
    description: "Сложные конструкции, нюансы смысла и живая речь.",
    order: 3,
  },
  {
    id: "expert",
    title: "Эксперт",
    cefr: "C2",
    description: "Точность, стиль и аргументация на уровне носителя.",
    order: 4,
  },
];

export const topics: Topic[] = [
  { id: "t-greetings", levelId: "beginner", title: "Знакомство", description: "Имена, приветствия, вежливые слова", pro: false },
  { id: "t-family", levelId: "beginner", title: "Семья и дом", description: "Кто есть кто, где что находится", pro: false },
  { id: "t-numbers", levelId: "beginner", title: "Числа и время", description: "Счёт, часы, даты", pro: false },
  { id: "t-daily", levelId: "beginner", title: "Мой день", description: "Повседневные действия", pro: true },
  { id: "t-travel", levelId: "intermediate", title: "Путешествия", description: "Транспорт, отель, направления", pro: false },
  { id: "t-work", levelId: "intermediate", title: "Работа и учёба", description: "Профессии и задачи", pro: false },
  { id: "t-food", levelId: "intermediate", title: "Еда и покупки", description: "Магазин, кафе, рецепты", pro: false },
  { id: "t-habits", levelId: "intermediate", title: "Привычки", description: "Режим дня и частота действий", pro: true },
  { id: "t-idioms", levelId: "advanced", title: "Идиомы", description: "Устойчивые выражения", pro: true },
  { id: "t-business", levelId: "advanced", title: "Деловая переписка", description: "Письма, отчёты, звонки", pro: true },
  { id: "t-aspect", levelId: "advanced", title: "Вид глагола", description: "Нюансы совершенного вида", pro: true },
  { id: "t-rhetoric", levelId: "expert", title: "Риторика", description: "Выступление и убеждение", pro: true },
  { id: "t-style", levelId: "expert", title: "Стилистика", description: "Норма и речевые регистры", pro: true },
  { id: "t-debate", levelId: "expert", title: "Дискуссия", description: "Аргументы и возражения", pro: true },
];

const quiz = (
  id: string,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
): Exercise => ({ id, kind: "quiz", prompt, options, answer, explanation });

const written = (
  kind: ExerciseKind,
  id: string,
  prompt: string,
  optionsOrAnswer: string[] | string,
  answerOrExplanation: string,
  explanation?: string,
): Exercise =>
  Array.isArray(optionsOrAnswer)
    ? {
        id,
        kind,
        prompt,
        options: optionsOrAnswer,
        answer: answerOrExplanation,
        explanation,
      }
    : { id, kind, prompt, answer: optionsOrAnswer, explanation: answerOrExplanation };

const task = (
  id: string,
  prompt: string,
  optionsOrAnswer: string[] | string,
  answerOrExplanation: string,
  explanation?: string,
): Exercise => written("task", id, prompt, optionsOrAnswer, answerOrExplanation, explanation);

const grammar = (
  id: string,
  prompt: string,
  optionsOrAnswer: string[] | string,
  answerOrExplanation: string,
  explanation?: string,
): Exercise => written("grammar", id, prompt, optionsOrAnswer, answerOrExplanation, explanation);

const spelling = (
  id: string,
  prompt: string,
  optionsOrAnswer: string[] | string,
  answerOrExplanation: string,
  explanation?: string,
): Exercise => written("spelling", id, prompt, optionsOrAnswer, answerOrExplanation, explanation);

const speaking = (id: string, targetPhrase: string): Exercise => ({
  id,
  kind: "speaking",
  prompt: `Произнесите: «${targetPhrase}». Слушайте и повторяйте.`,
  targetPhrase,
  explanation: "Обратите внимание на ударение и чистоту гласных.",
});

const listening = (
  id: string,
  prompt: string,
  options: string[],
  answer: string,
): Exercise => ({ id, kind: "listening", prompt, options, answer, targetPhrase: answer });

export const lessons: Lesson[] = [
  {
    id: "l-hello",
    topicId: "t-greetings",
    levelId: "beginner",
    title: "Здравствуйте, меня зовут…",
    description: "Представляемся и поддерживаем короткий диалог.",
    pro: false,
    exercises: [
      quiz("e1", "Как вежливо поприветствовать незнакомого человека?", ["Привет", "Здравствуйте", "Йо"], "Здравствуйте", "«Здравствуйте» — универсальное вежливое приветствие."),
      task("e2", "Вставьте слово: Меня … Анна.", ["зовут", "зову", "называю"], "зовут", "Глагол «зовут» согласуется с «меня»: меня зовут Анна."),
      speaking("e3", "Здравствуйте, меня зовут Анна."),
    ],
  },
  {
    id: "l-family",
    topicId: "t-family",
    levelId: "beginner",
    title: "Моя семья",
    description: "Имена родственников и простые описания.",
    pro: false,
    exercises: [
      quiz("e1", "Кто такой брат вашей мамы?", ["дядя", "тётя", "дедушка"], "дядя", "Брат мамы — дядя."),
      grammar("e2", "Выберите форму: У меня … два брата.", ["есть", "есться", "быть"], "есть", "Конструкция «у меня есть» обозначает принадлежность."),
      spelling("e3", "Напишите правильно: сестра, бр…т, м…ма.", "брат, мама", "Проверьте безударные гласные в словах «брат» и «мама»."),
    ],
  },
  {
    id: "l-numbers",
    topicId: "t-numbers",
    levelId: "beginner",
    title: "Сколько времени?",
    description: "Числа, часы и простые вопросы о времени.",
    pro: false,
    exercises: [
      quiz("e1", "Как будет «7:30» по-русски?", ["семь тридцать", "семь и тридцать", "седьмой тридцать"], "семь тридцать", "Время называют количественными числительными."),
      task("e2", "Дополните: Который …?", ["час", "время", "день"], "час", "Стандартный вопрос о времени — «Который час?»."),
      speaking("e3", "Сейчас семь тридцать."),
    ],
  },
  {
    id: "l-daily-pro",
    topicId: "t-daily",
    levelId: "beginner",
    title: "Мой день по минутам",
    description: "Глаголы движения и повседневные действия.",
    pro: true,
    exercises: [
      quiz("e1", "Что делает человек утром?", ["просыпается", "засыпает", "ужинает"], "просыпается", "Утром человек просыпается."),
      speaking("e2", "Каждое утро я пью кофе и иду на работу."),
    ],
  },
  {
    id: "l-travel",
    topicId: "t-travel",
    levelId: "intermediate",
    title: "В дороге",
    description: "Вопросы о маршруте, билетах и остановках.",
    pro: false,
    exercises: [
      quiz("e1", "Как спросить о цене билета?", ["Сколько стоит билет?", "Где билет?", "Кто билет?"], "Сколько стоит билет?", "«Сколько стоит…» — стандартный вопрос о цене."),
      grammar("e2", "Выберите вид: Я обычно … на автобусе, но сегодня … на метро.", ["езжу / еду", "еду / езжу", "езжу / езжу"], "езжу / еду", "«Езжу» — повтор, «еду» — конкретное движение сейчас."),
      listening("e3", "Что сказал диктор? Выберите верный ответ.", ["Поезд прибывает в 10:15", "Поезд прибывает в 10:50", "Поезд отменён"], "Поезд прибывает в 10:15"),
    ],
  },
  {
    id: "l-work",
    topicId: "t-work",
    levelId: "intermediate",
    title: "Работа и задачи",
    description: "Профессии, обязанности и рабочий день.",
    pro: false,
    exercises: [
      quiz("e1", "Кто работает с пациентами?", ["врач", "инженер", "бухгалтер"], "врач", "Врач лечит пациентов."),
      task("e2", "Вставьте предлог: Я работаю … школе.", ["в", "на", "при"], "в", "Учреждения обычно называют с предлогом «в»."),
      spelling("e3", "Выберите правильное написание.", ["коллега", "калега", "коллегаа"], "коллега", "Слово «коллега» пишется с двойной «л»."),
    ],
  },
  {
    id: "l-food",
    topicId: "t-food",
    levelId: "intermediate",
    title: "В кафе",
    description: "Заказ блюд, вежливые просьбы и счёт.",
    pro: false,
    exercises: [
      quiz("e1", "Как попросить счёт?", ["Принесите, пожалуйста, счёт.", "Дайте мне еду.", "Где кухня?"], "Принесите, пожалуйста, счёт.", "Вежливая просьба с «пожалуйста» уместна в кафе."),
      grammar("e2", "Выберите форму: Я … суп прямо сейчас.", ["ем", "съем", "ел"], "ем", "Сейчас — настоящее время, «ем»."),
      speaking("e3", "Здравствуйте, я бы хотел заказать суп."),
    ],
  },
  {
    id: "l-habits-pro",
    topicId: "t-habits",
    levelId: "intermediate",
    title: "Привычки и режим",
    description: "Частотные наречия и описание рутины.",
    pro: true,
    exercises: [
      quiz("e1", "Какое слово означает «каждый день»?", ["ежедневно", "иногда", "никогда"], "ежедневно", "«Ежедневно» — каждый день."),
      speaking("e2", "Я обычно встаю в семь утра и делаю зарядку."),
    ],
  },
  {
    id: "l-idioms-pro",
    topicId: "t-idioms",
    levelId: "advanced",
    title: "Смысл между строк",
    description: "Устойчивые выражения и их происхождение.",
    pro: true,
    exercises: [
      quiz("e1", "Что значит «водить за нос»?", ["обманывать", "вести вперёд", "заниматься спортом"], "обманывать", "Фразеологизм означает вводить в заблуждение."),
      grammar("e2", "Подберите продолжение: «Глаза боятся, а руки…»", ["делают", "дрожат", "молчат"], "делают", "Пословица: «Глаза боятся, а руки делают»."),
    ],
  },
  {
    id: "l-business-pro",
    topicId: "t-business",
    levelId: "advanced",
    title: "Письмо без ошибок",
    description: "Официальный тон и структура письма.",
    pro: true,
    exercises: [
      quiz("e1", "Как начать официальное письмо?", ["Уважаемый Иван!", "Привет, Иван!", "Йо, Иван!"], "Уважаемый Иван!", "Официальный тон требует «Уважаемый…»."),
      spelling("e2", "Выберите правильное написание.", ["с уважением", "с уважэнием", "с увaжением"], "с уважением", "Проверьте безударную гласную в слове «уважение»."),
    ],
  },
  {
    id: "l-aspect-pro",
    topicId: "t-aspect",
    levelId: "advanced",
    title: "Вид глагола",
    description: "Разница между «делать» и «сделать».",
    pro: true,
    exercises: [
      grammar("e1", "Выберите вид: Каждый день я … отчёт, а вчера … его за час.", ["пишу / написал", "написал / пишу", "пишу / пишу"], "пишу / написал", "Несовершенный вид — повтор, совершенный — результат."),
      quiz("e2", "Какой глагол совершенного вида?", ["прочитать", "читать", "перечитывать"], "прочитать", "«Прочитать» обозначает завершённое действие."),
    ],
  },
  {
    id: "l-rhetoric-pro",
    topicId: "t-rhetoric",
    levelId: "expert",
    title: "Речь, которая убеждает",
    description: "Структура выступления и риторические приёмы.",
    pro: true,
    exercises: [
      quiz("e1", "Что такое тезис?", ["основное утверждение", "вопрос аудитории", "список источников"], "основное утверждение", "Тезис — центральное утверждение, которое вы доказываете."),
      speaking("e2", "Сегодня я хочу объяснить, почему этот вопрос важен для каждого из нас."),
    ],
  },
  {
    id: "l-style-pro",
    topicId: "t-style",
    levelId: "expert",
    title: "Норма и стиль",
    description: "Разговорная речь, нейтральная и книжная норма.",
    pro: true,
    exercises: [
      quiz("e1", "Какой вариант соответствует книжной норме?", ["согласно плану", "согласно плана", "согласно о плане"], "согласно плану", "«Согласно» требует дательного падежа."),
      spelling("e2", "Выберите правильное написание.", ["во-первых", "вопервых", "во первых"], "во-первых", "Вводное слово пишется через дефис."),
    ],
  },
  {
    id: "l-debate-pro",
    topicId: "t-debate",
    levelId: "expert",
    title: "Искусство возражения",
    description: "Аргументация, уступки и точные формулировки.",
    pro: true,
    exercises: [
      quiz("e1", "Как вежливо возразить?", ["Я понимаю вашу точку зрения, однако…", "Вы неправы.", "Нет."], "Я понимаю вашу точку зрения, однако…", "Уступка смягчает возражение."),
      grammar("e2", "Выберите форму: Несмотря … возражения, решение принято.", ["на", "в", "при"], "на", "Предлог «несмотря на» требует винительного падежа."),
    ],
  },
];

export const freeLessonIds = lessons.filter((lesson) => !lesson.pro).map((lesson) => lesson.id);

export function getLevel(id: string): Level | undefined {
  return levels.find((level) => level.id === id);
}

export function getTopics(levelId: string): Topic[] {
  return topics.filter((topic) => topic.levelId === levelId);
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

export function getLessonsByTopic(topicId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.topicId === topicId);
}
