# 环境配置说明

## 部署环境范围

```
┌─────────────────────────────────────────────────────────────┐
│  自动化部署目标环境                                           │
├─────────────────────────────────────────────────────────────┤
│  ✅ 开发环境 (dev)    - 支持自动部署                          │
│  ✅ 测试环境 (test)   - 支持自动部署                          │
│  ❌ 生产环境 (prod)   - 不在自动化范围内，需人工操作            │
└─────────────────────────────────────────────────────────────┘
```

## 环境配置文件

环境配置存储在 `environments.json` 中，定义了所有可部署的目标环境。

## 配置格式（多数据库支持）

```json
{
  "dev-server-01": {
    "name": "开发环境1",
    "type": "dev",
    "description": "开发联调环境",
    
    "server": {
      "host": "192.168.1.10",
      "port": 22,
      "user": "deploy",
      "authType": "key",
      "keyPath": "/path/to/deploy_key"
    },
    
    "services": {
      "user-service": {
        "deployPath": "/opt/apps/user-service",
        "jarName": "user-service.jar",
        "port": 8080,
        "healthUrl": "http://localhost:8080/actuator/health",
        "infoUrl": "http://localhost:8080/actuator/info",
        "startScript": "/opt/apps/user-service/start.sh",
        "stopScript": "/opt/apps/user-service/stop.sh",
        "logPath": "/opt/apps/user-service/logs/app.log",
        "jvmOpts": "-Xms512m -Xmx1024m",
        "profile": "dev"
      }
    },
    
    "database": {
      "type": "opengauss",
      "host": "192.168.1.11",
      "port": 5432,
      "user": "deploy_user",
      "password": "${DB_PASSWORD}",
      "database": "product_db",
      "charset": "utf8"
    },
    
    "backup": {
      "enabled": true,
      "path": "/backup/product-a",
      "retentionDays": 3,
      "backupDatabase": "none"
    },
    
    "notify": {
      "dingtalk": true,
      "email": []
    }
  },
  
  "test-server-01": {
    "name": "测试环境1 (OpenGauss)",
    "type": "test",
    "description": "功能测试环境 - OpenGauss 数据库",
    
    "server": {
      "host": "192.168.1.100",
      "port": 22,
      "user": "deploy",
      "authType": "key",
      "keyPath": "/path/to/deploy_key"
    },
    
    "services": {
      "user-service": {
        "deployPath": "/opt/apps/user-service",
        "jarName": "user-service.jar",
        "port": 8080,
        "healthUrl": "http://localhost:8080/actuator/health",
        "infoUrl": "http://localhost:8080/actuator/info",
        "startScript": "/opt/apps/user-service/start.sh",
        "stopScript": "/opt/apps/user-service/stop.sh",
        "logPath": "/opt/apps/user-service/logs/app.log",
        "jvmOpts": "-Xms1024m -Xmx2048m",
        "profile": "test"
      }
    },
    
    "database": {
      "type": "opengauss",
      "host": "192.168.1.101",
      "port": 5432,
      "user": "deploy_user",
      "password": "${DB_PASSWORD}",
      "database": "product_db",
      "charset": "utf8"
    },
    
    "backup": {
      "enabled": true,
      "path": "/backup/product-a",
      "retentionDays": 7,
      "backupDatabase": "changed_tables"
    },
    
    "notify": {
      "dingtalk": true,
      "email": ["test-team@company.com"]
    }
  },
  
  "test-server-02": {
    "name": "测试环境2 (GreatDB)",
    "type": "test",
    "description": "功能测试环境 - 万里数据库",
    
    "server": {
      "host": "192.168.1.110",
      "port": 22,
      "user": "deploy",
      "authType": "key",
      "keyPath": "/path/to/deploy_key"
    },
    
    "services": {
      "user-service": {
        "deployPath": "/opt/apps/user-service",
        "jarName": "user-service.jar",
        "port": 8080,
        "healthUrl": "http://localhost:8080/actuator/health",
        "startScript": "/opt/apps/user-service/start.sh",
        "stopScript": "/opt/apps/user-service/stop.sh",
        "jvmOpts": "-Xms1024m -Xmx2048m",
        "profile": "test"
      }
    },
    
    "database": {
      "type": "greatdb",
      "host": "192.168.1.111",
      "port": 3306,
      "user": "deploy_user",
      "password": "${DB_PASSWORD}",
      "database": "product_db",
      "charset": "utf8mb4"
    },
    
    "backup": {
      "enabled": true,
      "path": "/backup/product-a",
      "retentionDays": 7,
      "backupDatabase": "changed_tables"
    },
    
    "notify": {
      "dingtalk": true,
      "email": ["test-team@company.com"]
    }
  },
  
  "test-server-03": {
    "name": "测试环境3 (GoldenDB)",
    "type": "test",
    "description": "功能测试环境 - 中兴分布式数据库",
    
    "server": {
      "host": "192.168.1.120",
      "port": 22,
      "user": "deploy",
      "authType": "key",
      "keyPath": "/path/to/deploy_key"
    },
    
    "database": {
      "type": "goldendb",
      "host": "192.168.1.121",
      "port": 3306,
      "user": "deploy_user",
      "password": "${DB_PASSWORD}",
      "database": "product_db",
      "charset": "utf8mb4"
    },
    
    "...": "..."
  },
  
  "test-server-04": {
    "name": "测试环境4 (盘维)",
    "type": "test",
    "description": "功能测试环境 - 盘维数据库",
    
    "database": {
      "type": "panwei",
      "host": "192.168.1.131",
      "port": 5236,
      "user": "deploy_user",
      "password": "${DB_PASSWORD}",
      "database": "product_db"
    },
    
    "...": "..."
  },
  
  "test-server-05": {
    "name": "测试环境5 (PostgreSQL)",
    "type": "test",
    "description": "功能测试环境 - PostgreSQL",
    
    "database": {
      "type": "pg",
      "host": "192.168.1.141",
      "port": 5432,
      "user": "deploy_user",
      "password": "${DB_PASSWORD}",
      "database": "product_db",
      "charset": "utf8"
    },
    
    "...": "..."
  }
}
```

