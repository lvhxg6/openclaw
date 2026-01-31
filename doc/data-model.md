# 数据模型设计

## 概述

本文档定义了自动化发布系统所需的数据模型，包括部署历史、版本注册、环境配置等。

---

## 1. 部署历史表 (deploy_history)

记录每次部署的详细信息。

```sql
CREATE TABLE deploy_history (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    deploy_id       VARCHAR(50) NOT NULL COMMENT '部署ID，格式: deploy-{timestamp}-{random}',
    
    -- 版本信息
    product         VARCHAR(100) NOT NULL COMMENT '产品名称',
    from_version    VARCHAR(50) COMMENT '原版本',
    to_version      VARCHAR(50) NOT NULL COMMENT '目标版本',
    upgrade_type    VARCHAR(20) NOT NULL COMMENT '升级类型: full/incremental',
    
    -- 环境信息
    environment     VARCHAR(100) NOT NULL COMMENT '目标环境ID',
    environment_name VARCHAR(100) COMMENT '目标环境名称',
    server_host     VARCHAR(100) NOT NULL COMMENT '服务器地址',
    
    -- 状态信息
    status          VARCHAR(20) NOT NULL COMMENT '状态: pending/running/success/failed/rollback',
    
    -- 操作信息
    operator        VARCHAR(100) COMMENT '操作人',
    operator_id     VARCHAR(100) COMMENT '操作人ID',
    trigger_source  VARCHAR(50) COMMENT '触发来源: dingtalk/jenkins/manual/api',
    
    -- 时间信息
    start_time      DATETIME NOT NULL COMMENT '开始时间',
    end_time        DATETIME COMMENT '结束时间',
    duration_ms     INT COMMENT '耗时(毫秒)',
    
    -- 详情信息
    package_path    VARCHAR(500) COMMENT '发布包路径',
    backup_path     VARCHAR(500) COMMENT '备份路径',
    report_url      VARCHAR(500) COMMENT '报告链接',
    jenkins_build_url VARCHAR(500) COMMENT 'Jenkins 构建链接',
    
    -- 错误信息
    error_phase     VARCHAR(50) COMMENT '失败阶段',
    error_message   TEXT COMMENT '错误信息',
    
    -- 元数据
    metadata        JSON COMMENT '扩展元数据',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_product_version (product, to_version),
    INDEX idx_environment (environment),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_operator (operator)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部署历史表';
```

---

## 2. 部署步骤表 (deploy_steps)

记录部署过程中每个步骤的执行情况。

```sql
CREATE TABLE deploy_steps (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    deploy_id       VARCHAR(50) NOT NULL COMMENT '部署ID',
    
    -- 步骤信息
    step_order      INT NOT NULL COMMENT '步骤顺序',
    step_name       VARCHAR(50) NOT NULL COMMENT '步骤名称',
    step_type       VARCHAR(50) NOT NULL COMMENT '步骤类型: pre_check/backup/stop_service/execute_sql/deploy/start_service/verify',
    
    -- 状态信息
    status          VARCHAR(20) NOT NULL COMMENT '状态: pending/running/success/failed/skipped',
    
    -- 时间信息
    start_time      DATETIME COMMENT '开始时间',
    end_time        DATETIME COMMENT '结束时间',
    duration_ms     INT COMMENT '耗时(毫秒)',
    
    -- 结果信息
    result          JSON COMMENT '执行结果',
    error_message   TEXT COMMENT '错误信息',
    
    -- 元数据
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_deploy_id (deploy_id),
    INDEX idx_step_type (step_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部署步骤表';
```

---

## 3. 版本注册表 (version_registry)

记录每个产品的版本信息。

```sql
CREATE TABLE version_registry (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    
    -- 版本信息
    product         VARCHAR(100) NOT NULL COMMENT '产品名称',
    version         VARCHAR(50) NOT NULL COMMENT '版本号',
    version_type    VARCHAR(20) NOT NULL COMMENT '版本类型: full/incremental',
    base_version    VARCHAR(50) COMMENT '基础版本(增量包时必填)',
    
    -- 构建信息
    svn_revision_from INT COMMENT 'SVN 起始版本',
    svn_revision_to INT COMMENT 'SVN 结束版本',
    jenkins_build_number INT COMMENT 'Jenkins 构建号',
    
    -- 包信息
    package_path    VARCHAR(500) NOT NULL COMMENT '发布包路径',
    package_size    BIGINT COMMENT '包大小(字节)',
    package_md5     VARCHAR(64) COMMENT '包 MD5',
    
    -- 内容信息
    artifacts       JSON COMMENT '包含的产物列表',
    changelog       TEXT COMMENT '变更日志',
    
    -- 状态信息
    status          VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/deprecated/deleted',
    
    -- 元数据
    created_by      VARCHAR(100) COMMENT '创建人',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    UNIQUE INDEX uk_product_version (product, version),
    INDEX idx_product (product),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='版本注册表';
```

---

## 4. 环境版本表 (environment_versions)

记录每个环境当前部署的版本。

