"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonsModule = exports.CheckinModule = exports.VelixClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "VelixClient", { enumerable: true, get: function () { return client_1.VelixClient; } });
var checkin_1 = require("./modules/checkin");
Object.defineProperty(exports, "CheckinModule", { enumerable: true, get: function () { return checkin_1.CheckinModule; } });
var persons_1 = require("./modules/persons");
Object.defineProperty(exports, "PersonsModule", { enumerable: true, get: function () { return persons_1.PersonsModule; } });
