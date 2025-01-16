const { Payout } = require('../models/paymentModel');
const User = require('../models/userModel');
const { sendMsg } = require('./notificationController');

let payout = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    // Fetch employee details
    const user = await User.findById(userId);

    if (!user) {
      // Check if the employee has enough tips
      return res.status(404).json({ status: 'error', data: null, message: 'user not found' });
    }
    if (user.totalTips < amount) {
      return res.status(400).json({ status: 'error', data: null, message: 'Insufficient tips for payout' });
    }


    // Create payout request in the database
    const payout = new Payout({
      employeeId: userId,
      amount,
      status: 'pending',
    });
    await payout.save();

    res.status(201).json({ status: 'ok', data: payout, message: 'Payout request submitted' });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, message: `Error submitting payout request ${error.message}` });
  }
}

let approvePayout = async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;
    const payout = await Payout.findByIdAndUpdate(id, { processedAt: Date.now() }, { new: true });

    if (!payout) {

      return res.status(404).json({ status: 'error', message: 'no request found', data: null });
    }
    if (payout.status === "failed") {

      return res.status(400).json({ status: 'error', message: 'request is already proceed with failed', data: null });
    }
    if (payout.status === "approved") {

      return res.status(200).json({ status: 'error', message: 'request is already approved', data: null });
    }


    if (status === 'approved') {
      let user = await User.findByIdAndUpdate(payout.employeeId, { $inc: { totalTips: -payout.amount } });
      payout.status = "approved";
      await payout.save();
      await sendMsg(user.fcm_token, `You  request for payment of ${payout.amount} have been approved`, "Payment Approved ");
      return res.status(200).json({ status: 'ok', message: 'Payout updated successfully', data: payout });
    }
    else if (status === 'failed') {
      let user = await User.findById(payout.employeeId);
      payout.status = "failed";
      await payout.save()
      await sendMsg(user.fcm_token, `You  request for payment of ${payout.amount} have been Rejected `, "Payment Approved ");
      return res.status(400).json({ status: 'error', message: 'Payment request Failed', data: null });

    }

  } catch (error) {
    return res.status(500).json({ status: 'error', data: null, message: `Error updating payout ${error.message}` });
  }
}


const processPayouts = async (req, res) => {
  try {
    console.log('Processing automated payouts...');

    // Fetch all pending payouts
    const pendingPayouts = await Payout.find({ status: 'pending' });
    console.log(pendingPayouts);

    if (pendingPayouts.length === 0) {
      return res.status(200).json({
        status: 'ok',
        message: 'No pending payouts found.',
        data: [],
      });
    }

    const results = [];

    for (const payout of pendingPayouts) {
      const employee = await User.findById(payout.employeeId);

      if (employee && employee.totalTips >= payout.amount) {
        await User.findByIdAndUpdate(payout.employeeId, { $inc: { totalTips: -payout.amount } });
        payout.status = 'approved';
        payout.processedAt = Date.now();
        await payout.save();

        // Send notification
        await sendMsg(
          employee.fcm_token,
          `Your payout of $${payout.amount} has been successfully processed.`,
          'Payout Approved'
        );

        results.push({ employeeId: payout.employeeId, status: 'approved', amount: payout.amount });
        console.log(`Payout of $${payout.amount} approved for ${employee.name}`);
      } else {
        // Mark payout as failed
        payout.status = 'failed';
        payout.processedAt = Date.now();
        await payout.save();

        // Send notification
        if (employee) {
          await sendMsg(
            employee.fcm_token,
            `Your payout request of $${payout.amount} failed due to insufficient tips.`,
            'Payout Failed'
          );
        }

        results.push({ employeeId: payout.employeeId, status: 'failed', amount: payout.amount });
        console.log(`Payout of $${payout.amount} failed for ${employee ? employee.name : 'unknown user'}`);
      }
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Payouts processed successfully.',
      data: results,
    });
  } catch (error) {
    console.error('Error processing payouts:', error.message);
    return res.status(500).json({
      status: 'error',
      message: `Error processing payouts: ${error.message}`,
      data: null,
    });
  }
};




module.exports = {
  payout,
  approvePayout,
  processPayouts,
}
