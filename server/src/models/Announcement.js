module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('news', 'promotion', 'alert'),
      defaultValue: 'news'
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    expireDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  })
  return Announcement
}