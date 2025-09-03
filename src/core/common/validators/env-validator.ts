import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';

export function validateEnvs(
  config: Record<string, unknown>,
  envClass: new () => object,
): object {
  const validateConfig = plainToInstance(envClass, config);
  const errors = validateSync(validateConfig);

  if (errors.length > 0) {
    const messages = errors[0].constraints as Record<string, string>;
    const logger = new Logger('ConfigService');
    logger.error(
      `error trying to read variable: "${errors[0].property}" with value "${errors[0].value}"`,
    );
    throw new Error(
      `\n${errors.toString()}\n+ ${Object.values(messages).join('\n+ ')}`,
    );
  }

  return validateConfig;
}
