
// Supabaseは使用しないため、シンプルなモックを提供します
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// 使用しないダミーのURL/キー
const SUPABASE_URL = "https://example.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "dummy-key";

// TypeScriptエラーを避けるために型アサーションを使用
// @ts-ignore - Supabaseは実際には使用しないのでエラーを無視
export const supabase = createClient(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY
) as unknown as ReturnType<typeof createClient<Database>>;

// Supabaseテーブル関連のコードは使用しないため削除
// モックの初期化関数を空のものに置き換え
async function initSupabaseTable() {
  console.log("注意: Supabaseは使用しません。このコードは実行されません。");
}

// この関数は実行しない
// initSupabaseTable();
