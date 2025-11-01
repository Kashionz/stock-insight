FROM node:20-alpine

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製應用程式代碼
COPY . .

# 暴露端口
EXPOSE 5173

# 啟動應用
CMD ["npm", "run", "dev"]
