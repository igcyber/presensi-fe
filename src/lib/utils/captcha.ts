// Utility functions untuk captcha matematika sederhana

export interface CaptchaData {
  question: string;
  answer: number;
}

/**
 * Generate captcha matematika sederhana
 * @returns Object berisi pertanyaan dan jawaban
 */
export const generateCaptcha = (): CaptchaData => {
  const operations = ["+", "-", "*"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1: number;
  let num2: number;
  let answer: number;
  let question: string;

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 10) + 1; // 1-10
      num2 = Math.floor(Math.random() * 10) + 1; // 1-10
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;

    case "-":
      num1 = Math.floor(Math.random() * 10) + 5; // 5-14 (agar hasil tidak negatif)
      num2 = Math.floor(Math.random() * 5) + 1; // 1-5
      answer = num1 - num2;
      question = `${num1} - ${num2}`;
      break;

    case "*":
      num1 = Math.floor(Math.random() * 5) + 1; // 1-5
      num2 = Math.floor(Math.random() * 5) + 1; // 1-5
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;

    default:
      num1 = 1;
      num2 = 1;
      answer = 2;
      question = "1 + 1";
  }

  // Simpan jawaban di localStorage untuk validasi
  localStorage.setItem("captcha_answer", answer.toString());

  return {
    question,
    answer,
  };
};

/**
 * Validasi captcha input
 * @param userInput - Input dari user
 * @returns Boolean apakah captcha benar
 */
export const validateCaptcha = (userInput: string): boolean => {
  const storedAnswer = localStorage.getItem("captcha_answer");
  return storedAnswer && userInput === storedAnswer;
};

/**
 * Clear captcha dari localStorage
 */
export const clearCaptcha = (): void => {
  localStorage.removeItem("captcha_answer");
};
