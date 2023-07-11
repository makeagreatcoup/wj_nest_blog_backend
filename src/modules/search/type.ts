import { PostEntity } from "../content/entities";

/**
 * 全文搜索实现
 * like表示mysql关键字like实现
 * against表示使用mysql的against实现
 * elastic表示使用elasticsearch实现
 */
export type SearchType = 'like'|'against'|'elastic';

export interface ContentConfig{
  searchType?:SearchType
}

/**
 * 搜索体结构的内容类型
 */
export type PostSearchBody = Pick<ClassToPlain<PostEntity>,'title'|'body'|'summary'>&{
  category:string
}