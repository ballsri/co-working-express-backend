const express = require("express");
const mockupfunc = require("../util/mockup-response.js").mockupfunc;
const {
  getReservationsByUserId,
  updateReservationByUserId,
  deleteReservationByUserId,
  checkin,
  checkout,
} = require("../controllers/user/user.js");
const router = express.Router();

const { protect, authorize, restrictTo } = require("../middleware/auth.js");

router
  .route("/:u_id/reservation")
  .get(protect, authorize("user"), restrictTo("u_id"), getReservationsByUserId);
router
  .route("/:u_id/reservation/:r_id")
  .put(
    protect,
    authorize("user"),
    restrictTo("u_id"),
    updateReservationByUserId
  )
  .delete(
    protect,
    authorize("user"),
    restrictTo("u_id"),
    deleteReservationByUserId
  );
router
  .route("/:u_id/reservation/:r_id/check-in")
  .get(protect, authorize("user"), restrictTo("u_id"), checkin);
router
  .route("/:u_id/reservation/:r_id/check-out")
  .get(protect, authorize("user"), restrictTo("u_id"), checkout);
module.exports = router;
