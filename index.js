const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

const database = {
    prices: {
        masara: {damagum: "₦57,000", source: "Kasuwar Damagum", update_day: "Lahadi"},
        wake: {damagum: "₦72,000", source: "Kasuwar Damagum", update_day: "Lahadi"},
        gyada: {damagum: "₦0", source: "Kasuwar Damagum", update_day: "Lahadi"},
        shinkafa: {damagum: "₦0", source: "Kasuwar Damagum", update_day: "Lahadi"},
        "waken suya": {damagum: "₦0", source: "Kasuwar Damagum", update_day: "Lahadi"},
        dawa: {damagum: "₦0", source: "Kasuwar Damagum", update_day: "Lahadi"},
        gero: {damagum: "₦0", source: "Kasuwar Damagum", update_day: "Lahadi"}
    }
};

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const text = msg.message.conversation?.toLowerCase() || '';
        const from = msg.key.remoteJid;
        let reply = '';

        if(text === 'salam') {
            reply = `Assalamu alaikum! Ni Sarkin Gona Bot ne 👨‍🌾\nRubuta:\n1. price masara Damagum - don farashi\n2. cutar wake - don maganin cuta\n3. abe tip masara - don shawara`;
        }
        if(text.includes('price masara damagum')) {
            reply = `Farashin Lahadi a Kasuwar Damagum:\nMasara: ${database.prices.masara.damagum} / bag 100kg\nSabuntawa: Kowane Lahadi`;
        }
        if(reply) await sock.sendMessage(from, { text: reply });
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode!== DisconnectReason.loggedOut;
            if(shouldReconnect) connectToWhatsApp();
        } else if(connection === 'open') {
            console.log('Sarkin Gona Bot ya haɗa da WhatsApp! Duba QR code a Logs');
        }
    });
}

connectToWhatsApp();