```sql
CREATE TABLE environment_versions (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    
    -- 环境信息
    environment     VARCHAR(100) NOT NULL COMMENT '环境ID',
    product         VARCHAR(100) NOT NULL COMMENT '产品名称',
    service         VARCHAR(100) COMMENT '服务名称(可选)',
    
    -- 版本信息
    current_version VARCHAR(50) NOT NULL COMMENT '当前版本',
    previous_version VARCHAR(50) COMMENT '上一版本',
    
    -- 部署信息
    last_deploy_id  VARCHAR(50) COMMENT '最后部署ID',
    last_deploy_time DATETIME COMMENT '最后部署时间',
    last_deploy_by  VARCHAR(100) COMMENT '最后部署人',
    
    -- 元数据
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    UNIQUE INDEX uk_env_product_service (environment, product, service),
    INDEX idx_environment (environment),
    INDEX idx_product (product)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='环境版本表';
```

---

## 5. SQL 执行记录表 (sql_execution_log)

记录 SQL 脚本的执行情况。

```sql
CREATE TABLE sql_execution_log (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    deploy_id       VARCHAR(50) NOT NULL COMMENT '部署ID',
    
    -- SQL 信息
    sql_file        VARCHAR(200) NOT NULL COMMENT 'SQL 文件名',
    sql_type        VARCHAR(20) NOT NULL COMMENT 'SQL 类型: ddl/dml/rollback',
    sql_content     TEXT COMMENT 'SQL 内容',
    
    -- 执行信息
    execution_order INT NOT NULL COMMENT '执行顺序',
    status          VARCHAR(20) NOT NULL COMMENT '状态: success/failed/skipped',
    
    -- 结果信息
    start_time      DATETIME COMMENT '开始时间',
    end_time        DATETIME COMMENT '结束时间',
    duration_ms     INT COMMENT '耗时(毫秒)',
    rows_affected   INT COMMENT '影响行数',
    error_message   TEXT COMMENT '错误信息',
    
    -- 元数据
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_deploy_id (deploy_id),
    INDEX idx_sql_type (sql_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SQL执行记录表';
```

---

## 6. 部署报告表 (deploy_reports)

存储部署报告。

```sql
CREATE TABLE deploy_reports (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    deploy_id       VARCHAR(50) NOT NULL COMMENT '部署ID',
    
    -- 报告信息
    report_type     VARCHAR(20) NOT NULL COMMENT '报告类型: full/summary',
    report_format   VARCHAR(20) NOT NULL COMMENT '报告格式: markdown/html/json',
    report_content  LONGTEXT NOT NULL COMMENT '报告内容',
    
    -- 存储信息
    file_path       VARCHAR(500) COMMENT '文件存储路径',
    
    -- 元数据
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    UNIQUE INDEX uk_deploy_report (deploy_id, report_type, report_format),
    INDEX idx_deploy_id (deploy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部署报告表';
```

---

## JSON 字段格式

### deploy_history.metadata

```json
{
  "svnRevision": {
    "from": 1050,
    "to": 1100
  },
  "jenkinsBuild": {
    "jobName": "product-a-build",
    "buildNumber": 123
  },
  "artifacts": {
    "jars": ["user-service-1.3.0.jar", "order-service-1.3.0.jar"],
    "ddlCount": 2,
    "dmlCount": 1,
    "configChanges": ["application.yml"]
  },
  "verification": {
    "healthCheck": true,
    "versionCheck": true,
    "logCheck": true
  }
}
```

### version_registry.artifacts

```json
{
  "jars": [
    {"name": "user-service-1.3.0.jar", "size": 15200000, "md5": "abc123"},
    {"name": "order-service-1.3.0.jar", "size": 12800000, "md5": "def456"}
  ],
  "ddl": [
    {"name": "001_add_index.sql", "description": "添加索引"}
  ],
  "dml": [
    {"name": "001_init_data.sql", "description": "初始化数据"}
  ],
  "config": [
    {"name": "application.yml.diff", "changes": ["新增配置项"]}
  ]
}
```

### deploy_steps.result

```json
{
  "checks": [
    {"name": "ssh_connectivity", "passed": true},
    {"name": "db_connectivity", "passed": true},
    {"name": "disk_space", "passed": true, "available": "5.2GB"}
  ]
}
```

---

## 索引说明

| 表 | 索引 | 用途 |
|---|---|---|
| deploy_history | idx_product_version | 按产品和版本查询 |
| deploy_history | idx_environment | 按环境查询 |
| deploy_history | idx_status | 按状态查询 |
| deploy_history | idx_start_time | 按时间范围查询 |
| version_registry | uk_product_version | 产品+版本唯一 |
| environment_versions | uk_env_product_service | 环境+产品+服务唯一 |

---

## 数据保留策略

| 表 | 保留策略 |
|---|---|
| deploy_history | 保留 1 年 |
| deploy_steps | 保留 6 个月 |
| sql_execution_log | 保留 6 个月 |
| deploy_reports | 保留 1 年 |
| version_registry | 永久保留 |
| environment_versions | 永久保留 |
