const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/User")
const Admin = require('../models/Admin')
const express = require('express')
const app = express()

// api endpoint for registering user

app.post("/candidate/register", async (req, res) => {

    try {
        const {candidateName, candidateEmail, candidatePassword} = req.body

        const findUser = await User.findOne({ candidateName })

        if (!findUser) {
            return res.status(300).json({ message: "User name already exists"})
        }

        const hashedPassword = await bcrypt.hash(candidatePassword, 10)
        const user = new User({ candidateName, candidateEmail , candidatePassword: hashedPassword})
        await user.save()
    } catch(error) {
            res.status(500).json({error :"server error"})
    }
})

