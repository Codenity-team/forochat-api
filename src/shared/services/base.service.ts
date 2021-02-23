import { NotFoundException } from '@nestjs/common';
import _ = require('lodash');
import { EntityManager, FindOneOptions, ObjectLiteral, QueryRunner, RemoveOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Status } from '../enum/status.enum';
import { IResponseStructure } from '../interfaces/responses.interface';
import { IResponseStructureReturn } from '../interfaces/responsesReturn.interface';
import { IPaginationOptions } from './../interfaces/paginateOptions.interface';

export class BasicService<Entity extends ObjectLiteral> {

    constructor(
        private readonly repository: Repository<Entity>
    ) { }

    /**
     *  Paginate the query results by params
     * @param options Options to paginate
     * @param query Query without executing, just to paginate
     */
    async paginate(options: IPaginationOptions,
        query?: SelectQueryBuilder<Entity> | any[]): Promise<Pagination<Entity>> {
        options.page = options.page || 0;
        options.limit = options.limit || 10;
        options.limit = options.limit > 100 ? 100 : options.limit;

        if (query instanceof SelectQueryBuilder) {

            if (options.where) {
                query.where(options.where);
            }

            if (options.orderBy) {
                query.orderBy(`${query.expressionMap.mainAlias.name}.${options.orderBy}`,
                    options.order);
            }
            return await this.cleanResultPagination(options, query);
        }

        if (query instanceof Array) {

            if (options.where) {
                const auxWhere = {};

                options.where.forEach((e) => {
                    auxWhere[Object.keys(e)[0]] = Object.values(e)[0];
                });

                query = _.filter(query, auxWhere);
            }

            if (options.orderBy) {
                query = _.orderBy(query, [options.orderBy],
                    [(options.order && options.order === 'DESC') ? 'desc' : 'asc']);
            }

            return this.getPaginatedItems(options, query as any[]);
        }

        const queryBuilder = this.repository.createQueryBuilder('T');
        queryBuilder.where(options.where);
        queryBuilder.orderBy(options.orderBy, options.order);

        return await this.cleanResultPagination(options, queryBuilder);
    }

    /**
     *  Paginate a array.
     * @param options Options to paginate
     * @param query Array of result, results of a .query () or a simple array.
     */
    getPaginatedItems(options: IPaginationOptions,
                      query: any[]) {

        if (+options.page <= 0) {
            options.page = 1;
        }

        const offset = (+options.page - 1) * +options.limit;
        const items = _.drop(query, offset).slice(0, +options.limit);
     
        return {
            items,
            meta: {
                currentPage: options.page,
                itemCount: items.length,
                itemsPerPage: options.limit,
                totalItems: query.length,
                totalPages: Math.ceil(query.length / +options.limit),
                pageCount: Math.ceil(items.length / +options.limit)
            },
            links: {}
        };
    }

    /**
     * Delete unwanted properties for the entities
     * @param options Options to paginate
     * @param query Query without executing, just to paginate
     */
    async cleanResultPagination(options: IPaginationOptions,
                                query: SelectQueryBuilder<Entity>): Promise<Pagination<Entity>> {
        const tempResult = await paginate<Entity>(query, options);

        return tempResult;
    }

    /**
     * Creates a new query builder that can be used to build a sql query.
     * @param alias Alias of the table to select 
     * @param queryRunner Instance of 
     */
    createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity> {
        if (queryRunner) {
            return this.repository.createQueryBuilder(alias, queryRunner);
        }

        if (alias) {
            return this.repository.createQueryBuilder(alias);
        }

        return this.repository.createQueryBuilder();

    }

    /**
     *  Execute a raw SQL query and returns a raw database results. 
     * @param query Query to execute.
     */
    query(query: string, parameters?: any[]): Promise<any> {
        if (parameters) {
            return this.repository.query(query, parameters);
        }
        return this.repository.query(query);
    }

    /**
     * Find one entity that matches with options
     * @param options Options to find
     */
    findOneWithOptions(options: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.repository.findOne(options);
    }

    /**
     * Find one entity that matches with options
     * @param options Options to find
     */
    findOneWithOptionsOrFail(options: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.repository.findOneOrFail(options);
    }

    /**
     * Finds first entity that matches given options.
     */
    async findOneOrFail(id: string | number | Date, options?: any): Promise<Entity> {
        if (!id) {
            throw new NotFoundException({
                status: false,
                message: 'The id cant be empty',
                code: '',
            });
        }
        return await this.repository.findOneOrFail(id, options);
    }

    /**
     * Finds first entity that matches given options with this id
     */
    async findOne(id: string | number | Date, options?: any): Promise<Entity> | undefined {
        if (!id) {
            throw new NotFoundException({
                status: false,
                message: 'The id cant be empty',
                code: '',
            });
        }
        return await this.repository.findOne(id, options);
    }

    /**
     * Finds entities that match given options.
     * @param options Defines a special criteria to find specific entities.
     */
    async findWithOptionsOrFail(options: FindOneOptions<Entity>): Promise<Entity[]> | undefined {
        const result = await this.repository.find(options);

        if (result.length === 0) {
            throw new NotFoundException({
                status: false,
                message: 'No results to this query',
                code: '4',
            });
        }

        return result;
    }

    /**
     * Saves a given entity in the database.
     * If entity does not exist in the database then inserts.
     * @param data: Data required to create the entity 
     * @param status status to set
     * @returns the entity created
     */
    async save(data: any, status ?: string) {
        data.status = status ? status : Status.ENABLED;
        return await this.repository.save(data);
    }

    /**
     * Saves a given entity in the database.
     * If entity does not exist in the database then inserts and get the relations.
     * @param data 
     * @param relations 
     * @param code 
     * @returns the entity created with the relations
     */
    async saveAndGetRelations(data: any, relations: string[]): Promise<Entity> {

        data.status = Status.ENABLED;
        const savedEntity = await this.repository.save(data);

        return await this.repository.findOne(savedEntity.id, { relations });
    }

    async updateAndGetRelations(data: any, entity: Entity, relations: string[]) {

        this.repository.merge(entity, data);
        const updatedEntity = await this.repository.save(entity);

        return await this.repository.findOne(updatedEntity.id, { relations });
    }

    /**
     * Find all matches entities
     * @param conditions conditions to find
     */
    async find(conditions: any) {
        return await this.repository.find(conditions);
    }

    /**
     * Find all entities
     */
    async getAll() {
        return await this.repository.find();
    }

    /**
     *  Update the entity in the database
     * @param data Data to update the entity
     * @param entity Entity to update
     * @returns Promise with the updated entity
     */
    async updateEntity(data: any, entity: Entity): Promise<any> {
        data.modificationDate = new Date();

        this.repository.merge(entity, data);

        return await this.repository.save(entity);
    }

    /**
     * Format the returned objects, so that they meet the standards
     * @param response base 
     * @param aditionalKey additional key to be added to the answer
     * @param object object to be added to the response
     * @returns standardized response
     */
    formatReturn(response: IResponseStructure, aditionalKey: string,
                 object: any): IResponseStructureReturn {
        const returnResponse = { ...response };

        if (!object) {
            object = [];
        }

        if (object['modificationDate']) {
            delete object['modificationDate'];
        }

        returnResponse[aditionalKey] = object;

        return returnResponse;
    }
}
