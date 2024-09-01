const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	const User = sequelize.define(
		"users",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING(255), 
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(100), 
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			coin_balance: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 10,
			},
		},
		{
			timestamps: true,
			createdAt: "created_at", 
			updatedAt: "updated_at", 
		}
	);

	return User;
};
