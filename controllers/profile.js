import User from '../models/user.js'
import Address from '../models/address.js'

export const getUserProfile = async(req, res) => {
  try {
    const user = await User.findById(req.userData._id);
    console.log(user, "user")
    const address = await Address.findOne({user: {_id: req.userData._id}})
    console.log(address, "add")
    if(!user || !address) {
      return res.status(404).json({success: false, message: "profile not found"}); 
    }
    return res.status(200).json({success: true, message: "retrieved profile", result: {user, addresses: address.addresses}});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}
