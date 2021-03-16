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
import { CreateEventDTO } from './dto/createEventDTO.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly userService: EventsService) {}

  /**
   *  Responsible for creating the user
   * @param data object with the required data to create the user
   */
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() data: CreateEventDTO) {
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
    @Body() data: CreateEventDTO,
  ): Promise<IResponseStructureReturn> {
    return this.userService.update(data, id, userResponses.creation);
  }
}
