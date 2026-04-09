# Prova 2 — Portal Restrito com Dashboard Dinâmico - N1

## Autor

| Campo | Info |
|-------|------|
| **Nome** | Guilherme Espicoz Almeida |
| **Instituição** | Uniube |
| **Período** | Matutino |

Aplicação web com controle de acesso e manipulação dinâmica do DOM, desenvolvida com Node.js, Express e JavaScript puro.

## Sobre o Projeto

O portal exige autenticação via API. Após o login bem-sucedido, o formulário desaparece e um dashboard de boas-vindas é exibido dinamicamente, sem recarregar a página.

## Tecnologias Utilizadas

- **Node.js** — ambiente de execução do servidor
- **Express** — framework para criar o servidor web
- **CORS** — permite comunicação entre frontend e backend local
- **HTML/CSS/JavaScript** — interface do usuário

## Estrutura do Projeto

```
prova2-portal/
├── index.html        # Tela de login e dashboard
├── styles.css        # Estilos da página
├── server.js         # Servidor Node.js
└── package.json      # Dependências do projeto
```

## Como Rodar

**1. Instalar dependências:**
```bash
npm install
```

**2. Iniciar o servidor:**
```bash
node server.js
```

**3. Abrir o `index.html` no navegador**

> O servidor roda em `http://localhost:3000`

## Usuários de Teste

| Usuário | Senha |
|---------|-------|
| admin   | 123   |
| gui     | 456   |

## Funcionalidades

- Login com validação via API
- Após login bem-sucedido:
  - Formulário some da tela
  - Dashboard é exibido dinamicamente com o nome do usuário
- Retorno de status HTTP corretos:
  - `200` — login bem-sucedido, retorna o username
  - `401` — credenciais inválidas
- Campos com atributo `required` para validação no frontend
