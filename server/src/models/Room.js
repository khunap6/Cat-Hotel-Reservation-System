module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    'Room',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      pricePerNight: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      capacityCats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      description: { type: DataTypes.TEXT, allowNull: true },
      imageUrl: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM('available', 'full', 'maintenance'),
        allowNull: false,
        defaultValue: 'available',
      },
    },
    { tableName: 'rooms', timestamps: true }
  )
  return Room
}
