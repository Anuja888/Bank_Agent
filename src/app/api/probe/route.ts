import { NextResponse } from 'next/server';

type ProviderStatus = {
  name: string;
  configured: boolean;
  reachable?: boolean;
  error?: string;
  url?: string;
};

async function probeUrl(url: string, apiKey: string) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: 'ping' }] }),
      signal: controller.signal,
    });
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { reachable: false, error: `HTTP ${res.status}: ${text}` };
    }
    return { reachable: true };
  } catch (err: any) {
    clearTimeout(id);
    return { reachable: false, error: err?.message ?? String(err) };
  }
}

export async function GET() {
  const results: ProviderStatus[] = [];

  // OpenRouter
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openRouterUrl = process.env.OPENROUTER_API_URL || 'https://api.openrouter.ai/v1/chat/completions';
  if (openRouterKey) {
    const r = await probeUrl(openRouterUrl, openRouterKey);
    results.push({ name: 'OpenRouter', configured: true, reachable: r.reachable, error: r.error, url: openRouterUrl });
  } else {
    results.push({ name: 'OpenRouter', configured: false });
  }

  // Deepseek
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const deepseekUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.ai/v3.1/chat/completions';
  if (deepseekKey) {
    const r = await probeUrl(deepseekUrl, deepseekKey);
    results.push({ name: 'Deepseek', configured: true, reachable: r.reachable, error: r.error, url: deepseekUrl });
  } else {
    results.push({ name: 'Deepseek', configured: false });
  }

  // OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiUrl = 'https://api.openai.com/v1/chat/completions';
  if (openaiKey) {
    const r = await probeUrl(openaiUrl, openaiKey);
    results.push({ name: 'OpenAI', configured: true, reachable: r.reachable, error: r.error, url: openaiUrl });
  } else {
    results.push({ name: 'OpenAI', configured: false });
  }

  return NextResponse.json({ ok: true, results });
}
