const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const statusController = require('../controllers/statusController');
const usersController = require('../controllers/usersController');
const tasksController = require('../controllers/tasksController');
const authController = require('../controllers/authController');
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const sendResponse = require('../utils/apiResponse');

router.get('/', homeController.getHome);
router.get('/status', statusController.getStatus);
router.get('/api/public/endpoints', (_req, res) => {
  return sendResponse(res, 200, 'Endpoints públicos del módulo 8.', {
    public: [
      'GET /',
      'GET /status',
      'GET /api/public/endpoints',
      'POST /api/auth/register',
      'POST /api/auth/login',
    ],
    protected: [
      'GET /api/auth/me',
      'GET /api/users',
      'GET /api/users/raw',
      'GET /api/users/:id',
      'POST /api/users',
      'PUT /api/users/:id',
      'DELETE /api/users/:id',
      'GET /api/users/:id/tasks',
      'POST /api/users/transactional',
      'GET /api/tasks',
      'GET /api/tasks/:id',
      'POST /api/tasks',
      'PUT /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'POST /api/upload',
    ],
  });
});

router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.get('/api/auth/me', authMiddleware, authController.getProfile);

router.use('/api/users', authMiddleware);
router.use('/api/tasks', authMiddleware);

router.get('/api/users', usersController.getUsers);
router.get('/api/users/raw', usersController.getUsersRaw);
router.get('/api/users/:id', usersController.getUserById);
router.post('/api/users', usersController.createUser);
router.put('/api/users/:id', usersController.updateUser);
router.delete('/api/users/:id', usersController.deleteUser);
router.get('/api/users/:id/tasks', usersController.getUserTasks);
router.post('/api/users/transactional', usersController.createUserWithWelcomeTask);

router.get('/api/tasks', tasksController.getTasks);
router.get('/api/tasks/:id', tasksController.getTaskById);
router.post('/api/tasks', tasksController.createTask);
router.put('/api/tasks/:id', tasksController.updateTask);
router.delete('/api/tasks/:id', tasksController.deleteTask);

router.post('/api/upload', authMiddleware, upload.single('avatar'), uploadController.uploadAvatar);

module.exports = router;
