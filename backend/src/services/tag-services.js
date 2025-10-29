const { pool } = require("./database");

class TagService {
    // 🔍 Check if a tag exists (returns tag_id if found, otherwise null)
    async isTag(name) {
        const [rows] = await pool.execute(
            `SELECT tag_id FROM Tag WHERE name = ?`,
            [name]
        );
        return rows.length > 0 ? rows[0].tag_id : null;
    }

    // ➕ Create a tag if it doesn't exist
    async createTag(name) {
        console.log(`Creating tag "${name}"...`);

        const existingId = await this.isTag(name);
        if (existingId) {
            console.log(`Tag "${name}" already exists with ID ${existingId}`);
            return existingId;
        }

        const [result] = await pool.execute(
            `INSERT INTO Tag (name) VALUES (?)`,
            [name]
        );

        console.log(`Created new tag "${name}" with ID ${result.insertId}`);
        return result.insertId;
    }

    // 📋 Get all tags
    async getAllTags() {
        const [rows] = await pool.execute(`SELECT * FROM Tag ORDER BY tag_id ASC`);
        return rows;
    }

    // 🔎 Get a single tag by ID
    async getTagById(tagId) {
        const [rows] = await pool.execute(`SELECT * FROM Tag WHERE tag_id = ?`, [tagId]);
        return rows.length > 0 ? rows[0] : null;
    }

    // ✏️ Update a tag's name
    async updateTag(tagId, newName) {
        const [result] = await pool.execute(
            `UPDATE Tag SET name = ? WHERE tag_id = ?`,
            [newName, tagId]
        );

        return result.affectedRows > 0;
    }

    // 🗑️ Delete a tag
    async deleteTag(tagId) {
        const [result] = await pool.execute(`DELETE FROM Tag WHERE tag_id = ?`, [tagId]);
        return result.affectedRows > 0;
    }
}

module.exports = new TagService();

