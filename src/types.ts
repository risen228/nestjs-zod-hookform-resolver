import { z } from 'nestjs-zod/z'
import { FieldValues, ResolverOptions, ResolverResult } from 'react-hook-form'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Resolver = <T extends z.Schema<any, any>>(
  schema: T,
  schemaOptions?: Partial<z.ParseParams>,
  factoryOptions?: {
    /**
     * @default async
     */
    mode?: 'async' | 'sync'
    /**
     * Return the raw input values rather than the parsed values.
     * @default false
     */
    rawValues?: boolean
  }
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>
) => Promise<ResolverResult<TFieldValues>>
