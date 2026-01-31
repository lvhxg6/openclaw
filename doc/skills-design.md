# Skill 设计文档

## 概述

自动化发布流程通过以下 Skills 实现，每个 Skill 负责特定的功能模块。

## Skill 列表

| Skill | 功能 | 优先级 |
|-------|------|--------|
| jenkins-build | Jenkins 构建触发和管理 | P0 |
| svn-analyzer | SVN 变更分析 | P0 |
| release-packager | 发布包生成 | P0 |
| deploy-executor | 部署执行 | P0 |
| release-registry | 版本管理 | P1 |
| deploy-reporter | 部署报告生成 | P1 |

---

## 1. jenkins-build

### 功能描述

触发 Jenkins 构建任务，查询构建状态，下载构建产物。

### 目录结构

```
skills/jenkins-build/
├── tools.md                   # 工具说明
├── scripts/
│   ├── trigger-build.sh       # 触发构建
│   ├── get-status.sh          # 查询构建状态
│   ├── wait-build.sh          # 等待构建完成
│   └── download-artifact.sh   # 下载构建产物
└── config/
    └── jenkins.example.json   # 配置示例
```

### 工具定义

#### trigger-build

触发 Jenkins 构建任务。

**参数：**
- `job`: Job 名称
- `params`: 构建参数（JSON 格式）

**示例：**
```bash
./trigger-build.sh --job "product-a-build" --params '{"VERSION":"1.3.0","MODULES":"user-service,order-service"}'
```

**返回：**
```json
{
  "buildNumber": 123,
  "queueId": 456,
  "url": "http://jenkins/job/product-a-build/123/"
}
```

#### get-status

查询构建状态。

**参数：**
- `job`: Job 名称
- `build`: 构建号

**返回：**
```json
{
  "building": false,
  "result": "SUCCESS",
  "duration": 180000,
  "artifacts": [
    {"name": "user-service-1.3.0.jar", "path": "target/user-service-1.3.0.jar"}
  ]
}
```

---

## 2. svn-analyzer

### 功能描述

分析 SVN 仓库变更，识别变更文件类型，生成变更报告。

### 目录结构

```
skills/svn-analyzer/
├── tools.md
├── scripts/
│   ├── get-changes.sh         # 获取变更列表
│   ├── classify-changes.sh    # 分类变更文件
│   ├── get-commit-logs.sh     # 获取提交日志
│   └── generate-changelog.sh  # 生成变更日志
└── templates/
    └── changelog.md.tpl       # 变更日志模板
```

### 工具定义

#### get-changes

获取两个版本之间的变更文件列表。

**参数：**
- `repo`: SVN 仓库地址
- `from`: 起始版本号
- `to`: 结束版本号

**返回：**
```json
{
  "fromRevision": 1050,
  "toRevision": 1100,
  "changes": [
    {"action": "M", "path": "src/main/java/com/xxx/UserService.java"},
    {"action": "A", "path": "src/main/resources/db/ddl/001_add_table.sql"},
    {"action": "M", "path": "src/main/resources/application.yml"}
  ]
}
```

#### classify-changes

对变更文件进行分类。

**返回：**
```json
{
  "code": ["src/main/java/com/xxx/UserService.java"],
  "ddl": ["src/main/resources/db/ddl/001_add_table.sql"],
  "dml": [],
  "config": ["src/main/resources/application.yml"],
  "other": []
}
```

---

## 3. release-packager

### 功能描述

组装发布包，包括收集构建产物、SQL 文件、配置文件等。

### 目录结构

```
skills/release-packager/
├── tools.md
├── scripts/
│   ├── create-package.sh      # 创建发布包目录
│   ├── collect-jars.sh        # 收集 JAR 包
│   ├── collect-sql.sh         # 收集 SQL 文件
│   ├── generate-config-diff.sh # 生成配置差异
│   ├── generate-manifest.sh   # 生成发布清单
│   └── package-release.sh     # 打包发布包
└── templates/
    ├── release-notes.md.tpl
    └── manifest.json.tpl
```

### 工具定义

#### create-package

创建发布包目录结构。

**参数：**
- `product`: 产品名称
- `version`: 版本号
- `type`: 发布类型（full/incremental）

**返回：**
```json
{
  "packageDir": "/tmp/release-product-a-v1.3.0-20260131",
  "structure": ["jars", "sql/ddl", "sql/dml", "sql/rollback", "config", "scripts"]
}
```

#### package-release

打包发布包。

