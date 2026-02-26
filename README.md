 # contatita
 Aplicação simples de controle de contatos (melhor que seu celular).

 ## Como rodar o projeto

 Para rodar o contatita no seu ambiente é bem simples.

 1) Clone o projeto:
 ```bash
 git clone https://github.com/davifernandodias/contatita
 ```

 2) Tenha o Docker instalado e execute no terminal bash:
 ```bash
 make prepare-environment
 ```
 > Funciona melhor em ambiente Linux.

 3) Esse comando irá:
 - subir os containers do banco (com migrations)
 - subir backend e frontend
 - deixar tudo pronto para uso

 4) Acesse:
 ```
 http://localhost:3000/
 ```
 e teste à vontade.

 ---

 ## Documentação técnica

 - Projeto estruturado em monorepo para facilitar o desenvolvimento.
 - Backend separado em rotas de domínio (routes-contact).
 - Uso de Drizzle ORM com queries diretas no controller (sem repository) pela simplicidade.
 - Banco de dados: PostgreSQL (configuração via Docker Compose).
 - Frontend em React com Vite, componentização por features do domínio.
 - Requisições não são feitas diretamente nos componentes, mas em services que fornecem dados.
 - Proxy configurado com Nginx para comunicação com API.
 - Projeto preparado para deploy por estar completamente containerizado.
