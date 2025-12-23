// ... (después de scrollToBottom) ...

    try {
        // LLAMADA REAL A IRO AI 🧠
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: t })
        });

        const data = await response.json();

        // Ocultar cargando
        l.classList.add('hidden');
        l.classList.remove('flex');

        if (data.reply) {
            addMessage('ai', data.reply);
        } else {
            addMessage('ai', "Lo siento, tuve un error al pensar.");
        }

    } catch (error) {
        console.error(error);
        l.classList.add('hidden');
        l.classList.remove('flex');
        addMessage('ai', "Error de conexión. Verifica tu internet.");
    }