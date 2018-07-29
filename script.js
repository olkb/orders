require('dotenv').config()

var request = require('sync-request');
var fs = require('fs');
var Handlebars = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');

HandlebarsIntl.registerWith(Handlebars);

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper("combinedOrders", function(order, pretext, options) {
	if (order.customerNotes) {
		var res = order.customerNotes.match(/[0-9]{9}/g);
		if (res) {
			var orders = res.filter(function(item, pos) {
			    return (res.indexOf(item) == pos) && (item != order.orderNumber);
			})
			return pretext + orders.join(", ");
		}
	}
	return "";
});

const file_template_source = fs.readFileSync('README_template.md', 'utf8');
const file_template = Handlebars.compile(file_template_source);

var orders = [];

for (var page = 1, num_pages = 1; page <= num_pages; page++) {
	var res_page = request('GET',
	  'https://ssapi.shipstation.com/orders?orderStatus=awaiting_shipment&sortBy=orderDate&pageSize=500&page=' + page, {
	  headers: {
	    'Authorization': process.env.AUTH_KEY
	  }}
	);
	var body = JSON.parse(res_page.getBody());
	num_pages = body.pages;
	orders = orders.concat(body.orders);
}

fs.writeFile('README.md', file_template({
	"orders": orders,
	"date": new Date()
}));