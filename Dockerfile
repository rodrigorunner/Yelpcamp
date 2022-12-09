# Herdar os módulos da versão node
FROM node:16.18.0
# Variável de ambiente especificando o modo de operação do aplicativo.
ENV NODE_ENV = production
# Copiar os arquivos de configuração
COPY ["package.json", "package-lock.json*", "./"]
# Comando para instalar as dependências do projeto
RUN npm install --production
# O comando COPY pega todos os arquivos no dir atual e copia para a imagem.
COPY . .
EXPOSE 3000
# Especificar qual o comando o docker vai usar para rodar a imagem
CMD ["node", "app.js"]
