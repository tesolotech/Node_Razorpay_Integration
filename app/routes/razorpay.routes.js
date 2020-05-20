
const checkAuth = require('../middleware/check_auth');

module.exports = (app) => {
    const razorpay = require('../controllers/razorpay.controller.js');

    // Create order for purchages
    /**
     * @swagger
     *
     * /api/CreateOrder:
     *   post:
     *     description: Create order for purchages
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: OrderAmount
     *         description: Order amount
     *         in: formData
     *         required: true
     *         type: string
     *       - name: Currency
     *         description: Currency.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       201:
     *         description: Create order for purchages
     */
    app.post('/api/CreateOrder', razorpay.CreatePaymentOrder);


    // VerifySignature
    /**
     * @swagger
     *
     * /api/VerifySignature:
     *   post:
     *     description: VerifySignature
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: razorpay_payment_id
     *         description: razorpay_payment_id
     *         in: formData
     *         required: true
     *         type: string
     *       - name: razorpay_order_id
     *         description: razorpay_order_id.
     *         in: formData
     *         required: true
     *         type: string
     *       - name: razorpay_signature
     *         description: razorpay_signature.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       202:
     *         description: VerifySignature
     */
    app.post('/api/VerifySignature', razorpay.VerifySignature);
    
}
