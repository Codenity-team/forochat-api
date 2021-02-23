import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { IResponseStructureReturn } from 'src/shared/interfaces/responsesReturn.interface';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';
import { userResponses } from '../../shared/responses/users.response';
import { CreateUserDTO } from './dto/createUserDTO.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   *  Responsible for creating the user
   * @param data object with the required data to create the user
   */
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data, userResponses.creation);
  }

  /**
   * Get all users.
   * @returns Promise with alls users.
   */
  @Get()
  async findAll(): Promise<any> {
    return await this.userService.findAll();
  }

  /**
   * Gets a user with specified id
   *
   * @param id user id
   */
  @Get(':id')
  findById(@Param('id') id: number): Promise<IResponseStructureReturn> {
    return this.userService.findById(id, userResponses.list);
  }

  /**
   * Gets a user with specified id
   *
   * @param id user id
   */
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: CreateUserDTO,
  ): Promise<IResponseStructureReturn> {
    return this.userService.update(data, id, userResponses.creation);
  }
}
