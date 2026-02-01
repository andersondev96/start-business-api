import { defineConfig } from 'prisma/config'
import path from 'path'

export default defineConfig({
  schema: path.resolve(__dirname, 'schema.test.prisma'),
  datasource: {
    url: 'file:../../test/test.db',
  },
})