## 配置项说明

### server 服务器配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| host | string | 是 | 服务器 IP 或域名 |
| port | number | 是 | SSH 端口 |
| user | string | 是 | SSH 用户名 |
| authType | string | 是 | 认证方式：key / password |
| keyPath | string | 否 | SSH 私钥路径（authType=key 时必填） |
| password | string | 否 | SSH 密码（authType=password 时必填） |
| jumpHost | object | 否 | 跳板机配置 |

### services 服务配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| deployPath | string | 是 | 部署目录 |
| jarName | string | 是 | JAR 包名称 |
| port | number | 是 | 服务端口 |
| healthUrl | string | 是 | 健康检查 URL |
| infoUrl | string | 否 | 版本信息 URL |
| startScript | string | 是 | 启动脚本路径 |
| stopScript | string | 是 | 停止脚本路径 |
| logPath | string | 否 | 日志文件路径 |
| jvmOpts | string | 否 | JVM 参数 |
| profile | string | 否 | Spring Profile |

### database 数据库配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 数据库类型：opengauss / greatdb / goldendb / panwei / pg |
| host | string | 是 | 数据库主机 |
| port | number | 是 | 数据库端口 |
| user | string | 是 | 数据库用户名 |
| password | string | 是 | 数据库密码（支持环境变量） |
| database | string | 是 | 数据库名称 |
| charset | string | 否 | 字符集 |

### 数据库类型与默认端口

| 类型 | 标识 | 默认端口 | 客户端工具 |
|------|------|---------|-----------|
| OpenGauss | `opengauss` | 5432 | gsql |
| GreatDB | `greatdb` | 3306 | mysql |
| GoldenDB | `goldendb` | 3306 | mysql |
| 盘维数据库 | `panwei` | 5236 | pwcli |
| PostgreSQL | `pg` | 5432 | psql |

### backup 备份配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| enabled | boolean | 是 | 是否启用备份 |
| path | string | 是 | 备份存储路径 |
| retentionDays | number | 否 | 备份保留天数 |
| backupDatabase | string | 否 | 数据库备份策略：full / changed_tables / none |

## 环境类型

| 类型 | 说明 | 自动部署 |
|------|------|----------|
| dev | 开发环境 | ✅ 支持 |
| test | 测试环境 | ✅ 支持 |
| staging | 预发布环境 | ❌ 不支持（需人工） |
| prod | 生产环境 | ❌ 不支持（需人工） |

## 敏感信息处理

敏感信息（如密码）支持以下方式：

1. **环境变量引用**
   ```json
   "password": "${DB_PASSWORD}"
   ```

2. **加密存储**
   ```json
   "password": "ENC(xxxxx)"
   ```

3. **外部密钥管理**
   ```json
   "passwordRef": "vault://secret/db/password"
   ```

## 服务启动脚本模板

### start.sh

```bash
#!/bin/bash

APP_NAME="user-service"
APP_HOME="/opt/apps/${APP_NAME}"
JAR_NAME="${APP_NAME}.jar"
LOG_PATH="${APP_HOME}/logs"
PID_FILE="${APP_HOME}/${APP_NAME}.pid"

# JVM 参数
JAVA_OPTS="-Xms512m -Xmx1024m"
JAVA_OPTS="${JAVA_OPTS} -XX:+UseG1GC"
JAVA_OPTS="${JAVA_OPTS} -Dspring.profiles.active=test"

# 检查是否已运行
if [ -f "${PID_FILE}" ]; then
    PID=$(cat "${PID_FILE}")
    if ps -p ${PID} > /dev/null 2>&1; then
        echo "Service is already running (PID: ${PID})"
        exit 1
    fi
fi

# 创建日志目录
mkdir -p ${LOG_PATH}

# 启动服务
cd ${APP_HOME}
nohup java ${JAVA_OPTS} -jar ${JAR_NAME} > ${LOG_PATH}/startup.log 2>&1 &

# 记录 PID
echo $! > ${PID_FILE}
echo "Service started (PID: $!)"
```

### stop.sh

```bash
#!/bin/bash

APP_NAME="user-service"
APP_HOME="/opt/apps/${APP_NAME}"
PID_FILE="${APP_HOME}/${APP_NAME}.pid"
TIMEOUT=60

if [ ! -f "${PID_FILE}" ]; then
    echo "PID file not found"
    exit 0
fi

PID=$(cat "${PID_FILE}")

if ! ps -p ${PID} > /dev/null 2>&1; then
    echo "Service is not running"
    rm -f ${PID_FILE}
    exit 0
fi

# 发送 SIGTERM
echo "Stopping service (PID: ${PID})..."
kill ${PID}

# 等待进程退出
COUNT=0
while ps -p ${PID} > /dev/null 2>&1; do
    sleep 1
    COUNT=$((COUNT + 1))
    if [ ${COUNT} -ge ${TIMEOUT} ]; then
        echo "Timeout, force killing..."
        kill -9 ${PID}
        break
    fi
done

rm -f ${PID_FILE}
echo "Service stopped"
```
