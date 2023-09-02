const express = require("express");
const router = express.Router();
const {
  createApply,
  getEmployeeApplies,
  deleteApply,
  acceptEmployee,
  declineEmployee,
  getVacancyApplies,
} = require("./controllers");
const { isEmployee, isManager } = require("../auth/middlewares");
const {
  isAuthorOfApply,
  isAuthorOfVacancy,
  isApplyExists,
} = require("./middlewares");
const passport = require("passport");
const { validateApply } = require("./middlewares");

router.post(
  "/api/applies",
  passport.authenticate("jwt", { session: false }),
  isEmployee,
  validateApply,
  createApply
);
router.get(
  "/api/applies/employee",
  passport.authenticate("jwt", { session: false }),
  getEmployeeApplies
);
router.get(
  "/api/applies/vacancy/:id",
  passport.authenticate("jwt", { session: false }),
  isManager,
  isAuthorOfVacancy,
  getVacancyApplies
);
router.delete(
  "/api/applies/:id",
  passport.authenticate("jwt", { session: false }),
  isEmployee,
  isAuthorOfApply,
  deleteApply
);
router.put(
  "/api/applies/accept/employee",
  passport.authenticate("jwt", { session: false }),
  isManager,
  isApplyExists,
  isAuthorOfVacancy,
  acceptEmployee
);
router.put(
  "/api/applies/decline/employee",
  passport.authenticate("jwt", { session: false }),
  isManager,
  isApplyExists,
  isAuthorOfVacancy,
  declineEmployee
);
module.exports = router;
