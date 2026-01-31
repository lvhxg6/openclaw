# 发布包结构规范

## 标准目录结构（多数据库支持）

```
release-{product}-{version}-{date}/
├── RELEASE-NOTES.md           # 发布说明（自动生成）
├── CHANGELOG.md               # 变更日志（自动生成）
├── release-manifest.json      # 发布清单（机器可读）
│
├── jars/                      # 服务 jar 包
│   ├── user-service-1.2.0.jar
│   ├── order-service-1.2.0.jar
│   └── ...
│
├── sql/                       # 数据库变更（按数据库类型分目录）
│   ├── opengauss/             # OpenGauss 数据库
│   │   ├── full/              # 全量脚本
│   │   │   ├── ddl/
│   │   │   │   ├── 001_create_user_table.sql
│   │   │   │   └── 002_create_order_table.sql
│   │   │   └── dml/
│   │   │       ├── 001_init_config.sql
│   │   │       └── 002_init_dict.sql
│   │   ├── incremental/       # 增量脚本
│   │   │   ├── ddl/
│   │   │   │   └── 001_add_phone_column.sql
│   │   │   └── dml/
│   │   │       └── 001_update_config.sql
│   │   └── rollback/          # 回滚脚本
│   │       └── 001_rollback_phone_column.sql
│   │
│   ├── greatdb/               # GreatDB (万里数据库)
│   │   ├── full/
│   │   ├── incremental/
│   │   └── rollback/
│   │
│   ├── goldendb/              # GoldenDB (中兴分布式)
│   │   ├── full/
│   │   ├── incremental/
│   │   └── rollback/
│   │
│   ├── panwei/                # 盘维数据库
│   │   ├── full/
│   │   ├── incremental/
│   │   └── rollback/
│   │
│   └── pg/                    # PostgreSQL
│       ├── full/
│       ├── incremental/
│       └── rollback/
│
├── config/                    # 配置变更
│   ├── application-prod.yml.diff   # 配置差异
│   └── nginx.conf.diff
│
└── scripts/                   # 部署脚本
    ├── deploy.sh              # 部署脚本
    ├── rollback.sh            # 回滚脚本
    └── verify.sh              # 验证脚本
```

## 支持的数据库类型

| 数据库类型 | 目录标识 | 客户端工具 | 说明 |
|-----------|---------|-----------|------|
| OpenGauss | `opengauss` | gsql | 华为开源数据库 |
| GreatDB | `greatdb` | mysql | 万里数据库 (MySQL 兼容) |
| GoldenDB | `goldendb` | mysql | 中兴分布式数据库 (MySQL 兼容) |
| 盘维数据库 | `panwei` | pwcli | 盘维数据库 |
| PostgreSQL | `pg` | psql | 开源 PostgreSQL |

## 文件命名规范

### 发布包命名

```
release-{product}-{version}-{date}.tar.gz

示例:
release-product-a-v1.3.0-20260131.tar.gz
release-user-center-v2.0.0-20260131.tar.gz
```

### SQL 文件命名

```
{序号}_{操作描述}.sql

示例:
001_create_user_table.sql
002_add_phone_column.sql
003_create_index_phone.sql
```

### JAR 包命名

```
{service-name}-{version}.jar

示例:
user-service-1.3.0.jar
order-service-1.3.0.jar
```

## release-manifest.json 格式（多数据库版本）

```json
{
  "product": "product-a",
  "version": "v1.3.0",
  "type": "incremental",
  "baseVersion": "v1.2.0",
  "createdAt": "2026-01-31T10:30:00Z",
  "svnRevision": {
    "from": 1050,
    "to": 1100
  },
  "databases": {
    "supported": ["opengauss", "greatdb", "goldendb", "panwei", "pg"],
    "sqlStats": {
      "opengauss": {
        "full": { "ddl": 5, "dml": 3 },
        "incremental": { "ddl": 2, "dml": 1 },
        "rollback": 2
      },
      "greatdb": {
        "full": { "ddl": 5, "dml": 3 },
        "incremental": { "ddl": 2, "dml": 1 },
        "rollback": 2
      },
      "goldendb": {
        "full": { "ddl": 5, "dml": 3 },
        "incremental": { "ddl": 2, "dml": 1 },
        "rollback": 2
      },
      "panwei": {
        "full": { "ddl": 5, "dml": 3 },
        "incremental": { "ddl": 2, "dml": 1 },
        "rollback": 2
      },
      "pg": {
        "full": { "ddl": 5, "dml": 3 },
        "incremental": { "ddl": 2, "dml": 1 },
        "rollback": 2
      }
    }
  },
  "artifacts": {
    "jars": [
      {
        "name": "user-service-1.3.0.jar",
        "size": 15200000,
        "md5": "abc123..."
      },
      {
        "name": "order-service-1.3.0.jar",
        "size": 12800000,
        "md5": "def456..."
      }
    ],
    "config": [
      {
        "name": "application.yml.diff",
        "changes": ["新增 redis.timeout 配置"]
      }
    ]
  },
  "changelog": [
    {
      "type": "feature",
      "description": "新增手机号登录功能",
      "issue": "#123"
    },
    {
      "type": "bugfix",
      "description": "修复用户列表分页问题",
      "issue": "#124"
    }
  ],
  "dependencies": {
    "minJavaVersion": "11",
    "requiredServices": ["redis"]
  }
}
```

