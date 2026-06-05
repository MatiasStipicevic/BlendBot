// Vercel Serverless Function — Proxy seguro para Groq API
// La GROQ_API_KEY vive como variable de entorno en Vercel (nunca en el código)

export default async function handler(req, res) {
    // CORS — permite solo desde tu dominio de GitHub Pages
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const data = await groqRes.json();
        return res.status(groqRes.status).json(data);

    } catch (err) {
        return res.status(500).json({ error: 'Proxy error', detail: err.message });
    }
}
