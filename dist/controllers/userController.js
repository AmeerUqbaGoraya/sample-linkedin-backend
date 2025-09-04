"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = addUser;
const db_1 = __importDefault(require("../models/db"));
function addUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { UserName, Email, PasswordHash } = req.body;
        if (!UserName || !Email || !PasswordHash) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        try {
            const [result] = yield db_1.default.execute('INSERT INTO Users (UserName, Email, PasswordHash) VALUES (?, ?, ?)', [UserName, Email, PasswordHash]);
            res.status(201).json({ message: 'User created' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=userController.js.map