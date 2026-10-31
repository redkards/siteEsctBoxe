export default class News {
  id?: number;
  titre!: string;
  newsContent!: string;
  newsPictures?: string;
  publishedAt!: Date;

  constructor(
    titre: string,
    newsContent: string,
    publishedAt: Date,
    newsPictures?: string
  ) {
    this.titre = titre;
    this.newsContent = newsContent;
    this.publishedAt = publishedAt;
    this.newsPictures = newsPictures;
  }
}
