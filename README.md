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

### Rotas de Livros

> Ainda sem autenticação.

- Criar Livro: `/books/new` (POST)
- Encontrar um Livro por `ID`: `/books/id/:id` (GET)
- Encontrar todos os Livros: `/books/all` (GET)
- Encontrar um Livro pelo Título: `/books/:title` (GET)
- Encontrar um Livro pelo Autor: `/books/author/:author` (GET)
- Encontrar um Livro pela Categoria: `/books/category/:category` (GET)
- Encontrar um Livro pela Editora: `/books/publisher/:publisher` (GET)
- Editar informações do Livro: `/books/:id` (PATCH)
- Deletar Livro: `/books/:id` (DELETE)

### Rotas de ShoppingHistory

> Ainda sem autenticação.

- Criar ShoppingHistory: `/shopping-history/new` (POST)
- Encontrar um Livro por `ID`: `/shopping-history/id/:id` (GET)
- Encontrar todos os ShoppingHistory: `/shopping-history/all` (GET)
- Editar informações do ShoppingHistory: `/shopping-history/:id` (PATCH)
- Deletar Livro: `/shopping-history/:id` (DELETE)

### Rotas de CouponCodes

> Ainda sem autenticação.

- Criar CouponCode: `/coupon-codes/new` (POST)
- Encontrar um CouponCode por `ID`: `/coupon-codes/:code/code` (GET)
- Encontrar todos os CouponCode: `/coupon-codes/all` (GET)
- Editar informações do CouponCode: `/coupon-codes/:code` (PATCH)
- Deletar CouponCode: `/coupon-codes/:code` (DELETE)

### Rotas de Category

> Ainda sem autenticação.

- Criar Category: `/category/new` (POST)
- Encontrar um Category por `ID`: `/category/id/:id` (GET)
- Encontrar um Category pelo Name: `/category/:name` (GET)
- Encontrar todos os Category: `/category/all` (GET)
- Editar informações do Category: `/category/update/:id` (PATCH)
- Deletar Category: `/category/:id` (DELETE)

### Rotas de Author

> Ainda sem autenticação.

- Criar Author: `/author/new` (POST)
- Encontrar um Author por `ID`: `/author/id/:id` (GET)
- Encontrar um Author pelo Name: `/author/:name` (GET)
- Encontrar todos os Author: `/author/all` (GET)
- Editar informações do Author: `/author/update/:id` (PATCH)
- Deletar Author: `/author/:id` (DELETE)

### Rotas de Publisher

> Ainda sem autenticação.

- Criar Publisher: `/publisher/new` (POST)
- Encontrar um Publisher por `ID`: `/publisher/id/:id` (GET)
- Encontrar um Publisher pelo Name: `/publisher/:name` (GET)
- Encontrar todos os Publisher: `/publisher/all` (GET)
- Editar informações do Publisher: `/publisher/update/:id` (PATCH)
- Deletar Publisher: `/publisher/:id` (DELETE)

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

### Rotas de Autenticação

- Autenticar usuário: `/auth/login` (POST)
- Checar se token JWT está válido: `/auth/test` (POST)
- - Envie o token JWT no cabeçalho da requisição normalmente.
    Se estiver válido, retorna o nome do usuário.
    Se estiver vencido, retorna erro de autenticação `Error 401: Unauthorized`.
