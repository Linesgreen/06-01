/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection UnnecessaryLocalVariableJS

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { QueryPaginationResult, QueryPaginationType } from '../../types/query-sort.type';
//Пайп для применения параметров по умолчанию для отсутствующих полей
//Так же есть проверка в классе QueryPaginationType с помощью class-validator
//не забудь подключить пайп в провайдерах
@Injectable()
export class QueryPaginationPipe implements PipeTransform<QueryPaginationType, Promise<QueryPaginationResult>> {
  async transform(value: QueryPaginationType, metadata: ArgumentMetadata): Promise<QueryPaginationResult> {
    //делаем валидацию записанную в классе QueryPaginationType
    const object: QueryPaginationType = plainToClass(QueryPaginationType, value);

    try {
      await validateOrReject(object); // Валидация объекта QueryPaginationType
    } catch (errors) {
      throw new BadRequestException(`Validation failed: ${errors}`);
    }

    const queryPaginationResult: QueryPaginationResult = {
      searchLoginTerm: object?.searchLoginTerm ?? null,
      searchEmailTerm: object?.searchEmailTerm ?? null,
      searchNameTerm: object?.searchNameTerm ?? null,
      sortBy: object?.sortBy ?? 'createdAt',
      sortDirection: object?.sortDirection === ('asc' || 'ASC') ? 'ASC' : 'DESC',
      pageNumber: object?.pageNumber ? object?.pageNumber : 1,
      pageSize: object?.pageSize ? object?.pageSize : 10,
    };

    return queryPaginationResult;
  }
}
