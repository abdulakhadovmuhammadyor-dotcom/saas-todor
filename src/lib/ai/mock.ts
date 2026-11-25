import type {
  ChatResult,
  FeedbackResult,
  ListeningResult,
  PronunciationResult,
  QuizResult,
} from "@/lib/ai/schemas";

export function mockChat(level: string, message: string): ChatResult {
  return {
    reply: `Отличный вопрос! На уровне ${level} я бы ответил так: начните с короткого предложения и проверьте согласование слов. Попробуйте переформулировать: «${message.slice(0, 80)}».`,
    followUp: "Хотите, я разберу ваш вариант по словам?",
  };
}

export function mockQuiz(topic: string, kind: string): QuizResult {
  return {
    prompt: `Выберите правильный вариант по теме «${topic}» (${kind}).`,
    options: ["Первый вариант", "Второй вариант", "Третий вариант"],
    answer: "Второй вариант",
    explanation: "Правильный вариант согласован с правилом темы. Демо-режим: подключите GEMINI_API_KEY для настоящих упражнений.",
    hint: "Обратите внимание на согласование.",
  };
}

export function mockFeedback(answer: string): FeedbackResult {
  const empty = answer.trim().length === 0;
  return {
    score: empty ? 0 : 82,
    correct: !empty,
    errors: empty
      ? [{ original: "(пусто)", correction: "Напишите ответ", explanation: "Ответ не может быть пустым." }]
      : [],
    tips: ["Демо-режим: подключите GEMINI_API_KEY для подробного разбора ошибок."],
  };
}

export function mockPronunciation(targetPhrase: string): PronunciationResult {
  const words = targetPhrase.split(/\s+/).filter(Boolean);
  return {
    transcript: targetPhrase,
    score: 78,
    words: words.map((word) => ({ word, score: 78, note: "Демо-оценка. Подключите GEMINI_API_KEY для реального разбора." })),
    tips: ["Говорите медленнее и выделяйте ударные гласные."],
  };
}

export function mockListening(topic: string): ListeningResult {
  return {
    script: `Это короткий диалог по теме «${topic}». Он поможет потренировать восприятие русской речи.`,
    question: "О чём этот диалог?",
    options: ["О практике языка", "О погоде", "О транспорте"],
    answer: "О практике языка",
    translation: "Учебный текст для демонстрации режима прослушивания.",
  };
}
