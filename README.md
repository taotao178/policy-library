# 政策库网站示例

该项目是使用 Next.js、Supabase 和 Vercel 构建的个人政策库网站示例。用户可以将政策信息存储在 Supabase 数据库中，并通过前端页面查看和搜索。

## 部署步骤

### 1. 创建 Supabase 项目

1. 登录 [Supabase](https://supabase.com/) 控制台，点击 **New Project** 创建一个新项目，填写项目名称、数据库密码等，等待数据库初始化完成。
2. 在左侧对应栏点击 **SQL Editor**，创建 `policies` 数据表，用于存储政策数据：

```sql
create table if not exists policies (
  id uuid default gen_random_uuid() primary key,
  title text,
  date date,
  category text,
  region text,
  content text,
  link text
);
```

3. 在 **Project Settings** -> **API** 页面获取 `Project URL` 和 `anon` 公钥，在 **Service Role** 中获取 `service_role` 密钥，这些值将在项目中配置。

### 2. 配置环境变量

在项目根目录新建 `.env.local` 文件，填入：

```
NEXT_PUBLIC_SUPABASE_URL=你的 supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon 公钥
SUPABASE_URL=你的 supabase 项目 URL
SUPABASE_SERVICE_ROLE_KEY=你的 service_role 密钥
```

前两个变量用于前端读取数据，后两个变量在 `pages/api/update.js` 中用于服务器端插入数据。

### 3. 安装依赖并本地运行

使用 Node.js 环境运行：

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:3000` 即可查看政策列表页面。

### 4. Vercel 部署与定时任务

1. 在 GitHub 创建他存代存库并提交本项目代码，然后登录 [Vercel](https://vercel.com/) 导入该代码库。
2. 在 Vercel 项目的 **Settings** -> **Environment Variables** 中添加与 `.env.local` 相同的四个变量。
3. 项目含有 `vercel.json` 配置，用于创建定时任务。示例中设置在每天的 UTC 时间 04:00 访问 `/api/update` 接口，以向 Supabase 插入示例政策记录。你可以修改 `schedule` 字段调整时间。

```json
{
  "crons": [
    {
      "path": "/api/update",
      "schedule": "0 4 * * *"
    }
  ]
}
```

部署完成后，Vercel 会自动运行 Next.js 应用，你将获得一个在线网址。

### 5. 自动更新脚本

`pages/api/update.js` 文件示例展示了如何使用 `fetch` 调用 Supabase REST API 进行插入操作，可根据自己的需求在其中编写爬虫或数据接口算法。示例代码使用 `service_role` 密钥在后台插入一条示例政策记录。你也可以根据需要修改该脚本，实现每天从其他源自动更新政策数据。

## 自定义与改进

- **新增字段**：可在 `policies` 表中增加政策类型、地区等字段，并在前端页面添加相应的筛选功能。
- **用户登录**：如果希望限制查看权限，可启用 Supabase Auth 提供的认证功能。
- **界面优化**：可根据个人喜好调整风格，或增加更多页面，如政策详情页。
