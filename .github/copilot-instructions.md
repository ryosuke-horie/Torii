# Copilot instructions

以下ドキュメントをベースに開発を行います。
回答はこちらをベースに考えてください。

## 基本の開発フロー

### 1.  要件定義

- ChatGPT O1を利用しつつ機能ベースに要件定義を進めていく
- Notionに設計書として機能ベースで残していく

### 2. タスク分解

- 大枠となるタスク分解をNotionのDBに保存してまとめていく
  - 2週間単位のマイルストーンを敷いて対応範囲を検討する
- 2週間のマイルストーン内のタスクを詳細に分割し、GitHub Issueに登録する
  - CRUDのような操作機能単位をベースに分割
  - GitHub Issue内での実装順序
        1. 要件定義内容を元に単体テストを記述する（バックエンド）
        2. API・UIの実装を纏めて１件のIssueで対応
        3. フロントエンドで実装したコンポーネントのシナリオ作成
        4. シナリオからコンポーネントの単体テストを実装

### 3. デザイン

- タスク分解を行なって解像度をもった段階でデザインに入っていく
- OnLookを活用しデザインの手間を減らす
- 1機能単位でデザインを行う

### 4. 実装

- バックエンドAPIはTDDを単体テストで実践する
  - テストのためにもアーキテクチャはレイヤードアーキを意識しディレクトリ毎に責任を明確に分離したい
- 以下の順序に実装を進める
    1. 要件定義内容を元に単体テストを記述する（バックエンド）
    2. API・UIの実装を纏めて１件のIssueで対応
    3. フロントエンドで実装したコンポーネントのシナリオ作成
    4. シナリオからコンポーネントの単体テストを実装
- 機能単位の実装が済んだらE2Eテストを記述する
  - シナリオベースのテストを実装
- テストコードの方針
  - バックエンド
    - 単体テストで網羅
    - E2Eと単体テストのカバレッジにより、ある程度の担保ができると踏む
  - フロントエンド
    - UIに閉じてコンポーネント単位でテストコードを実装する
      - UI関連のライブラリの更新の工数を抑える意図
      - スナップショット的なテストの導入も検討
    - ページコンポーネントのテストはE2Eである程度網羅すると割り切る
  - E2E
    - 正常系のシナリオテストを記載する
    - 重要な機能・シナリオに変更が悪影響を与えないことを担保する

## 前提の考え方

- cloudflare workers + D1のインフラ構成の載せる前提で選定する
  - Edgeランタイムで動作すること
  - ライブラリは小さいサイズであることが条件に入る
- 生成AIを活用した開発がメインとなる
  - ライブラリ自体の知名度は担保する必要がある
  - 開発がストップしなさそうであること

## フロントエンド

### LP

- Next.jsを採用
- Cloudflare Pages+Functionで十分
- 静的サイトとして構築する

### ジム管理側・ユーザー側

- Nextjsを採用
- Cloudflare Workers上でSSRする

### テスト

- コンポーネントのVRT
  - Storybook + reg-suit + storycap
- シナリオE2E
  - Playwright

## バックエンド

- Honoを採用
- レイヤードアーキテクチャを採用
- Rest APIとして実装する
  - tRPCは肌感とAIベースの開発には合わないと考えているため
- DB(SQLite)操作にDrizzleを採用
- 認証にJWTを使用するため、Joseを採用

## 共通

- OpenNextでCloudflare Workers用の雛形でデプロイする

## drizzleスキーマ定義で利用可能な仕様(SQLite)

Cloudflare D1でDrizzle ORMを利用する際に、SQLite用のスキーマ定義に関する関数・定義を網羅的にまとめます。

- 公式ドキュメントおよびライブラリのGitHubに限定して情報を収集します。
- 定義・関数の一覧を作成し、それぞれの使用方法を解説します。
- 可能な限り詳細に、制約、データ型、インデックス、リレーション定義などの機能も含めます。

調査が完了次第、結果をお知らせします。

# Cloudflare D1 × Drizzle ORM: SQLiteスキーマ定義の関数・定義一覧

