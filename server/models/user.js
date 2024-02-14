import pool from "../config/config.js";

// get connection to db helper function
const executeQuery = async (query, params = []) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(query, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// * find user by email
const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const result = await executeQuery(query, [email]);
  return result.length > 0 ? result[0] : null;
};

// * find user by id
const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE user_id = ?";
  const result = await executeQuery(query, [id]);
  return result.length > 0 ? result[0] : null;
};

//  * create a new user
const createUserWithEmail = async (data) => {
  const query =
    "INSERT INTO users (email, password, role, first_name, last_name) VALUES (?,?,?,?,?)";
  const result = await executeQuery(query, [
    data.email,
    data.hashedPass,
    data.role,
    data.first_name,
    data.last_name,
  ]);
  return result;
};

// exports
export default {
  findUserByEmail,
  createUserWithEmail,
  findUserById,
};
