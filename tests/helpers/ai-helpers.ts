import { Page } from '@playwright/test';
import { ai } from '@zerostep/playwright';

type AiArgs = { page: Page; test: any };

// Retry wrapper — retries flaky ai() steps up to 2 times
export async function aiWithRetry(
  prompt: string,
  aiArgs: AiArgs,
  retries = 2
): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await ai(prompt, aiArgs);
    } catch (err) {
      if (i === retries) throw err;
      console.log(`ai() retry ${i + 1} for: "${prompt}"`);
      await aiArgs.page.waitForTimeout(500);
    }
  }
}

// Fill an entire form with one descriptive prompt
export async function fillForm(
  formDescription: string,
  aiArgs: AiArgs
): Promise<any> {
  return ai(`Fill out ${formDescription} with realistic test values`, aiArgs);
}

// Verify something is visible on the page
export async function aiVerify(
  prompt: string,
  aiArgs: AiArgs
): Promise<any> {
  return ai(`Verify that ${prompt}`, aiArgs);
}

// Get text content from an element
export async function aiGetText(
  prompt: string,
  aiArgs: AiArgs
): Promise<string> {
  return ai(`Get the text of ${prompt}`, aiArgs);
}