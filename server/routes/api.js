import { Router } from "express";
import validationMiddleware from "../middleware/validation.js";
import userControlers from "../controllers/userController.js";
import passport from "passport";

const router = Router();

// routes begin gere

// create account route
router.post(
  "/register",
    validationMiddleware.registerValidationRules(),
    validationMiddleware.validateInputs,
  userControlers.handleNormalUserRegistration
);

// login route with email/password
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/v1/success",
    failureRedirect: "/api/v1/failure",
    failureFlash: true, // enable flashing messages on failed login
  })
);

// Success and failure routes
router.get("/success", userControlers.successLogin);

router.get("/failure", userControlers.failureLogin);

// Logout route handler
router.get('/logout', (req, res) => {
  req.logout((err) => { // Provide a callback function for req.logout()
    if (err) {
      // Handle error if needed
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({message: "Logout successfyl"})
  });
});

router.get("/dashboard", (req, res) => {
  if(req.isAuthenticated()) { // Check if the user is authenticated
    res.status(200).json({ message: "You are authenticated" }); // Send a success message if authenticated
  } else {
    res.status(401).json({ message: "You are not authenticated" }); // Send an unauthorized message if not authenticated
  }
  console.log(req.session);
  console.log(req.user);
});


// add more routes beloe

export default router;
