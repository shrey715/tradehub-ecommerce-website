import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Order',
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Bill = mongoose.model('Bill', BillSchema) || mongoose.models.Bill;

export default Bill;