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
    connection.query("SELECT * FROM CATEGORY", (err, records, fields) => {
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

router.get("/ShowDonation/:id", (req, res) => {
    const query = "SELECT * FROM DONATION WHERE FUNDRAISER_ID = ?";
    connection.query(query, req.params.id, (err, records) => {
        if (err) {
            console.error("Error Getting fundraiser info!", err);
            res.status(500).send({ error: "Error Getting fundraiser info!" });
        } else {
            res.send(records);
        }
    });
});

router.post("/addDonation", (req, res) => {

    var DONATION_ID = req.body.DONATION_ID;
    var FUNDRAISER_ID = req.body.FUNDRAISER_ID;
    var DATE = req.body.DATE;
    var AMOUNT = req.body.AMOUNT;
    var GIVER = req.body.GIVER;

    const sql = `INSERT INTO DONATION (DONATION_ID, FUNDRAISER_ID, DATE, AMOUNT, GIVER) VALUES (${DONATION_ID}, ${FUNDRAISER_ID}, '${DATE}', ${AMOUNT}, '${GIVER}')`;

    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error while retrieve the data" + err);
        } else {
            res.send({ insert: "success" });
        }
    });
});


router.post("/addFundraiser", (req, res) => {
    var FUNDRAISER_ID = req.body.FUNDRAISER_ID;
    var ORGANIZER = req.body.ORGANIZER;
    var CAPTION = req.body.CAPTION;
    var TARGET_FUNDING = req.body.TARGET_FUNDING;
    var CURRENT_FUNDING = req.body.CURRENT_FUNDING;
    var CITY = req.body.CITY;
    var ACTIVE = req.body.ACTIVE;
    var CATEGORY_ID = req.body.CATEGORY_ID;

    const sql = `INSERT INTO FUNDRAISER (FUNDRAISER_ID, ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES (${FUNDRAISER_ID}, ${ORGANIZER}, '${CAPTION}', ${TARGET_FUNDING}, '${CURRENT_FUNDING}', '${CITY}', '${ACTIVE}', '${CATEGORY_ID}')`;

    connection.query(sql, (err, result) => {
        if (err) {
            console.error("Error while retrieving the data: " + err);
            res.send({ insert: "error", message: err.message });
        } else {
            res.send({ insert: "success" });
        }
    });
});

router.put("/updateFundraise/:id", (req, res) => {
    var FUNDRAISER_ID = req.params.id;
    var ORGANIZER = req.body.ORGANIZER;
    var CAPTION = req.body.CAPTION;
    var TARGET_FUNDING = req.body.TARGET_FUNDING;
    var CURRENT_FUNDING = req.body.CURRENT_FUNDING;
    var CITY = req.body.CITY;
    var ACTIVE = req.body.ACTIVE;

    connection.query(
        "UPDATE FUNDRAISER SET ORGANIZER=?, CAPTION=?, TARGET_FUNDING=?, CURRENT_FUNDING=?, CITY=?, ACTIVE=? WHERE FUNDRAISER_ID=?",
        [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, FUNDRAISER_ID],
        (err, result) => {
            if (err) {
                console.error("Error while updating the data: " + err);
            } else {
                res.send({ update: "success" });
            }
        });
});

router.get("/showFundraiser", (req, res) => {
    const query = `
        SELECT F.FUNDRAISER_ID,F.ORGANIZER,F.CAPTION,F.TARGET_FUNDING,F.CURRENT_FUNDING,F.CITY,F.ACTIVE,
        C.NAME AS CATEGORY_NAME
        FROM FUNDRAISER F
        LEFT JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
    `;
    connection.query(query, (err, records, fields) => {
        if (err) {
            console.error("Error getting category!", err);
        } else {
            res.send(records);
        }
    });
});

router.delete("/delete/:id", (req, res) => {
    connection.query("delete from FUNDRAISER where FUNDRAISER_ID=" + req.params.id, (err, records, fields) => {
        if (err) {
            console.error("Error while deleting the data");
        } else {
            res.send({ delete: "Delete Sucess" });
        }
    })
})

module.exports = router;