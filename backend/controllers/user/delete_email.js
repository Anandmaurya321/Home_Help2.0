

import User from '../../model/user.js'

const Delete_Email = async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Deleting:", email);

    const result = await User.deleteOne({ email: email });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: result.deletedCount > 0 ? "User deleted" : "User not found"
    });
  }
   catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default Delete_Email;

