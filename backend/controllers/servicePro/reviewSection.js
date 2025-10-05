
import ServicePro from '../../model/servicePro.js';

const GiveReview = async (req, res) => {
  try {
    const id = req.params.id;
    const points = Number(req.body.ratting);
    const rev_comment = req.body.review;
    const email = req.body.email;

    if (!email || !rev_comment || isNaN(points)) {
      return res.status(400).send({ message: 'Invalid input data' });
    }

    const provider = await ServicePro.findById(id);

    if (!provider) {
      return res.status(404).send({ message: 'Service provider not found' });
    }

    const existingReview = provider.reviews.find(r => r.email === email);

    if (existingReview) {
      // Update existing review
      existingReview.rating = points;
      existingReview.review = rev_comment;
    } else {
      // Add new review
      provider.reviews.push({
        email,
        rating: points,
        review: rev_comment
      });
    }

    // Recalculate average rating and count
    const totalReviews = provider.reviews.length;
    const totalPoints = provider.reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalPoints / totalReviews;

    provider.review = {
      ratting: averageRating,
      count: totalReviews
    };

    await provider.save();

    res.send({ message: 'Review saved successfully' });
  } 
  catch (error) {
    console.error('Review error:', error);
    res.status(500).send({ message: 'Something went wrong', error });
  }
};

export default GiveReview;

