const { register, login, admin, deleteUser, editUser, uploadImage } = require('../Controllers/AuthControllers')
const { checkUser, checkUserToken,isAdmin } = require('../Middlewares/AuthMiddlewares')
const { uploadOptions } = require('../Middlewares/multer')


const multer = require('multer')

const router = require('express').Router()
router.post('/',checkUser)
router.post('/register',register)
router.post('/login',login)
router.get('/admin',isAdmin,admin)
router.delete('/admin/delete-user/:id',isAdmin,deleteUser)
router.post('/edit-user',editUser)
router.post('/upload-image',uploadOptions.single('image'),uploadImage)

module.exports = router
