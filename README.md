# DX-TJL

**DX-TJL** は、建設・測量・土木分野における業務情報を統合・管理するためのツールです。 「日程・工程表」「社員名簿」「人員配置表」「車両・機材管理表」など、従来は個別に管理されていた情報をリンクさせ、現場とオフィスの両方で効率的に活用できる仕組みを提供します。

## 🎯 目的

- 業務データを一元管理し、重複入力や情報の齟齬を防ぐ
    
- 現場担当者と管理者が同じ情報をリアルタイムに共有できる環境を整備
    
- プロジェクト進行に必要な「人・モノ・時間」のリソースを見える化
    

## ✨ 主な機能

- **日程・工程表管理**：ガントチャートで進捗を可視化
    
- **社員名簿**：社員情報を一元管理し、配置や連絡に活用
    
- **人員配置表**：現場ごとの人員割り当てを自動・半自動で生成
    
- **車両・機材管理**：利用状況や予約状況を追跡
    
- **データ連携**：各表の情報をリンクさせ、変更が全体に反映される仕組み
    
- **ログ・履歴管理**：更新履歴を残し、透明性と再現性を確保
    

## 📂 フォルダ構成と概要

src/
├── App.css              # App.jsx 用スタイル
├── App.jsx              # アプリのメインコンポーネント（ビュー切替）
├── index.css            # グローバルスタイル
├── main.jsx             # React エントリーポイント
│
├── assets/              # 静的ファイル（例: react.svg）
│
├── components/          # UIコンポーネント群
│   ├── GanttView.jsx        # ガントチャート表示
│   ├── Toolbar.jsx          # ツールバー
│   ├── ExcelData.jsx        # 工事データ表（CSV由来）
│   ├── Header.jsx           # ヘッダー（メニュー/タイトル）
│   ├── IndividualView.jsx   # 個人別ビュー
│   ├── KoujiView.jsx        # 工事一覧ビュー
│   ├── ManpowerView.jsx     # 人員配置ビュー
│   ├── ShainView.jsx        # 社員名簿ビュー
│   └── common/
│       └── ExcelHeader.jsx  # ガントチャート用テーブルヘッダー
│
├── constants/
│   ├── initialData.js       # 初期データ（CSV形式）
│   └── uiConstants.js       # UI関連定数
│
├── firebase/
│   └── firebaseConfig.js    # Firestore / Auth 設定
│
├── hooks/
│   ├── useProjects.js       # Firestore: projects データ取得/更新
│   └── useShain.js          # Firestore: 社員リスト取得/更新
│
└── utils/
    ├── dataUtils.js         # CSVパース/変換
    ├── dateUtils.js         # 日付フォーマット/計算
    └── exportUtils.js       # CSVエクスポート

```

## 🚀 セットアップ

# クローン
git clone https://github.com/sato-dotcom/DX-TJL.git
cd DX-TJL

# 依存関係インストール（例: Node.js 環境の場合）
npm install

# 開発サーバ起動
npm start

```

## 🛠️ 技術スタック

- フロントエンド: React
    
- バックエンド: Firebase (Firestore, Auth)
    
- データ管理: CSV 入出力 + Firestore
    
- ユーティリティ: 独自 hooks / utils によるデータ処理
    

## 📖 利用シナリオ例

- **社員を追加** → 社員名簿に反映され、人員配置表や工程表にも自動リンク
    
- **工事データを更新** → 工事一覧ビューとガントチャートに即時反映
    
- **車両予約を登録** → 他のユーザーも同じ情報をリアルタイムで確認可能
    

## 🤝 貢献方法

- Issue でのバグ報告・機能提案を歓迎
    
- Pull Request 前に簡単な説明をお願いします
    
- コーディング規約やドキュメント整備は随時追加予定
    

## 📜 ライセンス

TBD（未設定）
