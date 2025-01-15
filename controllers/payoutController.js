const { Payout } = require('../models/paymentModel');
const User = require('../models/userModel');


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
      await User.findByIdAndUpdate(payout.employeeId, { $inc: { totalTips: -payout.amount } });
      payout.status = "approved";
      await payout.save();
      return res.status(200).json({ status: 'ok', message: 'Payout updated successfully', data: payout });
    }
    else if (status === 'failed') {
      payout.status = "failed";
      await payout.save()
      return res.status(400).json({ status: 'error', message: 'Payment request Failed', data: null });

    }

  } catch (error) {
    return res.status(500).json({ status: 'error', data: null, message: `Error updating payout ${error.message}` });
  }
}

module.exports = {
  payout,
  approvePayout,
}
