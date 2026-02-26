const Application = require("../models/Application");
const Project = require("../models/Project");

// Freelancer applies
exports.applyForProject = async (req, res) => {
  try {
    const {
      projectId,
      freelancerId,
      clientId,
      proposal,
      bidAmount
    } = req.body;

    const existing = await Application.findOne({
      projectId,
      freelancerId
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Already applied to this project" });
    }

    const application = await Application.create({
      projectId,
      freelancerId,
      clientId,
      proposal,
      bidAmount,
      status: "pending"
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Freelancer views own applications
exports.getFreelancerApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      freelancerId: req.params.freelancerId
    }).populate("projectId", "title budget")
      .populate("clientId", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Client views applications for their projects
exports.getClientApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      clientId: req.params.clientId
    }).populate("projectId", "title budget")
      .populate("freelancerId", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Client accepts / rejects
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (app && status === "accepted") {
      // Update Project to assigned/working and set freelancerId
      await Project.findByIdAndUpdate(app.projectId, {
        status: "assigned",
        freelancerId: app.freelancerId
      });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

