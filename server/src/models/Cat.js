module.exports = (sequelize, DataTypes) => {
  const Cat = sequelize.define(
    'Cat',
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      breed: { type: DataTypes.STRING, allowNull: true },
      gender: { type: DataTypes.ENUM('male', 'female'), allowNull: true },
      age: { type: DataTypes.INTEGER, allowNull: true },
      weight: { type: DataTypes.FLOAT, allowNull: true },
      note: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: 'cats', timestamps: true }
  )
  return Cat
}