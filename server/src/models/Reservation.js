module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      catId: { type: DataTypes.INTEGER, allowNull: false },
      roomId: { type: DataTypes.INTEGER, allowNull: false },

      checkIn: { type: DataTypes.DATEONLY, allowNull: false },
      checkOut: { type: DataTypes.DATEONLY, allowNull: false },

      status: {
        // ตามที่คุณต้องการ
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'checked_in', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },

      customerNote: { type: DataTypes.TEXT, allowNull: true },
      adminNote: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: 'reservations', timestamps: true }
  )

  return Reservation
}