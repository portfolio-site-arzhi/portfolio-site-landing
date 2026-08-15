import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('nuxt.config favicon', () => {
  it('merender favicon ico melalui static app head', () => {
    const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8')

    expect(nuxtConfig).toMatch(/key: 'site-favicon',[\s\S]*rel: 'icon',[\s\S]*type: 'image\/x-icon',[\s\S]*href: '\/favicon\.ico\?v=bf68864d'/)
  })
})
