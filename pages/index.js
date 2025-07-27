import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * 首页组件，用于展示政策列表并提供搜索功能。
 *
 * 该组件在加载时会连接 Supabase 数据库，读取 `policies` 表中所有政策，
 * 按日期倒序排序后展示。页面顶部提供搜索框，可以根据政策标题或内容进行关键词过滤。
 */
export default function Home() {
  // 完整的政策数据列表
  const [policies, setPolicies] = useState([]);
  // 搜索关键字
  const [searchTerm, setSearchTerm] = useState('');
  // 根据搜索过滤后的政策列表
  const [filteredPolicies, setFilteredPolicies] = useState([]);

  // 组件加载时从 Supabase 获取数据
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    async function loadPolicies() {
      // 从 policies 表读取数据，按日期倒序排序
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('date', { ascending: false });
      if (!error) {
        setPolicies(data);
        setFilteredPolicies(data);
      } else {
        console.error('Error fetching policies:', error);
      }
    }
    loadPolicies();
  }, []);

  // 当搜索关键字或政策列表变化时重新过滤数据
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPolicies(policies);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredPolicies(
        policies.filter(
          (p) =>
            (p.title && p.title.toLowerCase().includes(lower)) ||
            (p.content && p.content.toLowerCase().includes(lower))
        )
      );
    }
  }, [searchTerm, policies]);

  return (
    <div className="container">
      <header className="header">
        <h1>政策库</h1>
        <input
          type="text"
          placeholder="搜索政策..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <ul className="policy-list">
        {filteredPolicies.map((policy) => (
          <li key={policy.id} className="policy-item">
            <h2>{policy.title}</h2>
            <p className="meta">
              {policy.date} • {policy.region} • {policy.category}
            </p>
            <p>{policy.content}</p>
            {policy.link && (
              <a
                href={policy.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                原文链接
              </a>
            )}
          </li>
        ))}
      </ul>
      {/* 页面样式。使用 styled-jsx 将样式与组件关聚，避免全局污染。 */}
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          font-family: sans-serif;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1rem;
        }
        .header h1 {
          margin: 0;
          font-size: 2rem;
        }
        .header input {
          margin-top: 0.5rem;
          padding: 0.5rem;
          width: 100%;
          max-width: 400px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .policy-list {
          list-style: none;
          padding: 0;
        }
        .policy-item {
          border-bottom: 1px solid #eee;
          padding: 1rem 0;
        }
        .policy-item h2 {
          margin: 0;
          font-size: 1.2rem;
        }
        .policy-item .meta {
          font-size: 0.8rem;
          color: #555;
        }
        .policy-item p {
          margin: 0.5rem 0;
        }
        .policy-item a {
          color: #0070f3;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
