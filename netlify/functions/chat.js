// netlify/functions/chat.js
// Configurado con Gemini 1.5 Flash (Rápido y Seguro) ⚡🛡️

exports.handler = async function(event, context) {
  // Solo aceptamos mensajes nuevos (POST)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Recibimos el mensaje del usuario
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // 2. Buscamos la llave secreta
    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Configuración del modelo SEGURO (Gemini 1.5 Flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 4. Llamamos a Google
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    // Si Google da error, avisamos pero no rompemos el servidor
    if (!response.ok) {
      console.error("Error de Google:", data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // 5. Sacamos la respuesta limpia
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiResponse })
    };

  } catch (error) {
    console.error("Error interno:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error en el servidor de IRO AI" })
    };
  }
};