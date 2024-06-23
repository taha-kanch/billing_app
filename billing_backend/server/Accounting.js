const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const managers = require('datalayer/managers');
const authenticateToken = require('./middleware/auth');

app.use(express.static('public'));

const urlEncodedBodyParser = bodyParser.urlencoded({ extended: false });
app.use(urlEncodedBodyParser);
app.use(bodyParser.json());

app.get("/", function(request, response) {
response.redirect('/index.html');
});

app.post('/login', async (req, res) => {

const user = req.body;
new managers
.UserManager()
.validateUser(user)
.then(data => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addUser', async (req, res) => {

const user = req.body;
new managers
.UserManager().
add(user)
.then(data  => {
res.send({ "success": true, "data": user });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getUnitOfMeasurements', authenticateToken, async (req, res) => {

new managers
.UnitOfMeasurementManager()
.getAll()
.then(data => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addUnitOfMeasurement', authenticateToken, async (req, res) => {

const uom = req.body;
new managers
.UnitOfMeasurementManager().
add(uom)
.then(data  => {
res.send({ "success": true, "data": uom });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addCustomer', authenticateToken, async (req, res) => {

const customer = req.body;
new managers
.CustomerManager()
.add(customer)
.then(data => {
res.send({ success: true,  data: customer });
})
.catch(err => {
res.send({ success: false, error: err });
});

});

app.post('/updateCustomer', authenticateToken, async (req, res) => {

const customer = req.body;
new managers
.CustomerManager()
.update(customer)
.then(data => {
res.send({ success: true,  data: customer });
})
.catch(err => {
res.send({ success: false, error: err });
});

});

app.get('/getCustomers', authenticateToken, async (req, res) => {

const filters = req.query;

new managers
.CustomerManager()
.getAll(filters)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getCustomerByCode', authenticateToken, async (req, res) => {

const code = req.query.code;
new managers
.CustomerManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/removeCustomer', authenticateToken, async (req, res) => {

const code = req.query.code;

new managers
.CustomerManager().
remove(code)
.then(data  => {
res.send({ "success": true});
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.post('/addInvoice', authenticateToken, async (req, res) => {

const invoice = req.body;
new managers
.InvoiceManager().
add(invoice)
.then(data  => {
res.send({ "success": true, "data": invoice });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getInvoices', authenticateToken, async (req, res) => {

const filters = req.query;

new managers
.InvoiceManager()
.getAll(filters)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/removeInvoice', authenticateToken, async (req, res) => {

const code = req.query.code;

new managers
.InvoiceManager().
remove(code)
.then(data  => {
res.send({ "success": true});
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.get('/getInvoiceByCode', authenticateToken, async (req, res) => {

const code = req.query.code;
new managers
.InvoiceManager()
.getByCode(code)
.then(data  => {
res.send({ success: true, "data": data });
})
.catch(err => {
res.send({ success: false, "error": err });
});

});

app.listen(port, function(error) {
if(error) {
return console.log(`Some problem: ${error}`);
}
console.log(`Server is ready to accept request on port ${port}`);
});