const validity = (req, res, next) => {
    const {email, password} = req.body;
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/api/users/signup") {
      if (![email,password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json('Email must be valid');
      }
    } 
    else if (req.path === "/api/users/signin") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.status(401).json('Email must be valid');
      }
    }
    else if (req.path === "/api/users/forgotpassword") {
      if (!validEmail(email)) {
        return res.status(401).json('Email must be valid');
      }
    }
    next();
  };

  module.exports = validity;