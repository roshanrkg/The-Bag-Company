module.exports = function (req, res, next) {
    if (!req.user) {
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }

    if (req.user.email !== process.env.ADMIN_EMAIL) {
        req.flash("error", "You are not authorized to access this page");
        return res.redirect("/");
    }

    next();
};
