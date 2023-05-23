import { Document, Model, model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Config
import { environment } from '@config';

// Models
import { AddressSchema } from '@models';

// TS
import { IUser } from '@ts';

interface IUserDocument extends IUser, Document {}
interface IUserModel extends Model<IUserDocument> {}
interface IUserMethods extends IUserDocument {
	comparePassword(password: string): Promise<boolean>;
	changeActive(): Promise<IUser>;
}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		avatar: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		billingAddress: {
			type: AddressSchema.obj,
			required: false,
		},
		deliveryAddress: {
			type: AddressSchema.obj,
			required: false,
		},
		active: {
			type: Boolean,
			required: false,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre('save', function (next) {
	const user = this;

	if (!this.isModified('password') || !this.isNew) return next();

	bcrypt.genSalt(environment.BCRYPT_SALT, function (error, salt) {
		if (error) return next(error);

		bcrypt.hash(user.password, salt, function (hashError, hash) {
			if (hashError) return next(hashError);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compare(password, this.password);
};
UserSchema.methods.changeActive = function () {
	this.active = !this.active;

	return this.save();
};

export const UserModel = model('User', UserSchema);
