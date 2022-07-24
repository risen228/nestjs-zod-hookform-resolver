import { toNestError, validateFieldsNatively } from '@hookform/resolvers'
import { z } from 'nestjs-zod/z'
import { appendErrors, FieldError, FieldErrors } from 'react-hook-form'
import type { Resolver } from './types'

const parseErrorSchema = (
  zodErrors: z.ZodIssue[],
  validateAllFieldCriteria: boolean
) => {
  const errors: Record<string, FieldError> = {}
  while (zodErrors.length > 0) {
    const error = zodErrors[0]
    const { code, message, path } = error
    const _path = path.join('.')

    if (!errors[_path]) {
      if ('unionErrors' in error) {
        const unionError = error.unionErrors[0].errors[0]

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
        }
      } else {
        errors[_path] = { message, type: code }
      }
    }

    if ('unionErrors' in error) {
      error.unionErrors.forEach((unionError) =>
        unionError.errors.forEach((e) => zodErrors.push(e))
      )
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types
      const messages = types?.[error.code]

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        messages
          ? ([] as string[]).concat(messages as string[], error.message)
          : error.message
      ) as FieldError
    }

    zodErrors.shift()
  }

  return errors
}

export const nestJsZodResolver: Resolver =
  (schema, schemaOptions, resolverOptions = {}) =>
  async (values, _, options) => {
    try {
      const data = await schema[
        resolverOptions.mode === 'sync' ? 'parse' : 'parseAsync'
      ](values, schemaOptions)

      if (options.shouldUseNativeValidation) {
        validateFieldsNatively({}, options)
      }

      return {
        errors: {} as FieldErrors,
        values: resolverOptions.rawValues ? values : data,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        values: {},
        errors: error.isEmpty
          ? {}
          : toNestError(
              parseErrorSchema(
                error.errors,
                !options.shouldUseNativeValidation &&
                  options.criteriaMode === 'all'
              ) as unknown as FieldErrors,
              options
            ),
      }
    }
  }
