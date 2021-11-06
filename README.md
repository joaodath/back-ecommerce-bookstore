## Rotas
### Rotas de Usuário
> Ainda sem autenticação. 
- Criar Usuário: `/user/new`
- Encontrar um usuário por ID: `/user/id/:id`
- Encontrar um usuário por USERNAME: `/user/:username`
- Editar informações do Usuário (Patch): `/user/:id`
- Deletar Usuário: `/user/:id`
  
### Rotas de Produto
> Ainda sem autenticação.
- Criar Livro: `/books/new`
- Encontrar um Livro por ID: `/books/id/:id`
- Encontrar um Livro pelo Title: `/books/:title`
- Editar informações do Livro (Patch): `/books/:id`
- Deletar Livro: `/books/:id`

## Autenticação
Para adicionar autenticação nas rotas, use o Guard de autenticação da seguinte forma:

No arquivo .module.ts, insira:
```
imports: [AuthModule],
```

No arquivo .controller.ts, insira:

```
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
#dados da rota aqui
```
