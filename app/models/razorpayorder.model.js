const mongoose = require('mongoose');

const RazorpaySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    TransactionId: {type:String, required:true,unique:true},
    AmountToBeCharged:{type: Number, required:true},
    Currency:{type: String, required:true},
    RazorPayOrderId:{type: String, required:true},
    PaymentStatus:{type: String, required:true},
    UserId:{type: String, required:false}
}, {
    timestamps: true
});


module.exports = mongoose.model('razorpayorder', RazorpaySchema);


