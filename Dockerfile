# Ảnh chạy cả trang web lẫn máy chủ Hứng đáp án (một dịch vụ, một cổng).
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# Cần cả devDependencies để build (vite, typescript); tsx và ws nằm trong dependencies để chạy
RUN npm ci --include=dev
COPY . .
RUN npm run build && npm prune --omit=dev
# Cấu hình và câu hỏi nhóm soạn lưu ở đây: gắn ổ đĩa bền vào /app/data để không mất khi deploy lại
ENV DATA_DIR=/app/data
RUN mkdir -p /app/data
EXPOSE 8787
CMD ["npm", "start"]
