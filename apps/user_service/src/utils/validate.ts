import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export async function validatePayload<T>(
  dto: new () => T,
  payload: any,
): Promise<T> {
  const object = plainToInstance(dto, payload);
  const errors = await validate(object ?? {});

  if (errors.length > 0) {
    const errorMessages = errors
      .map((e) => (e.constraints ? Object.values(e.constraints).join(' ') : ''))
      .filter(Boolean)
      .join(', ');

    throw new BadRequestException(errorMessages);
  }

  return object;
}
