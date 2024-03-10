const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name: String,
    companyEmail: String,
    companyName: String,
    companyType: String,
    companyPassword: String
})

const Company = mongoose.model("Company", companySchema)

module.exports = Company