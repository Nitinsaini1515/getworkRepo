import asyncHandler from "../utils/asynchHandler.js";
import apiErrors from "../utils/ApiErrors.js";
import apiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.js";
import { Rating } from "../models/rating.js";

// rating
// give review
// delete review
// edit review

export const giveRating = asyncHandler(async (req, res) => {
  const ratingGivenBy = req.user_id;
  const jobratingTo = req.params;
  const { rating, review } = req.body;
  if (!(ratingGivenBy && jobratingTo)) {
    throw new apiErrors("there is an error during the rating of the job");
  }
  if (!rating||!review) {
    throw new apiErrors(401, "Enter every field correctly");
  }
  const ratingDone = await Rating.create({
    rating,
    review,
  });
  return res
    .status(200)
    .json(new apiResponse(200, ratingDone,"Rating given successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user_id);
  const review = await Rating.findById(req.rating_id);

  if (!user) {
    throw new apiErrors(401, "There is no user exsist in deletereview");
  }
  if (!review) {
    throw new apiErrors(402, "There is no review exist to delte the review");
  }
  await Rating.findByIdAndDelete(req.rating_id);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "The review is deleted successfully"));
});

export const editReview = asyncHandler(async (req, res) => {
  const { rating, newReview } = req.body;
  if ([rating, newReview].some((fields) => fields.trime() == "")) {
    throw new apiErrors(402, "All field are required to edit review");
  }
  const user = await User.findById(req.user_id);
  const review = await Rating.findById(req.rating_id);

  if (!user) {
    throw new apiErrors(401, "There is no user exsist in deletereview");
  }
  if (!review) {
    throw new apiErrors(402, "There is no review exist to delte the review");
  }

  rating = this.rating || rating;
  review = this.review || review;
  await Rating.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Rating is updated successfully"));
});

what is your