**Cloudflare D1**はSQLiteベースのサーバレスDBであり、**Drizzle ORM**はTypeScriptでスキーマを定義し型安全に扱えるORMです。以下、**SQLite向けのスキーマ定義**に関する主な関数・定義をカテゴリ別にまとめます（データ型、カラム制約、リレーション、インデックス、ユーティリティ）。すべてCloudflare D1（SQLite）に特化した内容です。他のRDBMS向けの関数とは混同しないよう注意してください。

## 1. データ型定義 (SQLite用カラム型)

Drizzle ORMのSQLiteコア(`drizzle-orm/sqlite-core`)では、SQLiteの5つのストレージクラス（NULL/INTEGER/REAL/TEXT/BLOB）に対応するカラム定義関数が用意されています ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Based%20on%20the%20official%20SQLite,BLOB)) ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=A%20signed%20integer%2C%20stored%20in,the%20magnitude%20of%20the%20value))。代表的なものと使用例は以下の通りです。

- **`integer(name?: string, options?: { mode?: ... })`** – **整数型**カラムを定義します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Based%20on%20the%20official%20SQLite,BLOB)) ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=import%20,core))。SQLiteのINTEGERに対応し、0～8バイトの整数を格納します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Integer))。TypeScript上の扱いを変更する`mode`オプションがあり、`'number'`（デフォルトでnumber型として扱う）, `'boolean'`（真偽値0/1として扱う）, `'timestamp'`（UNIX秒をDate型にマップ）, `'timestamp_ms'`（UNIXミリ秒をDate型にマップ）を指定できます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20you%20can%20customize%20integer,%2F%2F%20Date)) ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Boolean))。たとえば`integer({ mode: 'boolean' })`はデータベース上はINTEGER(0/1)ですが、アプリ側では`boolean`型として扱えます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Boolean))。

- **`real(name?: string)`** – **実数型**カラムを定義します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Real))。SQLiteのREAL（8バイト浮動小数）に対応します。特別なオプションはありません。

- **`text(name?: string, options?: { enum?: string[], length?: number, mode?: ... })`** – **テキスト型**カラムを定義します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Text))。SQLiteのTEXTに対応し、文字列を格納します。`enum`オプションで許容する文字列値のリストを指定すると、TypeScript上そのユニオン型として推論されます（実行時に値チェックは行われません） ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=A%20text%20string%2C%20stored%20using,16LE)) ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20will%20be%20inferred%20as,foo%3A%20string))。例えば`text({ enum: ["guest","user","admin"] })`は型が`"guest"|"user"|"admin"|null`になります。`mode: 'json'`を指定するとJSON文字列として扱う設定もできます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20will%20be%20inferred%20as,foo%3A%20string))（SQLiteのJSON機能に対応）。なお、`length`オプションで長さ制限を指定できます（例: `text({ length: 256 })`）が、これは主にスキーマ上の情報でありSQLite自体が文字列長を強制するわけではありません。

- **`blob(name?: string, options?: { mode?: ... })`** – **バイナリ型**カラムを定義します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=import%20,core))。SQLiteのBLOBに対応し、バイト列を格納します。`mode`オプションで特別な用途に対応できます。`'buffer'`はNode.jsのBufferとして扱う設定、`'json'`はJSON文字列化（将来的なSQLite JSONのバイナリ格納に備えたモード） ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=import%20,core)) ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=blob%28,foo%3A%20string))、`'bigint'`は**BigInt**型として扱う設定です ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Bigint))。SQLiteにビルトインのBigInt型はありませんが、DrizzleではBLOBを利用してJavaScriptのBigIntを格納できます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Bigint))。また、`. $type<Type>()`メソッドを組み合わせることで、BLOBに格納するデータの型を明示してTypeScript上の型を指定できます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=blob%28))（実行時チェックはなし）。

- **（補足）Boolean型** – SQLiteに真偽値型は存在しませんが、Drizzleでは`integer({ mode: 'boolean' })`を用いてブーリアンとして扱う事ができます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Boolean))（内部的には0/1のINTEGER）。専用の`boolean()`関数はありませんが、この方法でbooleanカラムを定義します。

