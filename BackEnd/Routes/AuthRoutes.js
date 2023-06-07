
// Requiring controllers, middlewares, and modules for authentication, authorization, and image upload
const { register, login, admin, deleteUser, editUser, uploadImage } = require('../Controllers/AuthControllers')
const { checkUser, checkUserToken,isAdmin } = require('../Middlewares/AuthMiddlewares')
const { uploadOptions } = require('../Middlewares/multer')
const router = require('express').Router()


// Register, Login & authentication
router.post('/', checkUser)
router.post('/register',register)
router.post('/login', login)


// Admin authorization & functionalities
router.get('/admin',isAdmin,admin)
router.delete('/admin/delete-user/:id',isAdmin,deleteUser)
router.post('/edit-user', isAdmin, editUser)


// Image upload
router.post('/upload-image',uploadOptions.single('image'),uploadImage)


module.exports = router
