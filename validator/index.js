/*jshint esversion: 6 */
//
exports.userSignupValidator = (req, res, next) => {
	//
	req.check("name", "Name is a required input...").notEmpty();
	//
	req.check("email", "E-mail must be between 3 and 32 characters...")
		.matches(/.+\@.+\..+/)
		.withMessage("E-mail must have a @ symbol...")
		.isLength({
			min: 4,
			max: 32
		});
	//
	req.check("password", "Password is a required input...");
	//
	req.check("password")
		.isLength({min: 6})
		.withMessage("Password minimum length is 6 characters...")
		.matches(/\d/)
		.withMessage("Password must have a number...");
	//
	const errors = req.validationErrors();
	if(errors){
		const firstError = errors.map(error => error.msg)[0];
		return res.status(400).json({error: firstError});
	}
	next();
};