- **（補足）日付/時刻** – SQLiteにDATEやTIMESTAMP型はありません。Drizzleでは`integer`に`{ mode: 'timestamp' }`または`{ mode: 'timestamp_ms' }`を指定することで、Unix時間（秒またはミリ秒）をDateオブジェクトとして扱うことができます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20you%20can%20customize%20integer,%2F%2F%20Date))。またテキスト型に日時文字列を入れる方法もありますが、型安全にDateを扱うには整数＋mode指定が推奨です。

**使用例:**  

```typescript
import { sqliteTable, integer, real, text, blob } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),      // INTEGER PK（自動増分）
  age: integer("age").notNull(),                              // NOT NULL整数
  isActive: integer("is_active", { mode: 'boolean' }),        // 論理値 (0/1)
  score: real("score"),                                       // 実数
  name: text("name", { length: 100 }).notNull(),              // テキスト（最大100文字想定, NOT NULL）
  role: text("role", { enum: ["guest","user","admin"] })      // TEXT（Enum的に型付け）
});
```  

上記の定義により、生成されるDDLは次のようになります（実際のSQLiteテーブル定義） ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=CREATE%20TABLE%20,integer)) ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=,value)):

```sql
CREATE TABLE "users" (
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "age" integer NOT NULL,
  "is_active" integer,
  "score" real,
  "name" text NOT NULL,
  "role" text
);
```  

## 2. カラム制約の定義

各カラム定義にはチェインメソッドで**制約**を付加できます。主なカラム制約メソッドとその使用法は以下の通りです。

- **`.primaryKey(options?)`** – そのカラムを主キー（PRIMARY KEY）に指定します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20to%20make%20integer%20primary,autoIncrement%3A%20true))。SQLiteでは主キーINTEGERは自動的に**AUTOINCREMENT**（ROWIDとしての連番）になりますが、明示的に自動増分を指定する場合は`primaryKey({ autoIncrement: true })`とオプションを付けます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20to%20make%20integer%20primary,autoIncrement%3A%20true))。主キーはテーブルに一つだけ（複合主キーの場合は後述の関数を使用）。下記例のように`id: integer("id").primaryKey()`とすると、自動増分のINTEGER PRIMARY KEY NOT NULLとなります ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20to%20make%20integer%20primary,autoIncrement%3A%20true)) ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=))。

- **`.notNull()`** – そのカラムに**NOT NULL**制約（NULL値禁止）を付与します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=,value))。例: `text("name").notNull()` は「名前」カラムにNULL不可を設定します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=,value))。

- **`.unique(name?: string)`** – そのカラムに**ユニーク制約**を付与します。SQLiteではユニークインデックスとして実装されますが、Drizzleではシンタックスシュガーとして`.unique()`が利用できます ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=id%3A%20int%28%27id%27%29.unique%28%29%2C%20))。オプションで制約名（インデックス名）を文字列で指定可能です ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=id%3A%20int%28%27id%27%29.unique%28%29%2C%20))。例: `int("code").unique()`は`code`カラムにユニーク制約を設定します。複数カラムにまたがるユニーク制約は後述の`uniqueIndex()`/`unique()`関数を使用してください。

- **`.default(value or sql\`...\`)`** – **デフォルト値**を設定します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=import%20,core))。リテラル値（文字列/数値等）を渡すとその値がDEFAULTに設定され、`sql\`...\``で生SQL式を渡すこともできます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=const%20table%20%3D%20sqliteTable%28%27table%27%2C%20,))。例えば`.default(42)`はDEFAULT 42、`.default(sql\`(abs(42))\`)`はDEFAULT (abs(42))のように任意の式を設定できます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=const%20table%20%3D%20sqliteTable%28%27table%27%2C%20,))。特殊キーワード（`CURRENT_TIMESTAMP`等）を使う場合も`sql\`\``で記述可能です。

- **（参考）その他**: Drizzle ORMは他にも列レベルの制約をサポートしています。例えばPostgreSQL/MySQLでは`.autoincrement()`メソッド（SQLiteでは`primaryKey({ autoIncrement: true })`に相当）があります。また、CHECK制約は列単体ではなくテーブル定義内で`check()`関数により指定します（後述）。

