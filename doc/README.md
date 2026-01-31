# 自动化发布系统文档

## 概述

本文档集描述了基于 OpenClaw Agent 的自动化发布系统设计，支持通过钉钉触发 Spring Boot 项目的构建、部署和验证。

## 文档目录

### 核心文档

| 文档 | 描述 |
|------|------|
| [自动化发布流程](./auto-deploy-flow.md) | 完整的发布流程设计，从打包到验证 |
| [发布包结构规范](./release-package-structure.md) | 发布包的目录结构和命名规范 |
| [环境配置说明](./environment-config.md) | 目标环境的配置格式和说明 |
| [Skill 设计文档](./skills-design.md) | 各个 Skill 的功能和接口设计 |
| [数据模型设计](./data-model.md) | 数据库表结构设计 |
| [部署报告模板](./deploy-report-template.md) | 部署报告的格式和模板 |
| [钉钉命令参考](./dingtalk-commands.md) | 钉钉机器人支持的命令列表 |

## 快速开始

### 1. 配置环境

编辑 `environments.json` 配置目标服务器和数据库信息。

### 2. 配置 Jenkins

确保 Jenkins 可以通过 API 访问，并配置好构建任务。

### 3. 使用钉钉触发发布

在钉钉群中 @机器人：

```
@小龙虾 发布 product-a v1.3.0 到 test-server-01
```

## 系统架构

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  钉钉群   │───▶│  OpenClaw    │───▶│   Jenkins    │───▶│  服务器   │
│  触发     │    │  Agent       │    │   构建       │    │  部署     │
└──────────┘    └──────────────┘    └──────────────┘    └──────────┘
                       │
                       ▼
                ┌──────────────┐
                │  SVN 仓库    │
                │  分析变更    │
                └──────────────┘
```

## 发布流程概览

1. **构建打包** - 分析变更、触发 Jenkins、组装发布包
2. **部署** - 预检查、备份、停服务、执行 SQL、部署应用、启动服务
3. **验证** - 健康检查、接口验证、日志检查
4. **报告** - 生成报告、发送通知、归档

## Skill 列表

| Skill | 功能 | 状态 |
|-------|------|------|
| jenkins-build | Jenkins 构建触发和管理 | 待开发 |
| svn-analyzer | SVN 变更分析 | 待开发 |
| release-packager | 发布包生成 | 待开发 |
| deploy-executor | 部署执行 | 待开发 |
| release-registry | 版本管理 | 待开发 |
| deploy-reporter | 部署报告生成 | 待开发 |

## 待办事项

- [ ] 实现 jenkins-build skill
- [ ] 实现 svn-analyzer skill
- [ ] 实现 release-packager skill
- [ ] 实现 deploy-executor skill
- [ ] 实现 release-registry skill
- [ ] 实现 deploy-reporter skill
- [ ] 创建数据库表
- [ ] 配置测试环境
- [ ] 端到端测试

## 联系方式

如有问题，请联系开发团队。