**返回：**
```json
{
  "packagePath": "/releases/product-a/incremental/v1.2.0-v1.3.0/release-v1.3.0-20260131.tar.gz",
  "size": 28000000,
  "md5": "abc123..."
}
```

---

## 4. deploy-executor

### 功能描述

执行部署操作，包括预检查、备份、停服务、执行 SQL、部署应用、启动服务、验证。

### 目录结构

```
skills/deploy-executor/
├── tools.md
├── scripts/
│   ├── pre-check.sh           # 预检查
│   ├── backup.sh              # 备份
│   ├── stop-service.sh        # 停止服务
│   ├── execute-sql.sh         # 执行 SQL
│   ├── deploy-jar.sh          # 部署 JAR
│   ├── start-service.sh       # 启动服务
│   ├── health-check.sh        # 健康检查
│   ├── verify.sh              # 验证
│   └── rollback.sh            # 回滚
└── config/
    └── environments.json      # 环境配置
```

### 工具定义

#### pre-check

执行部署前检查。

**参数：**
- `environment`: 目标环境
- `version`: 目标版本

**返回：**
```json
{
  "passed": true,
  "checks": [
    {"name": "ssh_connectivity", "passed": true},
    {"name": "db_connectivity", "passed": true},
    {"name": "disk_space", "passed": true, "available": "5.2GB"},
    {"name": "current_version", "passed": true, "version": "v1.2.0"},
    {"name": "upgrade_path", "passed": true}
  ]
}
```

#### execute-sql

执行 SQL 脚本。

**参数：**
- `environment`: 目标环境
- `sqlFiles`: SQL 文件列表
- `type`: ddl/dml

**返回：**
```json
{
  "success": true,
  "results": [
    {"file": "001_add_index.sql", "success": true, "duration": 300, "rowsAffected": 0},
    {"file": "002_add_column.sql", "success": true, "duration": 500, "rowsAffected": 0}
  ]
}
```

#### health-check

执行健康检查。

**返回：**
```json
{
  "healthy": true,
  "checks": [
    {"name": "actuator_health", "passed": true, "status": "UP"},
    {"name": "version_check", "passed": true, "version": "v1.3.0"},
    {"name": "db_connection", "passed": true},
    {"name": "startup_log", "passed": true, "errors": 0}
  ]
}
```

---

## 5. release-registry

### 功能描述

管理版本信息，记录发布历史，查询升级路径。

### 目录结构

```
skills/release-registry/
├── tools.md
├── scripts/
│   ├── list-versions.sh       # 列出版本
│   ├── get-version-info.sh    # 获取版本详情
│   ├── register-version.sh    # 注册新版本
│   ├── get-upgrade-path.sh    # 获取升级路径
│   └── get-current-version.sh # 获取当前版本
└── data/
    └── registry.json          # 版本注册表
```

---

## 6. deploy-reporter

### 功能描述

生成部署报告，发送通知。

### 目录结构

```
skills/deploy-reporter/
├── tools.md
├── scripts/
│   ├── generate-report.sh     # 生成报告
│   ├── send-dingtalk.sh       # 发送钉钉通知
│   ├── send-email.sh          # 发送邮件
│   └── archive-report.sh      # 归档报告
└── templates/
    ├── report.md.tpl          # 报告模板
    ├── dingtalk-success.tpl   # 钉钉成功通知模板
    └── dingtalk-failed.tpl    # 钉钉失败通知模板
```

---

## 使用示例

### 完整发布流程

```
用户: @小龙虾 发布 product-a v1.3.0 到 test-server-01

Agent 执行流程:
1. [release-registry] 查询 test-server-01 当前版本 → v1.2.0
2. [release-registry] 确认升级路径 v1.2.0 → v1.3.0 有效
3. [svn-analyzer] 分析 SVN 变更 r1050 → r1100
4. [jenkins-build] 触发构建 → 等待完成 → 下载产物
5. [release-packager] 组装发布包
6. [deploy-executor] 预检查 → 备份 → 停服务 → 执行SQL → 部署 → 启动 → 验证
7. [deploy-reporter] 生成报告 → 发送通知
8. [release-registry] 更新版本记录
```

### 单独触发构建

```
用户: @小龙虾 构建 product-a v1.3.0

Agent 执行:
1. [jenkins-build] 触发构建
2. [jenkins-build] 等待构建完成
3. [jenkins-build] 返回构建结果
```

### 查询版本信息

```
用户: @小龙虾 查看 test-server-01 的版本

Agent 执行:
1. [release-registry] 查询当前版本
2. 返回版本信息
```