**使用例:**  

```typescript
export const products = sqliteTable("products", {
  code: text("code").notNull().unique(),      // NOT NULLかつユニークな文字列
  qty: integer("qty").default(0),             // デフォルト0
  price: integer("price").notNull()
    .default(sql`(100 * 1.1)`),               // 式によるデフォルト値 (110)
  id: integer("id").primaryKey({ autoIncrement: true })
});
```  

上記から生成されるSQLiteテーブル定義例:

```sql
CREATE TABLE "products" (
  "code" text NOT NULL,
  "qty" integer DEFAULT 0,
  "price" integer NOT NULL DEFAULT (100 * 1.1),
  "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  CONSTRAINT "products_code_unique" UNIQUE("code")
);
```  

（※ユニーク制約はインデックスとして表現され、名前は自動生成や指定に従います ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=CONSTRAINT%20))。）

## 3. リレーション関連の定義 (外部キー・リレーション)

テーブル間のリレーション（外部キー制約）を定義するには、**カラム定義で外部キー参照を付ける方法**と、**テーブル定義内でまとめて外部キーを定義する方法**があります。

- **カラム定義での `.references(() => TargetTable.targetColumn, options?)`** – こちらは簡潔に**外部キー参照**を設定する方法です ([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=lastName%3A%20t.text%28,on%28table.email%29%20%5D)) ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=id%3A%20integer%28%27id%27%29,foreign%20key%20with%201%20column))。対象となるテーブルのカラムを関数で返すことで参照を指定します。オプションで`onDelete`や`onUpdate`に `'cascade' | 'restrict' | 'no action' | 'set null'`等を指定可能です ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=export%20const%20countries%20%3D%20sqliteTable,name))。例:  

  ```typescript
  export const orders = sqliteTable("orders", {
    userId: integer("user_id")
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
  });
  ```  

  これにより`orders.user_id`が`users.id`を参照する外部キー（削除/更新時に連鎖的に削除/更新）となります ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=export%20const%20countries%20%3D%20sqliteTable,name))。自参照の場合も同様で、関数内で型を`AnySQLiteColumn`にキャストすることで自テーブルのカラムを参照できます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=countryId%3A%20integer%28%27country_id%27%29.references%28%28%29%20%3D,%28%7B%20columns%3A%20%5Bcities.countryId))。

- **テーブル定義での `foreignKey()` 関数** – 複合キーなど**複数カラムからなる外部キー**や、制約名を付けたい場合に使用します。`foreignKey(() => ({ columns: [テーブル.colA, ...], foreignColumns: [他テーブル.colX, ...] }))`の形で、参照元のカラム配列と参照先テーブルのカラム配列を指定します ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=countryFk%3A%20foreignKey%28%28%29%20%3D,countries.id%2C%20countries.name%5D%2C))。必要に応じて`onDelete`/`onUpdate`もオブジェクト内で指定できます。例:  

  ```typescript
  export const cities = sqliteTable("cities", {
    countryId: integer("country_id"),
    countryName: text("country_name"),
    // ... 他のカラム ...
  }, (t) => ({
    countryFk: foreignKey(() => ({
      columns: [t.countryId],           // 単一カラム外部キー
      foreignColumns: [countries.id],
    })),
    countryIdNameFk: foreignKey(() => ({
      columns: [t.countryId, t.countryName],    // 複合外部キー
      foreignColumns: [countries.id, countries.name],
    }))
  }));
  ```  

  上記では`cities`テーブルに2つの外部キー制約を定義しています。一つは`countryId`→`countries.id`、もう一つは`(countryId,countryName)`→`(countries.id,countries.name)`という複合キーです ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=countryFk%3A%20foreignKey%28%28%29%20%3D,countries.id%2C%20countries.name%5D%2C))。`foreignKey`を使うことで複数カラムの組を参照する制約も表現できます。

**補足:** 外部キー制約はSQLiteの仕様上、省略可能（宣言しなくてもJOINは可能）ですが、D1でもデータ整合性のため定義できます。Drizzle ORMで定義しておけば、マイグレーション生成時に適切な`FOREIGN KEY`句が付加されます。  

