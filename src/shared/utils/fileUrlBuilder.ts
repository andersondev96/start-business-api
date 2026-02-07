export class FileUrlBuilder {
  private static getBaseUrl(): string {
    return process.env.disk === 'local'
      ? `${process.env.APP_API_URL}`
      : `${process.env.AWS_BUCKET_URL}`
  }

  static build(
    filename: string | null | undefined,
    folder: string
  ): string | null {
    if (!filename) return null
    return `${this.getBaseUrl()}/${folder}/${filename}`
  }

  static buildMany(filenames: string[] | undefined, folder: string): string[] {
    if (!filenames || filenames.length === 0) return []

    return filenames
      .filter((file) => file && file.length > 0)
      .map((file) => this.build(file, folder) as string)
  }
}
