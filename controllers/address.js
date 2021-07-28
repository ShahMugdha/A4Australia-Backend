import Address from "../models/address.js"

export const addAddress = async(req, res) => {
  try {
    const user = req.userData
    const userExists = await Address.findOne({user: {_id: user._id}})
    console.log(userExists, "user exists")
    const {
      state,
      city,
      subUrb,
      addressLine1,
      addressLine2,
      postalCode,
      mobile
    } = req.body
    if(!userExists) {
      const address = await Address.create({
        user,
        addresses: [{
          state,
          city,
          subUrb,
          addressLine1,
          addressLine2,
          postalCode,
          mobile
        }]
      });
      if(!address) {
        return res.status(404).json({success: false, message: "address not created"});
      }
      return res.status(201).json({success: true, message: "address created", result: address});
    }
    const addressExists = await Address.findOne({
      addresses: { 
        state,
        city,
        subUrb,
        addressLine1,
        addressLine2,
        postalCode,
        mobile
      }
    })
    console.log(addressExists, "address exists")
    if(!addressExists) {
      const newAddress = await Address.findOneAndUpdate(
        {user: {_id: user._id}},
        { $push: { 
          addresses: { 
            state,
            city,
            subUrb,
            addressLine1,
            addressLine2,
            postalCode,
            mobile
          }
        }}
      )
      if(!newAddress) {
        return res.status(404).json({success: false, message: "new address not added "});
      }
      return res.status(201).json({success: true, message: "new address added", result: newAddress});
      
    }
    return res.status(409).json({success: false, message: "This address is already saved"});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const getAllAddresses = async(req, res) => {
  try {
    const addresses = await Address.find({user: {_id: req.userData._id}}).populate('addresses').populate('user')
    if(!addresses) {
      return res.status(404).json({success: false, message: "address list not found"});
    }
    return res.status(200).json({success: true, message: "retrieved address list", result: addresses});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const getMyAddress = async(req, res) => {
  try {
    const userId = req.userData._id
    const address = await Address.findOne({user: {_id: userId}})
    if(!address) {
      return res.status(404).json({success: false, message: "address not found"});
    }
    return res.status(200).json({success: true, message: "retrieved address", result: address});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const updateAddress = async(req, res) => {
  try {
    const {addressId} = req.params
    const address = req.body
    const updatedAddress = await Address.findOneAndUpdate(
      {user: {_id: req.userData._id}, addresses: {_id: addressId}},
      {$set: {addresses: address}}, 
      { new : true }
    )
    if(!updatedAddress) {
      return res.status(404).json({success: false, message: "address not updated"});
    }
    return res.status(201).json({success: true, message: "address updated", result: updatedAddress});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}

export const removeAddress = async(req, res) => {
  try {
    const {addressId} = req.params
    const deletedAddress = await Address.findOneAndDelete({'user._id': req.userData._id, 'addresses._id': addressId})
    if(!deletedAddress) {
      return res.status(404).json({success: false, message: "address not deleted"});
    }
    return res.status(200).json({success: true, message: "address deleted", result: deletedAddress});
  }
  catch(err) {
    return res.status(500).json({success: false, message: "something went wrong", result: err});
  }
}