#!/bin/bash
#
# OpenClaw 一键启动脚本
# 启动 Gateway 服务（包含 Web UI）
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🦞 OpenClaw 启动脚本${NC}"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到 Node.js，请先安装 Node.js 22+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo -e "${YELLOW}警告: Node.js 版本 $(node -v)，建议使用 22+${NC}"
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}未找到 pnpm，尝试使用 npm 安装...${NC}"
    npm install -g pnpm
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}正在安装依赖...${NC}"
    pnpm install
fi

# 检查是否需要构建
if [ ! -d "dist" ] || [ "$(find src -name '*.ts' -newer dist -print -quit 2>/dev/null)" ]; then
    echo -e "${YELLOW}正在构建项目...${NC}"
    pnpm build
fi

# 检查配置
check_config() {
    local config_file="$HOME/.openclaw/openclaw.json"
    if [ ! -f "$config_file" ]; then
        echo -e "${YELLOW}未找到配置文件，将使用默认配置${NC}"
        return
    fi
    
    # 检查 gateway.mode
    if ! grep -q '"mode".*:.*"local"' "$config_file" 2>/dev/null; then
        echo -e "${YELLOW}设置 gateway.mode=local...${NC}"
        pnpm openclaw config set gateway.mode local 2>/dev/null || true
    fi
}

check_config

# 停止已运行的 gateway
echo -e "${BLUE}检查已运行的服务...${NC}"
pkill -f "openclaw-gateway" 2>/dev/null || true
sleep 1

# 启动 Gateway
echo ""
echo -e "${GREEN}启动 OpenClaw Gateway...${NC}"
echo -e "${BLUE}Web UI 地址: http://127.0.0.1:18789${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止服务${NC}"
echo ""

# 运行 gateway
exec pnpm openclaw gateway run
