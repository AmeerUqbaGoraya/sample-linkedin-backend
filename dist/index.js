"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const connectionRoutes_1 = __importDefault(require("./routes/connectionRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const reactionRoutes_1 = __importDefault(require("./routes/reactionRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/api', userRoutes_1.default);
app.use('/api', connectionRoutes_1.default);
app.use('/api', postRoutes_1.default);
app.use('/api', reactionRoutes_1.default);
app.use('/api', commentRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map