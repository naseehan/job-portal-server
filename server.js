const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const User = require("./models/User");
const Company = require("./models/Company");
const Resume = require("./models/Resume");
const Job = require("./models/Job");
const verifyToken = require("./middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// registering user
app.post("/candidate/register", async (req, res) => {
  try {
    const { candidateName, candidateEmail, candidatePassword } = req.body;

    const findUser = await User.findOne({ candidateName });


    if (findUser) {
      return res.status(300).json({ message: "User name already exists" });
    }

    const hashedPassword = await bcrypt.hash(candidaePassword, 10);
    const user = new User({
      candidateName,
      candidateEmail,
      candidatePassword: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

// registering company
app.post("/company/register", async (req, res) => {
  try {t
    const { name, companyEmail, companyName, companyType, companyPassword } =
      req.body;

    // const findUser = await Company.findOne({ name })

    // if(findUser) {
    //     return res.status(300).json({message : "Username already exists"})
    // }
    const hashedPassword = await bcrypt.hash(companyPassword, 10);

    const company = new Company({
      name,
      companyEmail,
      companyName,
      companyType,
      companyPassword: hashedPassword,
    });
    await company.save();
    res.status(201).json({ message: "Company saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

// for logging in candidate
app.post("/candidate/login", async (req, res) => {
  const { candidateEmail, candidatePassword } = req.body;

  if (candidateEmail && candidatePassword) {
    const user = await User.findOne({ candidateEmail }).populate("resume");;

    const resume = await Resume.find()

    if (!user) {
      return res.status(400).json({ message: "Username doesn't exist" });
    }

    const isPasswordTrue = await bcrypt.compare(
      candidatePassword,
      user.candidatePassword
    );
    if (!isPasswordTrue) {
      return res
        .status(300)
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    res.json({
      token,
      userID: user._id,
      candidateName: user.candidateName,
      candidateEmail: user.candidateEmail,
      resume: user.resume,
    });

  }
});

// for logging in company
app.post("/company/login", async (req, res) => {
  const { companyEmail, companyPassword } = req.body;

  if (companyEmail && companyPassword) {
    const company = await Company.findOne({ companyEmail });

    if (!company) {
      return res.status(400).json({ message: "Username doesn't exist" });
    }

    const isPasswordTrue = await bcrypt.compare(
      companyPassword,
      company.companyPassword
    );
    if (!isPasswordTrue) {
      return res
        .status(300)
        .json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ company }, process.env.JWT_SECRET);
    res.json({
      token,
      companyID: company._id,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
    });
  }
});

// for editing resume
app.post("/editResume",upload.single("image") ,async (req, res) => {
    try {
      const {
        name,
        image,
        jobPlace,
        designation,
        experience,
        qualification,
        email,
        number,
        link,
        language,
        objective,
        father,
        mother,
        birth,
        address,
        status,
        gender,
        religion,
        height,
        weight,
        skills,
        level,
        major,
        institute,
        gpa,
        startingPeriod,
        endingPeriod,
      } = req.body;

      const newStartingPeriod = new Date(startingPeriod);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedStartingPeriod = `${
        monthNames[newStartingPeriod.getMonth()]
      }, ${newStartingPeriod.getFullYear()}`;

      const newEndingPeriod = new Date(endingPeriod);
      const formattedEndingPeriod = `${
        monthNames[newEndingPeriod.getMonth()]
      }, ${newEndingPeriod.getFullYear()}`;

      const resume = new Resume({
        user: req.user,
        name,
        image: req.file,
        jobPlace,
        designation,
        experience,
        qualification,
        email,
        number,
        link,
        language,
        objective,
        father,
        mother,
        birth,
        address,
        status,
        gender,
        religion,
        height,
        weight,
        skills,
        level,
        major,
        institute,
        gpa,
        startingPeriod: formattedStartingPeriod,
        endingPeriod: formattedEndingPeriod,
        
      });

      const savedResume = await resume.save();

// Update user document with the created resume's ID
await User.findByIdAndUpdate(
  req.user._id,
  { $push: { resume: savedResume._id } },
  { new: true }
);


      res.status(201).json({ message: "Resume saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "server error" });
      console.log(error);
    }
  }
);

// getting updated resume for viewing
app.get("/viewResume",verifyToken, async (req, res) => {
  try {
    // const userId = req.query.userId;
    const resume = await Resume.find()
    // const resume = await Resume.find({ user: userId});
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve Resume " });
  }
});

// for job search
app.post("/jobSearch", async (req, res) => {
  

  try{
    const { jobTitle, jobLocation } = req.body;

    if(jobTitle && jobLocation) {

const transformedTitle = jobTitle.toLowerCase().replace(/\s/g, '');

    const search = await Job.find({ jobTitle: transformedTitle });

    if (search.length === 0) {
      return res.status(400).json({ message: "Couldn't find this job" });
    }

    res.json(search);
  } else {
    res.status(400).json({ message: "Missing jobTitle or jobLocation" });
  }}
  catch (error) {
    res.status(500).json({ error: "NO Jobs Available"})
  }
});

// for posting job
app.post("/postJob", async (req, res) => {
  try {
    const {
      jobTitle,
      vacancy,
      budget,
      type,
      experienceLevel,
      jobPlace,
      deadline,
      description,
      knowledge,
      link,
      email,
      company,
   } = req.body;

const transformedTitle = jobTitle.toLowerCase().replace(/\s/g, '');

    const job = new Job({
      jobTitle : transformedTitle,
      vacancy,
      budget,
      type,
      experienceLevel,
      jobPlace,
      deadline,
      description,
      knowledge,
      link,
      email,
      company,
    });

    await job.save();
    res.status(200).json({ message: "Job saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "an error occured" });
  }
});

// for getting jobs from server
app.get("/jobs", async (req, res) => {
  try{
  const response = await Job.find()
  res.json(response)
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve jobs"})
  }
})

// for showing full job details
app.get("/fullJob", async(req, res) => {
  try{
  const job = await Job.find()
  res.json(job)
  } catch (error) {
    res.status(500).json({ error: "Error occured"})
  }
})

// for applying jobs
app.post("/applied",async (req,res) => {
  try{
  const  { jobId }  = req.body
  const appliedJob = await Job.findById(jobId)
  res.json( appliedJob )
  } catch (error) {
    res.status(500).json({ error: "Cannot find job" })
  }
})


app.listen(3001, () => {
  console.log("server started in port 3001");
});
