import { Document, Model, model, Schema } from 'mongoose';

// Models
import { AddressSchema } from '@models';

// TS
import { IOrder } from '@ts';

interface IOrderDocument extends IOrder, Document {}
interface IOrderModel extends Model<IOrderDocument> {}
interface IOrderMethods extends IOrderDocument {}

const OrderSchema = new Schema<IOrder, IOrderModel, IOrderMethods>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		deliveryAddress: AddressSchema.obj,
		totalPrice: {
			type: Number,
			required: true,
			default: 0,
		},
		status: {
			type: String,
			enum: ['pending', 'canceled', 'delivered'],
			required: true,
			default: 'pending',
		},
		observation: {
			type: String,
		},
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

export const OrderModel = model('Order', OrderSchema);
