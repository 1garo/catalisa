import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      console.log(value)
      this.schema.parse(value);
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
