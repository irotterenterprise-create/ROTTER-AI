// netlify/functions/chat.js
// Versión Corregida (CommonJS) para evitar el error de "ES Module"

exports.handler = async function(event, context) {
  // Solo permitimos mensajes POST (mensajes nuevos)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Leemos el mensaje
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // 2. Usamos la llave secreta
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    // 3. Hablamos con Google (usando fetch que ya viene incluido)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    // 4. Verificamos errores de Google
    if (!response.ok) {
      console.error("Error de Google:", data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // 5. Sacamos la respuesta limpia
    // (Usamos ?. para evitar errores si la respuesta viene vacía)
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiResponse })
    };

  } catch (error) {
    console.error("Error grave:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor IRO AI." })
    };
  }
};