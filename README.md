## Rotas

### Rotas de Usuário

> Parcialmente sem autenticação.

- Criar Usuário: `/user/new` (POST)
- Encontrar um usuário por `ID`: `/user/id/:id` (GET)
- [Rota Protegida] Encontrar um usuário por `USERNAME`: `/user/` (GET)
- - `USERNAME` agora deve ser informado via token JWT
- Editar informações do Usuário: `/user/:id` (PATCH)
- Hard Delete de Usuário: `/user/:id` (DELETE)
- Soft Delete de Usuário: `/user/softdelete/:username` (PATCH)
- Desativar Usuário: `/user/disable/:username` (PATCH)
- Ativar Usuário: **rota interna**

### Rotas de Produto

> Ainda sem autenticação.

- Criar Livro: `/books/new`
- Encontrar um Livro por ID: `/books/id/:id`
- Encontrar um Livro pelo Title: `/books/:title`
- Editar informações do Livro (Patch): `/books/:id`
- Deletar Livro: `/books/:id`

### Rotas de Autenticação

- Autenticar usuário: `/auth/login` (POST)
- Checar se token JWT está válido: `/auth/test` (POST)
- - Envie o token JWT no cabeçalho da requisição normalmente.
    Se estiver válido, retorna o nome do usuário.
    Se estiver vencido, retorna erro de autenticação `Error 401: Unauthorized`.

## Rotas de Carrinho

- **Buscar os dados do carrinho:**
- - Carrinho Anônimo: `/cart/anon` (POST) passando o `GetCartDto`
- - Carrinho de Usuário: `/cart/user` (GET) passando somente o token JWT

- **Criar um novo carrinho:**
- - Carrinho Anônimo: `/cart/new/anon` (GET) sem passar nada
- - Carrinho de Usuário: `/cart/new/user` (POST) passando o token JWT e um `CreateUserCartDto` vazio se for um carrinho novo ou com a id de um carrinho anônimo (quando o usuário adiciona itens ao carrinho e depois faz login)

- **Adicionar um novo item:**
- - Carrinho Anônimo: `/cart/anon/item/add` (POST) passando um `AddItemDto`
- - Carrinho de Usuário: `/cart/user/item/add` (POST) passando o token JWT e um `AddItemDto`

- **Atualizar um Item:**
- - Carrinho Anônimo: `/cart/anon/item/update` (POST) passando um `UpdateItemDto`
- - Carrinho de Usuário: `/cart/user/item/update` (POST) passando o token JWT e um `UpdateItemDto`

- **Deletar um item:**
- - Carrinho Anônimo: `/cart/anon/item/delete` (DELETE) passando um `DeleteItemDto`
- - Carrinho de Usuário: `/cart/user/item/delete` (DELETE) passando o token JWT e um `DeleteItemDto`

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
