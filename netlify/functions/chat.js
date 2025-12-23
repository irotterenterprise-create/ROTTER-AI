// netlify/functions/chat.js
// Actualizado a Gemini 3.0 Flash (El más nuevo y potente) 🚀

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;
    const apiKey = process.env.GEMINI_API_KEY;

    // --- CAMBIO AQUÍ ---
    // Usamos el modelo 'gemini-3.0-flash'
    // (Si por alguna razón te da error, prueba con 'gemini-3.0-flash-preview')
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${apiKey}`;
    // -------------------

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error API Google:", data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiResponse })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" })
    };
  }
};