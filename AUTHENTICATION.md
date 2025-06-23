# Autenticação da API

## Visão Geral

Todas as rotas da API (exceto login e registro) agora requerem autenticação via token Bearer. As rotas de jogos agora identificam e registram qual usuário está fazendo cada operação.

## Rotas Públicas (sem autenticação)

- `POST /auth/login` - Login de usuário
- `POST /usuarios` - Registro de novo usuário

## Rotas Protegidas (com autenticação)

### Jogos
- `GET /jogos` - Listar todos os jogos (identifica o usuário)
- `POST /jogos` - Criar novo jogo (identifica o usuário)
- `GET /jogos/:id` - Buscar jogo por ID (identifica o usuário)
- `PATCH /jogos/:id` - Atualizar jogo (identifica o usuário)
- `DELETE /jogos/:id` - Deletar jogo (identifica o usuário)

### Usuários
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `PATCH /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário

### Autenticação
- `POST /auth/logout` - Logout de usuário

## Como usar a autenticação

### 1. Registro de usuário
```bash
POST /usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "123456"
}
```

### 2. Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "123456"
}
```

Resposta:
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "123456",
  "token": "abc123def456..."
}
```

### 3. Usar o token nas requisições
```bash
GET /jogos
Authorization: Bearer abc123def456...
```

**Logs gerados:**
```
[2024-01-01 12:00:00] [JogosController] Usuário João Silva (joao@example.com) buscando jogos
```

### 4. Criar um jogo
```bash
POST /jogos
Authorization: Bearer abc123def456...
Content-Type: application/json

{
  "nome": "The Legend of Zelda",
  "empresa": "Nintendo",
  "valor": "R$ 299,90",
  "lancamento": "2023-05-12",
  "genero": "Aventura",
  "consoles": "Nintendo Switch",
  "avaliacao": 10
}
```

**Logs gerados:**
```
[2024-01-01 12:00:00] [JogosController] Usuário João Silva (joao@example.com) criando jogo: The Legend of Zelda
```

### 5. Logout
```bash
POST /auth/logout
Authorization: Bearer abc123def456...
```

Resposta:
```json
{
  "message": "Logout realizado com sucesso"
}
```

## Headers necessários

Para todas as rotas protegidas, inclua o header:
```
Authorization: Bearer <seu_token_aqui>
```

## Funcionalidades de Segurança

### Identificação do Usuário
- Todas as operações em jogos agora identificam qual usuário está fazendo a ação
- Logs detalhados mostram nome e email do usuário para cada operação
- O token é validado em cada requisição

### Validação de Token
- O token é verificado no banco de dados a cada requisição
- Tokens inválidos ou expirados retornam erro 401
- O logout remove o token do banco de dados

## Tratamento de erros

- **401 Unauthorized**: Token não fornecido ou inválido
- **400 Bad Request**: Dados inválidos na requisição
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Email já em uso (no registro)

## Próximos Passos

Para melhorar ainda mais a segurança, você pode:

1. **Associar jogos aos usuários**: Adicionar um campo `userId` na tabela de jogos
2. **Controle de acesso**: Permitir que usuários vejam apenas seus próprios jogos
3. **Auditoria**: Criar uma tabela de logs para registrar todas as ações
4. **Expiração de token**: Implementar expiração automática de tokens 