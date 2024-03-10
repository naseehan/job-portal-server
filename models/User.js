const mongoose = require('mongoose')
const { Resume } = require('./Resume');
// const { resumeSchema } = require('./Resume');



const userSchema = new mongoose.Schema({
    candidateName: String,
    candidateEmail: String,
    candidatePassword: String,
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
      },
})

const User = mongoose.model("User", userSchema)

// export default User;
module.exports = User;
