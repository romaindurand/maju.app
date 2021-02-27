const cookieName = 'maju'
module.exports =  function (req, res, next) {
  if (!req.cookies) {
    req.cookieData = null
    return next()
  }
  try {
    req.cookieData = JSON.parse(req.cookies[cookieName])
  } catch (ex) {
    req.cookieData = null
  }
  next()
}
