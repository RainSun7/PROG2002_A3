// Import the database connection module
var dbcon = require("../crowdfunding_db");
var connection = dbcon.getconnection(); // Get the database connection
	connection.connect(); // Connect to the database
// Import the express module and create a router
var express = require('express');
var router = express.Router();

// Route to get all active fundraisers
router.get("/AllFundraiser", (req, res) => {
	connection.query(`
		SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME as CATEGORY_NAME 
		FROM FUNDRAISER f
		JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
		WHERE f.ACTIVE = 1
	`, (err, records, fields) => {
		if (err) {
			console.error("Error getting fundraiser!");
		} else {
			res.send(records);
		}
	});
});

// Route to get all categories
router.get("/AllCategory", (req, res) => {
    connection.query("SELECT * FROM CATEGORY", (err, records,fields) => {
        if (err) {
            console.error("Error getting category!", err);
        } else {
            res.send(records);
        }
    });
});

// Route to search for fundraisers based on various conditions
router.get("/SearchCondition", (req, res) => {
    const { ORGANIZER, CITY, CATEGORY_ID, ACTIVE } = req.query;
    const params = [];
    let query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME as CATEGORY_NAME 
		FROM FUNDRAISER f
		JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE 1=1
    `;
    if (ORGANIZER) {
        query += " AND f.ORGANIZER = ?";  
        params.push(ORGANIZER); 
    }
    if (CITY) {
        query += " AND f.CITY = ?";  
        params.push(CITY); 
    }
    if (CATEGORY_ID) {
        query += " AND f.CATEGORY_ID = ?"; 
        params.push(CATEGORY_ID);
    }
    if (ACTIVE) {
        query += " AND f.ACTIVE = ?";
        params.push(ACTIVE === '1' ? '1' : '0');
    }
    connection.query(query, params, (err, records) => {
        if (err) {
            console.error("Error getting fundraiser info!", err);
        }
        res.send(records);
    });
});

// Route to get a specific fundraiser by ID
router.get("/SearchFundraiser/:id", (req, res) => {
    const query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME as CATEGORY_NAME 
		FROM FUNDRAISER f
		JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.FUNDRAISER_ID = 
    `;
    connection.query(query + req.params.id, (err, records, fields) => {
        if (err) {
            console.error("Error Getting fundraiser info!", err);
        } else {
            res.send(records);
        }
    });
});


module.exports = router;