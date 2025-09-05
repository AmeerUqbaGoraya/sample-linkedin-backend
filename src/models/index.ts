import sequelize from './database';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Connection from './Connection';
import Reaction from './Reaction';
import PostReaction from './PostReaction';
import PostMedia from './PostMedia';


const models = {
    User,
    Post,
    Comment,
    Connection,
    Reaction,
    PostReaction,
    PostMedia,
};

export const initializeDatabase = async () => {
    try {
        console.log('🔗 [DB] Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ [DB] Database connection established successfully');
        
        console.log('🔧 [DB] Synchronizing database models...');
        await sequelize.sync({ alter: false });
        console.log('✅ [DB] Database models synchronized successfully');
        
        await initializeReactions();
        
        return true;
    } catch (error) {
        console.error('❌ [DB] Unable to connect to the database:', error);
        return false;
    }
};

const initializeReactions = async () => {
    const reactions = [
        { ReactionID: 1, ReactionType: 'Like' as const },
        { ReactionID: 2, ReactionType: 'Celebrate' as const },
        { ReactionID: 3, ReactionType: 'Support' as const },
        { ReactionID: 4, ReactionType: 'Love' as const },
        { ReactionID: 5, ReactionType: 'Insightful' as const },
        { ReactionID: 6, ReactionType: 'Curious' as const },
    ];

    for (const reaction of reactions) {
        await Reaction.findOrCreate({
            where: { ReactionID: reaction.ReactionID },
            defaults: reaction,
        });
    }
    console.log('✅ [DB] Default reactions initialized');
};

export { sequelize };
export default models;
