const oracledb = require('oracledb');

let connection = null;

async function connect() {
    if (connection) {
        return connection;
    }

    connection = await oracledb.getConnection({
        user: "BOOKSFORBOOKS",
        password: "123",
        connectString: "localhost/orclpdb"
    });

    return connection;
}

function getConnection() {
    return connection;
}

async function closeConnection() {
    if (connection) {
        await connection.close();
        connection = null;
    }
}
//let x=null;
async function runQuery(query, params) {
    const connection =this.getConnection();
    console.log("querying");
    try {
        const result = await connection.execute(query, params);
        //console.log(result);
        await connection.commit();
        
        return result.rows;
    }  catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function runProcFunc(query, params) {
    const connection = this.getConnection();

    try {
        const result = await connection.execute(query, params);
        return result;
    } catch (error) {
        console.error('Error executing procedure/function:', error);
        throw error;
    }
}
module.exports = { connect, getConnection, closeConnection ,runProcFunc,runQuery};
