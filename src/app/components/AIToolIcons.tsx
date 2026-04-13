import React from 'react';

interface IconProps {
  size?: number;
}

// PPT试题抽取 - 文档+问号
export const PPTExtractIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="pptGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#pptGradient)" />
    <rect x="14" y="12" width="20" height="24" rx="4" fill="white" fillOpacity="0.95" />
    <rect x="18" y="17" width="12" height="2" rx="1" fill="#ef4444" />
    <rect x="18" y="22" width="8" height="2" rx="1" fill="#ef4444" fillOpacity="0.6" />
    <rect x="18" y="27" width="10" height="2" rx="1" fill="#ef4444" fillOpacity="0.6" />
    <circle cx="32" cy="32" r="8" fill="#dc2626" />
    <text x="32" y="36" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">?</text>
  </svg>
);

// 智能出题 - 大脑/神经网络
export const QuizGenIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="quizGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#quizGradient)" />
    {/* 大脑轮廓 */}
    <path
      d="M16 24c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M32 24c0 5.5-4.5 10-10 10s-10-4.5-10-10"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* 神经网络节点 */}
    <circle cx="20" cy="20" r="2.5" fill="white" />
    <circle cx="28" cy="20" r="2.5" fill="white" />
    <circle cx="24" cy="28" r="2.5" fill="white" />
    <circle cx="18" cy="28" r="2" fill="white" fillOpacity="0.7" />
    <circle cx="30" cy="28" r="2" fill="white" fillOpacity="0.7" />
    {/* 连接线 */}
    <line x1="20" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    <line x1="20" y1="20" x2="24" y2="28" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    <line x1="28" y1="20" x2="24" y2="28" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
  </svg>
);

// 思维导图 - 分支结构
export const MindMapIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="mindGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#mindGradient)" />
    {/* 中心节点 */}
    <circle cx="24" cy="24" r="6" fill="white" />
    {/* 分支节点 */}
    <circle cx="14" cy="16" r="4" fill="white" fillOpacity="0.9" />
    <circle cx="36" cy="16" r="4" fill="white" fillOpacity="0.9" />
    <circle cx="14" cy="32" r="4" fill="white" fillOpacity="0.9" />
    <circle cx="36" cy="32" r="4" fill="white" fillOpacity="0.9" />
    {/* 连接线 */}
    <line x1="20" y1="20" x2="16" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="20" x2="34" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="28" x2="16" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="28" x2="34" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 视频/音频转写 - 麦克风+波形
export const TranscriptIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="transGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#transGradient)" />
    {/* 麦克风 */}
    <rect x="20" y="12" width="8" height="14" rx="4" fill="white" />
    <path
      d="M16 22v2c0 4.4 3.6 8 8 8s8-3.6 8-8v-2"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="24" y1="32" x2="24" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="36" x2="28" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    {/* 声波 */}
    <line x1="10" y1="24" x2="10" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="14" y1="22" x2="14" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="34" y1="22" x2="34" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <line x1="38" y1="24" x2="38" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>
);

// PPT课件生成 - 幻灯片+星星
export const PPTGenIcon: React.FC<IconProps> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="genGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#genGradient)" />
    {/* 幻灯片 */}
    <rect x="12" y="14" width="20" height="16" rx="3" fill="white" fillOpacity="0.95" />
    <rect x="14" y="17" width="16" height="2" rx="1" fill="#8b5cf6" />
    <rect x="14" y="21" width="10" height="2" rx="1" fill="#8b5cf6" fillOpacity="0.5" />
    <rect x="14" y="25" width="12" height="2" rx="1" fill="#8b5cf6" fillOpacity="0.5" />
    {/* 星星 */}
    <path
      d="M34 12l1.5 3.5 3.5 0.5-2.5 2.5 0.5 3.5-3-1.5-3 1.5 0.5-3.5-2.5-2.5 3.5-0.5z"
      fill="white"
    />
    {/* 闪光效果 */}
    <circle cx="36" cy="30" r="1.5" fill="white" fillOpacity="0.8" />
    <circle cx="32" cy="34" r="1" fill="white" fillOpacity="0.6" />
  </svg>
);

// 工具图标映射
export const toolIcons = {
  ppt: PPTExtractIcon,
  quiz: QuizGenIcon,
  mindmap: MindMapIcon,
  transcript: TranscriptIcon,
  pptgen: PPTGenIcon,
};

export default toolIcons;
