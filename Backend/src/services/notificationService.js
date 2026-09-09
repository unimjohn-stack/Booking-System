import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${ process.env.WHATSAPP_PHONE_NUMBER_URL}/messages`;

export const sendWhatsAppMessage = async (phone, message) => {
    try {
        const response = await axios.post(WHATSAPP_API_URL, { messaging_product: "whatsapp", to: phone, type: "text", text: { body: message }}, { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" }});
    } catch (error) {
        console.error("Error sending whatsapp message:",error.response?.data || error.message);
        throw new Error("Failed to send WhatsApp message");
    }
}