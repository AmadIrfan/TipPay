const { Payout } = require('../models/paymentModel');
const User = require('../models/userModel');


let payout = async (req, res) => {
  const { employeeId, amount } = req.body;

  try {
    // Fetch employee details
    const user = await User.findById(employeeId);

    if (user) {
      // Check if the employee has enough tips
      if (user.totalTips < amount) {
        return res.status(400).json({ message: 'Insufficient tips for payout' });
      }
    }
    else {

    }

    // Create payout request in the database
    const payout = new Payout({
      employeeId,
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
  const { id } = req.params;
  const { status } = req.body;

  try {
    const payout = await Payout.findByIdAndUpdate(id, { status, processedAt: Date.now() }, { new: true });

    if (payout !== null) {
      if (status === 'approved') {
        // Deduct payout amount from user's total tips
        await User.findByIdAndUpdate(payout.employeeId, { $inc: { totalTips: -payout.amount } });
      }
    }

    res.status(200).json({ status: 'ok', message: 'Payout updated successfully', data: payout });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, message: `Error updating payout ${error.message}` });
  }
}

module.exports = {
  payout,
  approvePayout,
}
