// Minimal Vercel serverless function to receive client logs and print them to Vercel Logs
// No external types to avoid adding dependencies.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const bodyRaw = req.body;
    const body = typeof bodyRaw === 'string' ? safeParseJson(bodyRaw) : bodyRaw;

    const level = (body?.level ?? 'info').toString().toLowerCase();
    const message = body?.message ?? 'Client log';
    const meta = body?.meta ?? {};

    const stamp = new Date().toISOString();
    const output = { stamp, level, message, meta };

    // Write a structured line; Vercel will capture console output.
    switch (level) {
      case 'debug':
        console.debug('[client-log]', output);
        break;
      case 'info':
        console.info('[client-log]', output);
        break;
      case 'warn':
        console.warn('[client-log]', output);
        break;
      case 'error':
        console.error('[client-log]', output);
        break;
      default:
        console.log('[client-log]', output);
        break;
    }

    res.status(204).end();
  } catch (err) {
    console.error('[client-log] failed to process log payload', err);
    res.status(400).json({ error: 'Invalid payload' });
  }
}

function safeParseJson(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}