## 4. インデックスの定義

**インデックス**を定義するには、テーブル定義時にオプションとしてインデックス関数を指定します（`sqliteTable`の第3引数として関数またはオブジェクトで指定）。以下の関数が利用できます。

- **`index(name)`** – **通常のインデックス**を定義します。`index("idx_name").on(table.col1, table.col2, ...).where(condition?)`という形で使用し、`on()`に対象カラム（複数指定で複合インデックス）を渡します ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=%7D%2C%20%28countries%29%20%3D,))。オプションで`.where(sql\`...\`)`をチェインして**部分インデックス**（条件付きインデックス）を作成することも可能です ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=%2F%2F%20you%20can%20have%20,where%28sql))。例:`index("title_idx").on(posts.title)`([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=title%3A%20t.text%28%29%2C%20ownerId%3A%20t.int%28,on%28table.title%29%2C%20%5D))はpostsテーブルの`title`に索引を貼ります。複合インデックスの場合：`index("name_age_idx").on(users.name, users.age)`のように複数カラムを渡します ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=%7D%2C%20%28countries%29%20%3D,))。

- **`uniqueIndex(name)`** – **ユニークインデックス**（ユニーク制約付きインデックス）を定義します。使い方は`index()`と同様ですが、一意性制約が付加されます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=%7D%2C%20%28countries%29%20%3D,))。例: `uniqueIndex("email_idx").on(users.email)`はメールアドレス列にユニーク制約付きインデックスを作成します ([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=lastName%3A%20t.text%28,on%28table.email%29%20%5D)) ([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=%28table%29%20%3D%3E%20%5B%20t.uniqueIndex%28,))。複数列のユニーク制約も`uniqueIndex("idx_name").on(col1, col2)`で指定可能です（この場合は複合ユニークキーになります）。

- **（エイリアス）`unique(name?)`** – Drizzleでは`uniqueIndex`と同様の機能を持つ`unique()`関数も提供されています ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=id%3A%20int%28%27id%27%29.unique%28%29%2C%20))。`unique().on(t.col1, t.col2)`のように使い、内部的にユニークインデックス/制約を生成します。`unique('custom_name')`のように名前指定も可能です ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=id%3A%20int%28%27id%27%29.unique%28%29%2C%20))。機能的には`uniqueIndex`と重複しますが、ドキュメント上両方記載があります。

**使用例:**  

```typescript
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  slug: text("slug")
}, (t) => [
  index("title_idx").on(t.title),           // 単一カラムのインデックス
  uniqueIndex("slug_idx").on(t.slug)        // slugにユニークインデックス
]);
```  

生成されるDDL例:

```sql
CREATE INDEX "title_idx" ON "posts" ("title");
CREATE UNIQUE INDEX "slug_idx" ON "posts" ("slug");
```  

（テーブル作成時に`CREATE TABLE`と合わせてインデックス作成が行われます。ユニークインデックスはUNIQUE制約と等価です。）  

## 5. その他の関数・ユーティリティ

スキーマ定義を助ける**補助関数やユーティリティ**もDrizzle ORMには用意されています。

- **`sqliteTable(name, columns, options?)`** – SQLite用の**テーブル作成関数**です。第1引数にテーブル名文字列、第2引数に前述のカラム定義オブジェクト、第3引数にテーブル全体の追加定義（インデックスや外部キー、複合主キーなど）を渡します ([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=export%20const%20users%20%3D%20table,guest)) ([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=%28table%29%20%3D%3E%20%5B%20t.uniqueIndex%28,))。基本的にこの関数で各テーブルのスキーマを宣言します。例: `sqliteTable("users", { ...columns... }, (table) => [ ... ])` ([Drizzle ORM - Schema](https://orm.drizzle.team/docs/sql-schema-declaration#:~:text=export%20const%20users%20%3D%20table,guest))。第3引数は省略可能で、渡す場合は先ほど紹介した`index()/uniqueIndex()/foreignKey()/primaryKey()/check()`などをリストまたはオブジェクトで指定します。

- **`sqliteTableCreator(fn)`** – テーブル名に接頭辞/接尾辞など規則を設けたい場合に使える**ヘルパー関数**です。`sqliteTableCreator(nameTransformFn)`を用いて、新しい`sqliteTable`関数を作れます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=There%20is%20a%20,applications%20in%20the%20same%20database))。例えば`const prefixedTable = sqliteTableCreator(name => \`app_\${name}\`);`とすれば、`prefixedTable("users", {...})`が内部的に`sqliteTable("app_users", {...})`を行うようになります ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=There%20is%20a%20,applications%20in%20the%20same%20database))。

