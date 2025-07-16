const {
  findContactsByEmailOrPhone,
  createContact,
  updateContact,
  findAllRelatedContacts,
} = require("../models/contactModel");

const identify = async (req, res) => {
  const { email = null, phoneNumber = null } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "email or phoneNumber required" });
  }

  let existingContacts = await findContactsByEmailOrPhone(email, phoneNumber);

  if (existingContacts.length === 0) {
    const newContact = await createContact(email, phoneNumber);
    return res.status(200).json({
      contact: {
        primaryContatctId: newContact.id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      },
    });
  }

  let primary = existingContacts.find(c => c.linkPrecedence === 'primary') || existingContacts[0];
  for (const contact of existingContacts) {
    if (contact.createdAt < primary.createdAt) {
      primary = contact;
    }
  }

  for (const contact of existingContacts) {
    if (contact.id !== primary.id && contact.linkPrecedence === 'primary') {
      await updateContact(contact.id, { linkedId: primary.id, linkPrecedence: "secondary" });
    }
  }

  const isDuplicate = existingContacts.some(c => c.email === email && c.phoneNumber === phoneNumber);
  if (!isDuplicate) {
    await createContact(email, phoneNumber, primary.id, "secondary");
  }

  const allContacts = await findAllRelatedContacts(primary.id);
  const primaryContact = allContacts.find(c => c.id === primary.id);

  const emails = [primaryContact.email, ...new Set(allContacts.filter(c => c.id !== primary.id).map(c => c.email).filter(Boolean))];
  const phoneNumbers = [primaryContact.phoneNumber, ...new Set(allContacts.filter(c => c.id !== primary.id).map(c => c.phoneNumber).filter(Boolean))];
  const secondaryContactIds = allContacts.filter(c => c.linkPrecedence === "secondary").map(c => c.id);

  return res.status(200).json({
    contact: {
      primaryContatctId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  });
};

module.exports = { identify };