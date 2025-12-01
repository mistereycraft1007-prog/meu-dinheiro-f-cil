# 🚀 Como Rodar o Sistema de Empréstimos Localmente

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 16 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (já vem com o Node.js)

Para verificar se já tem instalado, abra o terminal e digite:
```bash
node --version
npm --version
```

## 📦 Baixando o Projeto

### Opção 1: Via Git (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Entre na pasta do projeto
cd SEU_REPOSITORIO
```

### Opção 2: Download Direto
1. Acesse o repositório no GitHub
2. Clique no botão verde "Code"
3. Selecione "Download ZIP"
4. Extraia o arquivo ZIP em uma pasta de sua preferência
5. Abra o terminal nessa pasta

## ⚙️ Instalação

Dentro da pasta do projeto, execute:

```bash
# Instalar todas as dependências
npm install
```

Aguarde a instalação finalizar (pode levar alguns minutos).

## 🎯 Rodando o Projeto

Após a instalação, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O sistema irá abrir automaticamente no seu navegador em:
```
http://localhost:8080
```

## 💾 Sobre o Banco de Dados

O projeto **NÃO precisa de configuração de banco de dados**! 

- Todos os dados são salvos **localmente no navegador** (localStorage)
- Os dados persistem mesmo após fechar o navegador
- Cada navegador tem seus próprios dados separados

## ✨ Funcionalidades Disponíveis

✅ Adicionar novos empréstimos  
✅ Editar empréstimos existentes  
✅ Excluir empréstimos  
✅ Pagar juros (adia vencimento por 1 mês)  
✅ Visualizar estatísticas (total emprestado, a receber, lucro, etc)  
✅ Filtrar por status (Todos, Em Aberto, Pagos, Atrasados)  
✅ Alertas de empréstimos vencidos  

## 🔧 Comandos Úteis

```bash
# Rodar em modo desenvolvimento
npm run dev

# Fazer build para produção
npm run build

# Visualizar build de produção
npm run preview
```

## 📱 Acessando de Outros Dispositivos

Para acessar o sistema de outros dispositivos na mesma rede:

1. Descubra seu IP local:
   - Windows: `ipconfig` no terminal
   - Mac/Linux: `ifconfig` no terminal

2. Acesse no outro dispositivo:
   ```
   http://SEU_IP:8080
   ```
   Exemplo: `http://192.168.1.100:8080`

## ⚠️ Observações Importantes

1. **Dados Locais**: Os dados ficam salvos apenas no navegador que você usar
2. **Backup**: Recomendado exportar os dados periodicamente
3. **Navegadores Diferentes**: Cada navegador mantém dados separados
4. **Limpar Cache**: Se limpar o cache do navegador, os dados serão perdidos

## 🐛 Problemas Comuns

### Erro "porta 8080 já está em uso"
```bash
# Mate o processo na porta 8080 ou use outra porta
npm run dev -- --port 3000
```

### Erro ao instalar dependências
```bash
# Limpe o cache do npm e reinstale
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Página em branco
- Verifique se não há erros no console do navegador (F12)
- Tente limpar o cache do navegador (Ctrl+Shift+Del)
- Reinicie o servidor (Ctrl+C e depois `npm run dev`)

## 📞 Suporte

Se encontrar problemas:
1. Verifique se seguiu todos os passos corretamente
2. Confirme que o Node.js está instalado corretamente
3. Veja os logs no terminal para identificar erros

## 🎉 Pronto!

Agora você já pode usar o Sistema de Gestão de Empréstimos localmente!

**Dica**: Adicione alguns empréstimos de teste para explorar todas as funcionalidades.
