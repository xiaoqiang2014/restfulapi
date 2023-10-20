var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/reservations', function(req, res, next) {
  res.json([
    { id: 1, guestName: "John Doe", guestContactInfo: "2019-01-01", guestContactInfo: "2019-01-0", reservedTableSize: 2},
    { id: 2, guestName: "Jeek", guestContactInfo: "2019-01-01", guestContactInfo: "2019-01-0", reservedTableSize: 2},
    { id: 3, guestName: "John Merry", guestContactInfo: "2019-01-01", guestContactInfo: "2019-01-0", reservedTableSize: 2}
  ])
  // res.render('index', { title: 'Express' });
});
router.post('/reservations', function(req, res, next) {
  res.json({ message: 'Post Hello World!' })
});
router.put('/reservations/:id', function(req, res, next) {
  res.json({ message: 'Put Hello World!' })
});
router.delete('/reservations', function(req, res, next) {
  res.json({ message: 'Delete Hello World!' })
});
module.exports = router;