- **`primaryKey(...columns)`** – **複合主キー**を定義するための関数です。テーブル定義の追加オプション内で使用し、複数のカラムをまとめて主キーにできます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=email%3A%20text%28%27email%27%29.notNull%28%29%2C%20%7D%2C%20%28pkExample%29%20%3D,name%29))。例: `(t) => ({ pk: primaryKey(t.id, t.code) })`とすると複合PRIMARY KEY("id","code")が生成されます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=email%3A%20text%28%27email%27%29.notNull%28%29%2C%20%7D%2C%20%28pkExample%29%20%3D,name%29))。

- **`check(name, condition)`** – **CHECK制約**（チェック制約）を定義します。テーブル定義内の追加定義で使用し、制約名とSQL条件式を渡します ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=,21%60%29%20%5D))。`condition`には`sql\`...\``で生のSQL条件を指定し、テーブルのカラムを参照できます。例:`check("age_check", sql\`${table.age} > 21\`)`は「ageが21より大きい」というチェック制約を`age_check`という名前で追加します ([Drizzle ORM - Indexes & Constraints](https://orm.drizzle.team/docs/indexes-constraints#:~:text=,21%60%29%20%5D))。

- **`customType(factory)`** – Drizzle独自の**カスタム型定義**を行うための関数です。SQLiteには標準型が少ないですが、例えば独自の型エイリアスや複雑な型マッピングが必要な場合に使用します。`customType<{ data: T; driverData: U }>( {...} )`の形で、`dataType()`メソッドで返すSQL型名や入出力変換ロジックを記述します ([Drizzle ORM - Custom types](https://orm.drizzle.team/docs/custom-types#:~:text=import%20,core)) ([Drizzle ORM - Custom types](https://orm.drizzle.team/docs/custom-types#:~:text=import%20,core))。公式ドキュメントでは、他DBの型（PostgresのJSONBなど）をSQLiteでエミュレートする例などが紹介されています ([Drizzle ORM - Custom types](https://orm.drizzle.team/docs/custom-types#:~:text=Jsonb))。一般的な用途では`integer/text/blob`の`mode`や`$type`で足りるため、必要に応じて使用します。

- **`$type<Type>()` (カラムメソッド)** – 任意の**TypeScript型にカラム型をカスタマイズ**するヘルパーです。既述の通り、例えば`text().$type<"A"|"B">()`のように書くと、そのカラムの型を文字列リテラルユニオンとして扱えます ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=%2F%2F%20will%20be%20inferred%20as,foo%3A%20string))。Blobカラムにオブジェクトを入れる場合などにコンパイル時の型安全性を高めるため使用します ([Drizzle ORM - SQLite column types](https://orm.drizzle.team/docs/column-types/sqlite#:~:text=Customizing%20data%20type))。

- **`InferModel<typeof table>`** – **モデルからTS型を推論**するためのタイプヘルパーです。Drizzle ORMではスキーマ定義がそのまま型定義でもあるため、`InferModel`を使ってテーブルの行型や挿入用型を取得できます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=import%20,orm))。例: `export type User = InferModel<typeof users>`とすると、`users`テーブルのSELECT結果型（各カラムの型を反映した型）が得られます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=import%20,orm))。`InferModel<typeof users, 'insert'>`とするとINSERT時に必要な型（NULL許容や省略可能なデフォルト値考慮）が得られます ([drizzle-orm/drizzle-orm/src/sqlite-core/README.md at main · drizzle-team/drizzle-orm · GitHub](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md#:~:text=phone%3A%20text%28%27phone%27%29%2C%20))。
