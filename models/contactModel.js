const db = require("../db/mysql");

const findContactsByEmailOrPhone = async (email, phone) => {
	let query = `SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?`;
	const [rows] = await db.query(query, [email, phone]);
	return rows;
};

const createContact = async (
	email,
	phone,
	linkedId = null,
	linkPrecedence = "primary"
) => {
	const [result] = await db.query(
		`INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())`,
		[email, phone, linkedId, linkPrecedence]
	);
	const [rows] = await db.query(`SELECT * FROM Contact WHERE id = ?`, [
		result.insertId,
	]);
	return rows[0];
};

const updateContact = async (id, data) => {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const setClause = keys.map((key) => `${key} = ?`).join(", ");
	await db.query(
		`UPDATE Contact SET ${setClause}, updatedAt = NOW() WHERE id = ?`,
		[...values, id]
	);
};

const findAllRelatedContacts = async (primaryId) => {
	const [rows] = await db.query(
		`SELECT * FROM Contact WHERE id = ? OR linkedId = ?`,
		[primaryId, primaryId]
	);
	return rows;
};

module.exports = {
	findContactsByEmailOrPhone,
	createContact,
	updateContact,
	findAllRelatedContacts,
};
