"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterMiddleware = void 0;

var filterMiddleware = function filterMiddleware(data) {
  return function (req, res, next) {
    var queryKeys = Object.keys(req.query);
    var filteredData = data;
    queryKeys.forEach(function (key) {
      filteredData = filteredData.filter(function (item) {
        return item[key] === parseInt(req.query[key]) || item[key] === req.query[key];
      });
    });
    res.json(filteredData);
  };
};

exports.filterMiddleware = filterMiddleware;