#!/bin/bash

# 构建脚本
echo "Building azhot-ts..."

# 安装依赖
echo "Installing dependencies..."
bun install

# 构建项目
echo "Building project..."
bun run build

# 检查构建结果
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed!"
  exit 1
fi

echo "Build script completed."