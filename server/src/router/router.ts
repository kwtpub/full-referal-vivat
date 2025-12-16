import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller.js';
import { body } from 'express-validator';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ClientController } from '../controllers/client.controller.js';
import { DealController } from '../controllers/deal.controller.js';
import { BonusController } from '../controllers/bonus.controller.js';

router.post(
  '/registration',
  body('name').isLength({ min: 3, max: 25 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 25 }),
  AgentController.registration,
);
router.post('/login', AgentController.login);
router.post('/logout', AgentController.logout);
router.get('/activate/:link', AgentController.activate);
router.get('/refresh', AgentController.refresh);
router.get('/agents', authMiddleware, AgentController.getAllUsers);
router.patch('/agents/:id', authMiddleware, AgentController.update);
router.get('/agents/stats', authMiddleware, AgentController.getAgentsWithStats);
router.get('/agents/stats/total', authMiddleware, AgentController.getTotalStats);
router.get('/agents/:agentId/stats', authMiddleware, AgentController.getAgentStats);


router.post('/client', ClientController.create);
// WARN: Дописать обработчики ошибок для getCL в сервайсах 
router.get('/clients', ClientController.getClients);
router.get('/clients/:id', ClientController.getClientsFromAgent);
router.get('/client/find', ClientController.findByPhone);
// WARN: Дописать метод delete (Реализуется удаление через 2 запроса к базе данных) 
router.delete('/client/:id', ClientController.delete);
router.delete('/client/:id/admin', authMiddleware, ClientController.deleteById);
router.patch('/client/:id', ClientController.update);

router.post('/deal/:clientId', DealController.create);
router.delete('/deal/:id', DealController.delete);
router.patch('/deal/:id', DealController.update);
router.get('/deals', DealController.getDeals);
router.get('/deals/client/:clientId', DealController.getDealsByClientId);
router.get('/deals/agent/:agentId', DealController.getDealsByAgentId);
router.get('/deal/:id', DealController.getDealById);
router.post('/deal/:id/approve', authMiddleware, DealController.approveDeal);
router.post('/deal/:id/reject', authMiddleware, DealController.rejectDeal);

// Бонусы
router.get('/bonuses', BonusController.getBonuses);
router.get('/bonuses/stats', BonusController.getBonusStats);

export default router;
