"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = error;

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}