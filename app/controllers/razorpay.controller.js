
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const sha256 = require("sha256")
const razorpayorder  = require('../models/razorpayorder.model.js');
const dbConfig = require('../../dbconfig/database.config.js');

const instance = new Razorpay({
    key_id: dbConfig.key_id,
    key_secret: dbConfig.key_secret,
  });

//Create payment order
exports.CreatePaymentOrder = (req,res,next) =>{
    if(req.body.OrderAmount && req.body.Currency){
        const OrderData = {
            "amount":Number(req.body.OrderAmount)*100,
            "currency":req.body.Currency,
            "receipt":'Order_receipt_1',
            "payment_capture":'1',
            "notes":{}
        }
        instance.orders.create(OrderData,(error,order)=>{
            if(error){
                console.log('Razorpay error',error);
                return res.status(500).json({
                    error:error
                });
            }else{
                const RazorPayOrderDoc = new razorpayorder({
                            _id:new mongoose.Types.ObjectId(),
                            RazorPayOrderId: order.id,
                            PaymentStatus: "Created",
                            Currency: req.body.Currency,
                            AmountToBeCharged: req.body.OrderAmount,
                            TransactionId: order.id,
                            UserId: order.id,
                         });
                RazorPayOrderDoc.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'User created successfull',
                        orderId: RazorPayOrderDoc.RazorPayOrderId
                    })
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    });
                });
            }
        })
    }
}

//VerifySignature
exports.VerifySignature = (req,res,next) =>{
    if(req.body.razorpay_order_id && req.body.razorpay_payment_id && req.body.razorpay_signature){
        const generated_signature = sha256(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id, dbConfig.key_secret);
        console.log(generated_signature);
        if (generated_signature == req.body.razorpay_signature) {
            razorpayorder.updateOne({RazorPayOrderId:req.body.razorpay_order_id},
                { $set: { PaymentStatus: 'Paid'}})
            .exec()
            .then(result => {
                res.status(202).json({
                    message:'Signature Matched',
                    data:result
                });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while Updating."
                });
            });
        }else{
            res.status(409).json({
                message:'Signature Not Matched'
            });
        }
    }
}
