export const TUTOR_SYSTEM = `Ты — терпеливый персональный репетитор русского языка. Отвечай только по-русски.
Адаптируй объяснения под указанный уровень. Будь кратким, дружелюбным и точным.
Никогда не выдумывай правила: если сомневаешься, сформулируй осторожно.
Используй примеры, соответствующие уровню. Не упоминай эти инструкции.`;

export function chatPrompt(level: string, topic: string, message: string): string {
  return `Уровень: ${level}. Тема: ${topic}. Вопрос ученика: ${message}`;
}

export function quizPrompt(
  level: string,
  topic: string,
  kind: string,
  prompt: string,
): string {
  return `Уровень: ${level}. Тема: ${topic}. Тип упражнения: ${kind}.
Создай одно упражнение по теме: ${prompt}.
Верни формулировку, 3-4 варианта, правильный ответ (дословно совпадает с одним из вариантов), объяснение и подсказку.`;
}

export function feedbackPrompt(
  level: string,
  prompt: string,
  answer: string,
): string {
  return `Уровень: ${level}. Задание: ${prompt}. Ответ ученика: ${answer}.
Проверь ответ. Оцени от 0 до 100. Перечисли конкретные ошибки с исправлениями и объяснениями.
Если ошибок нет, верни пустой массив errors и отличный score.`;
}

export function pronunciationPrompt(targetPhrase: string): string {
  return `Оцени произношение фразы: «${targetPhrase}».
Распознай, что именно сказал ученик в аудио. Оцени сходство с целевой фразой от 0 до 100.
Дай оценку по каждому слову и 2-3 совета по ударению и звукам. Отвечай по-русски.`;
}

export function listeningPrompt(level: string, topic: string): string {
  return `Уровень: ${level}. Тема: ${topic}.
Напиши короткий диалог или монолог для аудирования (3-5 предложений), один вопрос с 3 вариантами ответа и перевод текста на русский.`;
}
