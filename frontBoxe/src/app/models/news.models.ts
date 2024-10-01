export default class News {
  id?: number;
  titre!: string;
  newsContent!: string;
  newsPictures?: string;
  publishedAt!: Date;
}
