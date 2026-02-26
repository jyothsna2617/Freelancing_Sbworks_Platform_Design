const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getFreelancerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ freelancerId: req.params.freelancerId })
      .populate("projectId", "title")
      .populate("clientId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

