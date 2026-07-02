import { VelixError } from '../errors'

/**
 * Velix Time (api-velix-time) NÃO possui proxy no api-velix-identity-core.
 * A API pública `/v1/api/*` documentada na spec (task #593/#656) cobre apenas
 * Velix.ID (onboarding, checkin, LGPD, me) e Velix Events (guests) — não há
 * nenhum endpoint de ponto/jornada exposto publicamente.
 *
 * Este módulo existe apenas para deixar explícito que a funcionalidade NÃO
 * está implementada — nunca simula sucesso nem retorna dados falsos. Qualquer
 * chamada lança VelixError imediatamente.
 *
 * Gap de servidor: identity-core precisa expor um BFF para api-velix-time
 * antes que este módulo possa ser implementado de verdade (ver task #593).
 */
export class TimeModule {
  private notImplemented(method: string): never {
    throw new VelixError(
      `TimeModule.${method}() não implementado — identity-core ainda não expõe proxy ` +
        'público para api-velix-time (gap de servidor, task #593). Não use este módulo em produção.',
    )
  }

  async punch(): Promise<never> {
    return this.notImplemented('punch')
  }

  async getEspelho(): Promise<never> {
    return this.notImplemented('getEspelho')
  }
}
