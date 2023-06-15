import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('colab', 'root', '', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    freezeTableName: true
  },
  logging: false
});

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  friends: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
  },
  photo: {
    type: DataTypes.STRING,
  },
});

const Message = sequelize.define('messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
  },
});

const Artwork = sequelize.define('artwork', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
});

const VisualArt = sequelize.define('visualart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
  },
});

const Music = sequelize.define('music', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
  },
});

const Story = sequelize.define('stories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  }
});

const Sculpture = sequelize.define('sculptures', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
});

const Collaboration = sequelize.define('collaborations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  artworkType: {
    type: DataTypes.STRING,
    field: 'artwork_type',
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_private',
  },
});

const UserCollaboration = sequelize.define('usercollaborations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
});

VisualArt.belongsTo(Artwork, { foreignKey: 'artworkId' });
Music.belongsTo(Artwork, { foreignKey: 'artworkId' });
Story.belongsTo(Artwork, { foreignKey: 'artworkId' });
Story.belongsTo(User, { foreignKey: 'originalCreatorId' });
Sculpture.belongsTo(Artwork, { foreignKey: 'artworkId' });
UserCollaboration.belongsTo(Collaboration, { foreignKey: 'collaborationId' });
UserCollaboration.belongsTo(User, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'recipientId' });

const initialize = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tables successfully created!');
  } catch (error) {
    console.error('Error creating tables :(', error);
  } finally {
    sequelize.close();
  }
};

export {
  sequelize,
  initialize,
  User,
  Message,
  Artwork,
  VisualArt,
  Music,
  Story,
  Sculpture,
  Collaboration,
  UserCollaboration,
};
