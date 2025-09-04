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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./models/index");
const cookieSecurity_1 = require("./auth/cookieSecurity");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const connectionRoutes_1 = __importDefault(require("./routes/connectionRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const reactionRoutes_1 = __importDefault(require("./routes/reactionRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n🌐 [${timestamp}] ${req.method} ${req.originalUrl}`);
    if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
        console.log('📤 Request from:', req.ip);
    }
    next();
});
app.use('/api', userRoutes_1.default);
app.use('/api', connectionRoutes_1.default);
app.use('/api', postRoutes_1.default);
app.use('/api', reactionRoutes_1.default);
app.use('/api', commentRoutes_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbInitialized = yield (0, index_1.initializeDatabase)();
            if (!dbInitialized) {
                console.error('❌ Failed to initialize database. Exiting...');
                process.exit(1);
            }
            app.listen(port, () => {
                console.log('🚀 LinkedIn API Server Started with Sequelize!');
                console.log(`📍 Server running at http://localhost:${port}`);
                console.log('🔧 Debugging enabled - All API calls will be logged');
                console.log('📱 Ready for Postman testing!\n');
                // Log cookie security status
                (0, cookieSecurity_1.logCookieSecurityStatus)();
            });
        }
        catch (error) {
            console.error('❌ Server startup failed:', error);
            process.exit(1);
        }
    });
}
startServer();
//# sourceMappingURL=index.js.map