## 发布包存储

### 存储位置

```
/releases/
├── product-a/
│   ├── full/                  # 全量包
│   │   ├── v1.0.0/
│   │   └── v2.0.0/
│   └── incremental/           # 增量包
│       ├── v1.0.0-v1.1.0/
│       ├── v1.1.0-v1.2.0/
│       └── v1.2.0-v1.3.0/
└── product-b/
    └── ...
```

### 保留策略

- 全量包：保留最近 5 个版本
- 增量包：保留最近 10 个版本
- 超过保留期限的包自动归档到冷存储

## SQL 脚本规范

### 多数据库 SQL 差异处理

由于不同数据库语法存在差异，需要为每种数据库类型维护对应的 SQL 脚本：

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           同一功能的多数据库 SQL 示例                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  功能: 添加字段 (带默认值)                                                               │
│                                                                                         │
│  sql/opengauss/incremental/ddl/001_add_phone_column.sql:                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ALTER TABLE t_user ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';      │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  sql/greatdb/incremental/ddl/001_add_phone_column.sql:                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ALTER TABLE t_user ADD COLUMN phone VARCHAR(20) DEFAULT '' COMMENT '手机号';   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  sql/goldendb/incremental/ddl/001_add_phone_column.sql:                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ALTER TABLE t_user ADD COLUMN phone VARCHAR(20) DEFAULT '' COMMENT '手机号';   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  sql/panwei/incremental/ddl/001_add_phone_column.sql:                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ALTER TABLE t_user ADD phone VARCHAR2(20) DEFAULT '';                          │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  sql/pg/incremental/ddl/001_add_phone_column.sql:                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ALTER TABLE t_user ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';      │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 数据库语法差异对照表

| 功能 | OpenGauss/PG | GreatDB/GoldenDB | 盘维 |
|------|-------------|------------------|------|
| 添加字段 | `ADD COLUMN IF NOT EXISTS` | `ADD COLUMN` | `ADD` |
| 字符串类型 | `VARCHAR(n)` | `VARCHAR(n)` | `VARCHAR2(n)` |
| 字段注释 | `COMMENT ON COLUMN` | `COMMENT '...'` | `COMMENT ON COLUMN` |
| 创建索引 | `CREATE INDEX CONCURRENTLY` | `CREATE INDEX` | `CREATE INDEX ONLINE` |
| 判断存在 | `IF NOT EXISTS` | 需用存储过程 | `IF NOT EXISTS` |
| 自增主键 | `SERIAL` / `GENERATED` | `AUTO_INCREMENT` | `SEQUENCE` |

### DDL 脚本要求

```sql
-- 文件头注释
-- 脚本名称: 001_add_phone_column.sql
-- 数据库类型: opengauss
-- 作者: 张三
-- 创建时间: 2026-01-30
-- 描述: 用户表添加手机号字段
-- 影响表: t_user
-- 预计执行时间: < 1s
-- 是否可回滚: 是

-- 正向脚本
ALTER TABLE t_user ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT '';
COMMENT ON COLUMN t_user.phone IS '手机号';

-- 验证语句 (注释形式，供人工验证)
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 't_user' AND column_name = 'phone';
```

### DML 脚本要求

```sql
-- 文件头注释
-- 脚本名称: 001_init_config.sql
-- 作者: 张三
-- 创建时间: 2026-01-30
-- 描述: 初始化系统配置
-- 影响表: t_config
-- 预计影响行数: 5
-- 是否可回滚: 是

-- 正向脚本
INSERT INTO t_config (config_key, config_value, description)
VALUES 
  ('sms.enabled', 'true', '短信开关'),
  ('sms.provider', 'aliyun', '短信服务商');

-- 验证语句
-- SELECT * FROM t_config WHERE config_key LIKE 'sms.%';
```

### 回滚脚本要求

```sql
-- 文件头注释
-- 脚本名称: 001_rollback_user_index.sql
-- 对应正向脚本: 001_add_user_index.sql
-- 描述: 回滚用户表手机号索引

-- 回滚脚本
ALTER TABLE t_user DROP INDEX idx_phone;
```
