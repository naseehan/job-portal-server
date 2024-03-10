const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String
    },
    jobPlace: {
        type: String,
    },
    designation: String,
    experience: String,
    qualification: String,
    email: String,
    number: String,
    link: String,
    language: String,
    objective: String,
    father: String,
    mother: String,
    birth: Date,
    address: String,
    status: String,
    gender: String,
    religion: String,
    height: String,
    weight: String,
    skills: String,
    level: String,
    major: String,
    institute: String,
    gpa: String,
    startingPeriod: String,
    endingPeriod: String,
    // user: userSchema
})

const Resume = mongoose.model("Resume", resumeSchema)

module.exports = Resume