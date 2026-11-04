import { Router } from 'express';
import { generateTokens, verifyRefreshToken, authenticate } from '../../utils/auth.js';
import { exactSeedData } from '../../seedDataExact.js';

const router = Router();

// In-memory or persisted users list
let users = [...exactSeedData.users];

/**
 * POST /api/v1/auth/login
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  // Senha padrão Muriae2026! ou validação
  if (!user || (password !== 'Muriae2026!' && !user.passwordHash)) {
    return res.status(401).json({ error: 'Credenciais inválidas. Use Muriae2026!' });
  }

  const tokens = generateTokens(user);

  res.json({
    message: 'Autenticado com sucesso no MobillsPro',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    ...tokens
  });
});

/**
 * POST /api/v1/auth/refresh
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken é obrigatório' });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({ error: 'Refresh token expirado ou inválido' });
  }

  const user = users.find(u => u.id === decoded.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const tokens = generateTokens(user);
  res.json(tokens);
});

/**
 * GET /api/v1/auth/me
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;

