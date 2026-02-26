const Submission = require("../models/Submission");
const Project = require("../models/Project");

// Freelancer submits completed work
exports.submitWork = async (req, res) => {
  try {
    const { projectId, freelancerId, clientId, workLink, description } = req.body;

    const submission = await Submission.create({
      projectId,
      freelancerId,
      clientId,
      workLink,
      description,
    });

    // Update Project Status
    await Project.findByIdAndUpdate(projectId, { status: "submitted" });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Freelancer views own submissions
exports.getFreelancerSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ freelancerId: req.params.freelancerId })
      .populate("projectId", "title")
      .populate("clientId", "name");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Client views submissions
exports.getClientSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ clientId: req.params.clientId })
      .populate("freelancerId", "name email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get submissions for a specific project
exports.getProjectSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ projectId: req.params.projectId })
      .populate("freelancerId", "name email");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Client updates submission status (Approve / Revision)
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // If approved, update project status to completed
    if (status === "approved") {
      await Project.findByIdAndUpdate(submission.projectId, { status: "completed" });
    } else if (status === "revision") {
      await Project.findByIdAndUpdate(submission.projectId, { status: "working" });
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin views all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("projectId", "title")
      .populate("freelancerId", "name")
      .populate("clientId", "name");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};