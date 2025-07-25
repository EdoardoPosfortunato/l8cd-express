import ClientTransporter from "../config/clientMailer.js";
import AdminTransporter from "../config/adminMailer.js";

const subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    await ClientTransporter.sendMail({
      from: '"La tua Newsletter" <newsletter@l8cd.it>',
      to: email,
      subject: "Conferma iscrizione Newsletter",
      text: "Grazie per l'iscrizione. Ecco il tuo codice coupon: SUMMER15   ",
      html: "<p>Grazie per esserti iscritto alla nostra newsletter! Divertiti questa estate con il tuo codice sconto: SUMMER15</p>",
    });

    console.log(req.body);

    res.status(200).json({ message: "Email inviata con successo (test)" });
  } catch (error) {
    console.error("Errore invio mail:", error);
    res.status(500).json({ message: "Errore durante l'invio dell'email" });
  }
};

const checkout = async (req, res) => {
  const { email, cartItems, name, total } = req.body;

  const itemList = cartItems.map((item) => `<li>${item.name} x${item.quantity}</li>`).join("");

  try {
    await ClientTransporter.sendMail({
      from: "<sales@l8cd.it>",
      to: email,
      subject: "Ordine Andato a buon fine",
      html: `
      <p>Ciao ${name}! Grazie per aver effettuato l'ordine da noi. Ecco un riepilogo:</p>
      <ul>${itemList}</ul>
      <p>A presto!</p>
      <p>Totale: ${total}€</p>
        `,
    });

    await AdminTransporter.sendMail({
      from: '"Ordini L8CD" <no-reply@l8cd.it>',
      to: process.env.ADMIN_MAIL,
      subject: "Nuovo ordine",
      html: `
        <p>Hai rcevuto un nuovo ordine</p>
        <ul>${itemList}</ul>
        <p>Spediscilo presto</p>
        <p>Totale: ${total}€</p>
      `,
    });

    res.status(200).json({ message: "Email inviate con successo" });
  } catch (error) {
    console.error("Errore invio ordine:", error);
    res.status(500).json({ message: "Problema nell'invio della conferma ordine" });
  }
};

export default { subscribe, checkout };
