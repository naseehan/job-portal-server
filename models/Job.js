const mongoose = require('mongoose')


const jobSchema = new mongoose.Schema({
    jobTitle: String,
    vacancy: String,
    budget: String,
    type: String,
    experienceLevel: String,
    jobPlace: String,
    deadline: Date,
    description: String,
    company: String,
    email: String,
    link: String,
    knowledge: String,
})

const Job = mongoose.model("Job", jobSchema)

module.exports = Job